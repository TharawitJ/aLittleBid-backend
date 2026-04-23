import cron from "node-cron";
import { endAuctions, startAuctions } from "../services/auction.service.js";

export const auctionStatusUpdateTask = cron.schedule("0 * * * * *", async () => {
    console.log("Auction cron running:", new Date().toISOString());

    try {
        await startAuctions();
        await endAuctions();
    } catch (error) {
        console.error('Auction cron failed', error);
    }
});

// schedule auctions
const auctionTimers = new Map();

export function scheduleAuctionEnd(auction) {
  const delay = new Date(auction.endTime) - new Date();

  if (delay <= 0) return;

  console.log(`Scheduling auction ${auction.id} to end in ${delay}m`);

  const timer = setTimeout(async () => {
    await endAuctionAndPickWinner(auction.id);
    auctionTimers.delete(auction.id);
  }, delay);

  auctionTimers.set(auction.id, timer);
}