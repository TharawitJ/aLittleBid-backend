import createError from "http-errors";
import {
  createToken, createUser, findUserByEmail } from "../services/auth.service.js";
import bcrypt from "bcrypt";
import prisma from "../lib/prismaClient.js";

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
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  // 1. แกะค่าจาก body ตามโครงสร้างที่ Frontend ส่งมา
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role, // รับเป็น Array ตามที่ Frontend ส่ง
    address, // รับเป็น Object ตามที่ Frontend ส่ง
  } = req.body;

  // ดึงค่าข้างใน address ออกมา
  const { street, city, postalCode } = address || {};

  try {
    await prisma.$connect();
    console.log("Connected to Database");

    // 2. Validation: ตรวจสอบข้อมูลให้ครบถ้วน
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !street ||
      !city ||
      !postalCode ||
      !roles ||
      roles.length === 0
    ) {
      //  return เพื่อหยุดฟังก์ชันทันที
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await findUserByEmail(email);
    if (user) {
      throw createError(400, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 5);

    // 3. สร้าง User ผ่าน Service
    const newUser = await createUser({
      firstName,
      lastName,
      username,
      email,
      hashPassword,
      role: roles[0],
      street,
      city,
      postalCode,
    });

    return res.status(201).json({
      message: "Register Success",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
        street: newUser.street,
        city: newUser.city,
        postalCode: newUser.postalCode,
      },
    });
  } catch (error) {
    next(error); // ส่งไปที่ Error Middleware
  }
}