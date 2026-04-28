// schedule auctions
import { startAuctionById } from "../services/auction.service.js";

const auctionTimers = new Map();
// update auction time
// delete 
// start time: 12:10

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
  
const now = new Date();
const start = new Date(auction.startTime);
const delay = start - now;
  
const MAX_TIMEOUT = 2147483647;

  if (delay <= 0 || delay >= MAX_TIMEOUT) {
    console.log('auction start delay condition not met');
    return 
  }; // already past → cron will catch it

  console.log(
    `Scheduling START for auction ${auction.id} in ${Math.round(delay / 1000)}s`
  );

    // const timerExist = auctionTimers.get(auction.id);
    // console.log('timerExist', timerExist)
    // if (timerExist) { auctionTimers.delete(auction.id) }; // delete timer and replace with new one?
    // time 


  const timer = setTimeout(async () => {
    try {
      const res = await startAuctionById(auction.id);
      console.log('res at status', res)
    } catch (err) {
      console.error("Start auction timer failed:", err);
    } 
  }, delay);

  console.log('timer', timer)

  auctionTimers.set(auction.id, timer);
}