import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB() {
    try {
        await prisma.$connect();
        console.log('DataBase Connected Success');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
}


export async function disconnectDB() {
    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error disconnecting to the database', error);
        process.exit(1);
    }
}  

export { prisma };