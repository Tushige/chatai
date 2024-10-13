import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
async function main() {
  await client.plan.createMany({
    data: [
      {
        name: 'FREE',
        emailLimit: 10,
        domainLimit: 1,
      },
      {
        name: 'BASIC',
        emailLimit: 50,
        domainLimit: 3,
      },
      {
        name: 'PREMIUM',
        emailLimit: 100,
        domainLimit: 5,
      },
    ],
  });
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
