/*
  Warnings:

  - The primary key for the `Auction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Auction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `productId` on the `Auction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `auctionId` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `productImageId` on the `Image` table. All the data in the column will be lost.
  - You are about to alter the column `auctionId` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productImageId` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Auction` DROP FOREIGN KEY `Auction_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Auction` DROP FOREIGN KEY `Auction_shippingAddressId_fkey`;

-- DropForeignKey
ALTER TABLE `Bid` DROP FOREIGN KEY `Bid_auctionId_fkey`;

-- DropForeignKey
ALTER TABLE `Bid` DROP FOREIGN KEY `Bid_bidderId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_productImageId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_auctionId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_productImageId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_sellerId_fkey`;

-- DropIndex
DROP INDEX `Address_userId_fkey` ON `Address`;

-- DropIndex
DROP INDEX `Auction_productId_fkey` ON `Auction`;

-- DropIndex
DROP INDEX `Auction_shippingAddressId_fkey` ON `Auction`;

-- DropIndex
DROP INDEX `Image_productImageId_fkey` ON `Image`;

-- DropIndex
DROP INDEX `Payment_auctionId_fkey` ON `Payment`;

-- DropIndex
DROP INDEX `Product_categoryId_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_productImageId_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_sellerId_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Auction` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `productId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Bid` MODIFY `auctionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `productImageId`,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `auctionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `productImageId`,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `ProductImage`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_bidderId_fkey` FOREIGN KEY (`bidderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
