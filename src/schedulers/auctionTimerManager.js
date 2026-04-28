// schedule auctions
import { startAuctionById } from "../services/auction.service.js";

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

export function scheduleAuctionStart(auction) {
  const delay = new Date(auction.startTime) - new Date();
//   12:30 - 11:30
//   1 hour 

  if (delay <= 0) return; // already past → cron will catch it

  console.log(
    `Scheduling START for auction ${auction.id} in ${Math.round(delay / 1000)}s`
  );

  const timer = setTimeout(async () => {
    try {
      await startAuctionById(auction.id);
    } catch (err) {
      console.error("Start auction timer failed:", err);
    } finally {
      auctionTimers.delete(auction.id);
    }
  }, delay);

  auctionTimers.set(auction.id, timer);
}