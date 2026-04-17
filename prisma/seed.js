import prisma from "../src/lib/prismaClient.js";
import { faker } from "@faker-js/faker";
import { randBetween } from "../src/utils/helpers.js";

async function main() {
    // await prisma.$executeRawUnsafe(`TRUNCATE TABLE Product;`);

  await prisma.user.createMany({
    data: Array.from({ length: 30 }).map(() => ({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      role: "SELLER",
    })),
  });

  await prisma.user.createMany({
    data: Array.from({ length: 70 }).map(() => ({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      role: "BUYER",
    })),
  });

  await prisma.address.createMany({
    data: Array.from({ length: 11 }).map(() => ({
      label: Math.random() > 0.3 ? "Home" : "Work",
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      userId: randBetween(30, 100),
    })),
  });

  await prisma.category.createMany({
    data: Array.from({ length: 10 }).map(() => ({
      name: faker.commerce.department(),
      description: faker.commerce.productMaterial(),
      imageUrl: faker.image.url(),
    })),
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: Array.from({ length: 43 }).map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      categoryId: randBetween(1, 10),
      sellerId: randBetween(1, 30),

    })),
    // skipDuplicates: true,
  });

  await prisma.image.createMany({
    data: Array.from({ length: 100 }).map(() => ({
        imageUrl: faker.image.url(),
        productId: randBetween(1, 25),
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
