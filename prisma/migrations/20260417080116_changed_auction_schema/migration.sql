/*
  Warnings:

  - You are about to alter the column `status` on the `Auction` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Auction` MODIFY `status` ENUM('WAITING', 'ACTIVE', 'CANCELLED', 'CLOSED_UNSOLD', 'SOLD') NOT NULL DEFAULT 'ACTIVE';
