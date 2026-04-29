// schedule auctions
import { endAuctionAndPickWinner, startAuctionById } from "../services/auction.service.js";
import { getIo } from "../sockets/index.js";

const auctionTimers = new Map();
const endTimers = new Map();
const MAX_TIMEOUT = 2147483647;

// update auction time
// delete 
// start time: 12:10

export function scheduleAuctionStart(auction) {
  
const now = new Date();
const start = new Date(auction.startTime);
const delay = start - now;

  if (delay <= 0 || delay >= MAX_TIMEOUT) {
    console.log('auction start delay condition not met');
    return 
  }; // already past → cron will catch it

  console.log(
    `Scheduling START for auction ${auction.id} in ${Math.round(delay / 1000)}s`
  );

  // EDGE CASE TIMER UPDATE ETC.
    // const timerExist = auctionTimers.get(auction.id);
    // console.log('timerExist', timerExist)
    // if (timerExist) { auctionTimers.delete(auction.id) }; // delete timer and replace with new one?
    // time 


  const timer = setTimeout(async () => {
    try {
      const res = await startAuctionById(auction.id);
      console.log('res at status', res);

       const io = getIo();
        // Emit outside auction start to front-end
      io?.to(`${auction.id}`).emit("auction_started", {
        auctionId: auction.id,
      });
  
    } catch (err) {
      console.error("Start auction timer failed:", err);
    } 
  }, delay);

  console.log('timer', timer)

  auctionTimers.set(auction.id, timer);
}

export function scheduleAuctionEnd(auction) {
  
const now = new Date();
const end = new Date(auction.endTime);
const delay = end - now;

  if (delay <= 0 || delay >= MAX_TIMEOUT) {
    console.log('auction end delay condition not met');
    return 
  }; 

  console.log(
    `Scheduling END for auction ${auction.id} in ${Math.round(delay / 1000)}s`
  );

   const timer = setTimeout(async () => {
    try {
      console.log('auction', auction)
      const res = await endAuctionAndPickWinner(auction);
      console.log('set timer at status end', res)
    } catch (err) {
      console.error("End auction timer failed:", err);
    } 
  }, delay);

    endTimers.set(auction.id, timer);

}