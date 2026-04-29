import cron from "node-cron";
import { endAuctions, startAuctions } from "../services/auction.service.js";

export const auctionStatusUpdateTask = cron.schedule("*/30 * * * * *", async () => {
    console.log("Auction cron running:", new Date().toLocaleTimeString());

    try {
        await startAuctions();
        await endAuctions();
    } catch (error) {
        console.error('Auction cron failed', error);
    }
});