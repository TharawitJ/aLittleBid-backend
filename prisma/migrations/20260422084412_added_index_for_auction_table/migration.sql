-- AlterTable
ALTER TABLE `Auction` MODIFY `status` ENUM('WAITING', 'ACTIVE', 'CANCELLED', 'CLOSED_UNSOLD', 'SOLD') NOT NULL DEFAULT 'WAITING';

-- CreateIndex
CREATE INDEX `Auction_status_startTime_idx` ON `Auction`(`status`, `startTime`);

-- CreateIndex
CREATE INDEX `Auction_status_endTime_idx` ON `Auction`(`status`, `endTime`);
