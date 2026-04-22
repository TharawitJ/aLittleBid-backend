import cron from "node-cron";

export const auctionStatusUpdateTask = cron.schedule("0 * * * * *", async () => {
    console.log("Auction cron running:", new Date().toISOString());

    try {
        
    } catch (error) {
        console.error('cron failed', error);
    }
});