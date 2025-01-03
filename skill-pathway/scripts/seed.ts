const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Computer Science' },
        { name: 'Music' },
        { name: 'Fitness' },
        { name: 'Photography' },
        { name: 'Accounting' },
        { name: 'Education' },
        { name: 'Filming' },
      ],
    });
    console.log('Database categories seeded');
  } catch {
    console.log('Error of seeding the database categories');
  } finally {
    await database.$disconnect();
  }
}

main();
