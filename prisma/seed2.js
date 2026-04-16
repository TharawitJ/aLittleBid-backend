import prisma from "../src/lib/prismaClient.js";
import { faker } from "@faker-js/faker";
import { randBetween } from "../src/utils/helpers.js";

async function main() {
  // seed 2
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
