import { PrismaClient } from "@prisma/client"

global.prisma; // declare global prisma variable to prevent multiple instances of Prisma Client in development

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") {
    global.prisma = prisma
}

export { prisma }