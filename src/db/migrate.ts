import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sqlitePrisma = new PrismaClient();

async function migrateData() {
  if (process.env.DB_MIGRATE !== 'true') {
    console.log('Migration disabled. Skipping...');
    return;
  }

  console.log('Starting migration from MySQL to SQLite...');

  try {
    const mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // 1. Fetching data from MySQL
    const [budgets] = await mysqlConnection.query('SELECT * FROM budgets');
    const [companies] = await mysqlConnection.query('SELECT * FROM companies');
    const [customers] = await mysqlConnection.query('SELECT * FROM customers');
    // ... similarly for other tables

    // 2. Importing into SQLite (简化 - using a transaction)
    await sqlitePrisma.$transaction(async (prisma) => {
        for (const company of (companies as any[])) {
            await prisma.company.upsert({
                where: { id: company.id },
                update: { name: company.name },
                create: { id: company.id, name: company.name },
            });
        }
        for (const customer of (customers as any[])) {
            await prisma.customer.upsert({
                where: { id: customer.id },
                update: { name: customer.name },
                create: { id: customer.id, name: customer.name },
            });
        }
        for (const budget of (budgets as any[])) {
            await prisma.budget.upsert({
                where: { id: budget.id },
                update: {
                    totalValue: budget.valueTotal,
                    status: budget.statusId,
                    approved: !!budget.approved,
                    companyId: budget.companyId,
                    customerId: budget.customerId,
                },
                create: {
                    id: budget.id,
                    totalValue: budget.valueTotal,
                    status: budget.statusId,
                    approved: !!budget.approved,
                    companyId: budget.companyId,
                    customerId: budget.customerId,
                },
            });
        }
    });

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sqlitePrisma.$disconnect();
  }
}

migrateData();
