import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

export async function getUserById(id) {
  const result = await prisma.user.findUnique({
    where: { id }});

  return result;
}
