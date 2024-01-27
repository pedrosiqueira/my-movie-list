import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const result = await prisma.status.createMany({
        data: [
            { status: '1. To download' },
            { status: '2. To watch' },
            { status: '3. Watched' },
            { status: '4. Would watch again' }
        ]
    })

    console.log(result)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })