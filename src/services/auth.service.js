import prisma from "../lib/prismaClient.js";
import jwt from "jsonwebtoken";

export const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

export const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
};

export const createUser = async (dataObj) => {
    console.log('dataObj', dataObj)
  const newUser = await prisma.user.create({
    data: {
      firstName: dataObj.firstName,
      lastName: dataObj.lastName,
      username: dataObj.username,
      email: dataObj.email,
      password: dataObj.hashPassword,
      role: dataObj.role,
      street: dataObj.street,
      city: dataObj.city,
      postalCode: dataObj.postalCode,
    },
  });
  return newUser;
};

export const editUser = async (email, username, hashPassword) => {
  const result = await prisma.user.update({
    where: { email: email },
    data: {
      username,
      password: hashPassword,
      role: user.role,
    },
  });
  return result;
};

export const createToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
  return token;
};