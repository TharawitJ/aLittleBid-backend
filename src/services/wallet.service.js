import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

export async function depositMoney(userId, depositAmount) {
    
  return await prisma.$transaction(async (tx) => {
    // 1. Create the transaction record
    await tx.transaction.create({
      data: {
        walletId: userId.toString(), // or fetch the actual wallet ID
        amount: depositAmount,
        type: "DEPOSIT",
      },
    });

    // 2. Increment the wallet amount automatically
    const updatedWallet = await tx.wallet.update({
      where: { userId: userId },
      data: {
        amount: {
          increment: depositAmount, // Prisma handles the math: current + new
        },
      },
    });

    return updatedWallet;
  });
}