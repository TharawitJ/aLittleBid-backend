import prisma from "../src/lib/prismaClient.js";

async function main() {
   await prisma.product.create({
    data: {
        name: "gold watch"
    },
  })
}

main().catch(error => {
    console.error(error);
    process.exit(1);
}).finally( async() => {
    await prisma.$disconnect();
});