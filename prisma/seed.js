import prisma from "../src/lib/prismaClient.js";
import { faker } from "@faker-js/faker";

async function main() {
       await prisma.user.createMany({
        data: Array.from({ length: 5 }).map(() => ({
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            phone: faker.phone.number(),
        })),
        });

          await prisma.address.createMany({
        data: Array.from({length: 11}).map(()=> (
            {
              label: Math.random() > 0.3 ? "Home" : "Work",
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              postalCode: faker.location.zipCode(),
              country: faker.location.country(),
              userId: Math.floor(Math.random() * 10) + 1
        }
        )) 
    });

        //       await prisma.product.createMany({
    //     data: Array.from({length: 11}).map(()=> (
    //         {
    //         name: faker.commerce.productName(),
    //         price: Number(faker.commerce.price()),
    //         stock: faker.number.int({min: 0, max: 100})
    //     }
    //     )) 
    // });

}

main().catch(error => {
    console.error(error);
    process.exit(1);
}).finally( async() => {
    await prisma.$disconnect();
});