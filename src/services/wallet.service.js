import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

export async function depositMoney(userId, depositAmount) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the wallet first. Use findFirst to avoid unique index issues.
    let wallet = await tx.wallet.findFirst({
      where: { userId: userId },
    });

    // 2. If no wallet exists (e.g. for users created before this feature), create it now.
    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId: userId,
          amount: 0,
        },
      });
    }

    // 3. Create the transaction record using the wallet's ID
    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: depositAmount,
        type: "DEPOSIT",
      },
    });

    // 4. Increment the wallet amount automatically
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        amount: {
          increment: depositAmount,
        },
      },
    });

    return updatedWallet;
  });
}