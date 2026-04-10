/*
  Warnings:

  - You are about to drop the `_AuctionToBid` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_AuctionToBid` DROP FOREIGN KEY `_AuctionToBid_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AuctionToBid` DROP FOREIGN KEY `_AuctionToBid_B_fkey`;

-- AlterTable
ALTER TABLE `Bid` MODIFY `auctionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `productImageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_AuctionToBid`;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productImageId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productImageId_fkey` FOREIGN KEY (`productImageId`) REFERENCES `ProductImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productImageId_fkey` FOREIGN KEY (`productImageId`) REFERENCES `ProductImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
