import "dotenv/config";
import createError from "http-errors";
import {
  createToken,
  createUser,
  findUserByEmail,
} from "../services/auth.service.js";
import bcrypt from "bcrypt";
import prisma from "../lib/prismaClient.js";
import {
  updateOtp,
  findUserByOtp,
  clearOtp,
} from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

export async function register(req, res, next) {
  const {
    firstname,
    lastname,
    username,
    email,
    phone,
    password,
    role,
    street,
    city,
    postalCode,
    label,
    state,
    country,
  } = req.body;

  try {
    // Validation: ตรวจสอบข้อมูลให้ครบถ้วน
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !phone ||
      !street ||
      !city ||
      !label ||
      !country ||
      !role ||
      role.length === 0
    ) {
      //  return เพื่อหยุดฟังก์ชันทันที
      console.log("in validation block");
      throw createError(400, "Please fill in all fields");
    }

    const user = await findUserByEmail(email);
    if (user) {
      throw createError(400, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 5);

    // สร้าง User ผ่าน Service
    const newUser = await createUser({
      firstname,
      lastname,
      username,
      email,
      phone,
      hashPassword,
      role,
      street,
      city,
      postalCode,
      label,
      state,
      country,
    });

    return res.status(201).json({
      message: "Register Success",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        address: newUser.addresses?.[0] || null,
      },
    });
  } catch (error) {
    console.log("Caught in controller");
    next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) throw createError(401, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, "Invalid credentials");

    const token = await createToken(user);
    return res.status(200).json({
      message: "Login Success",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// เก็บฟังก์ชันการทำงาน เช่น requestOTP, verifyOTP, resetPassword

// ตั้งค่า Nodemailer (ใช้ค่าจาก .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password here, NOT your Gmail login password
  },
});

// --- 1. Request OTP ---
export async function requestOTP(req, res, next) {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) throw createError(404, "User not found with this email");

    // สุ่ม OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000); // หมดอายุใน 10 นาที

    // บันทึกลง Database ผ่าน Service
    await updateOtp(email, otp, expires);

    // ส่ง Email
    await transporter.sendMail({
      from: `"A Little Bid" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<h2 style="color: #8B1A1A;">Verification Code: ${otp}</h2>
             <p>This code will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
}

// --- 2. Verify OTP ---
export async function verifyOTP(req, res, next) {
  const { email, otp } = req.body;
  try {
    const user = await findUserByOtp(email, otp);
    if (!user) throw createError(400, "Invalid or expired OTP");

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
}

// --- 3. Reset Password ---
export async function resetPassword(req, res, next) {
  const { email, otp, newPassword } = req.body;
  try {
    // เช็คอีกครั้งว่า OTP ยังถูกต้อง (Security Check)
    const user = await findUserByOtp(email, otp);
    if (!user) throw createError(400, "Invalid session or OTP expired");

    // Hash รหัสผ่านใหม่
    const hashPassword = await bcrypt.hash(newPassword, 5);

    // อัปเดตรหัสใหม่และลบ OTP ออกผ่าน Service
    await clearOtp(email, hashPassword);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
}

// Google Login -------------------------------------------------------------------
export async function googleLogin(req, res) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  console.log("CLIENT_ID จาก ENV:", process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  console.log("Token:", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // 1. ดึงค่า picture เพิ่มเข้ามาจาก payload
    const { email, given_name, family_name, name, picture } = payload;
    console.log("Google Payload:", payload);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstname: given_name || name,
          lastname: family_name || "User",
          username: email.split("@")[0],
          password: "GOOGLE_USER_PASSWORD",
          role: "BUYER",
          phone: "0000000000",
          avatarUrl: picture,
        },
      });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      // 3. ส่ง avatarUrl กลับไปให้ Frontend
      user: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
