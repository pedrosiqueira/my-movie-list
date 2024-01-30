import { PrismaClient } from "@prisma/client"
import fs from 'fs';

/** salva todo o banco de dados no arquivo backupData-yyyy-mm-ddThhmmss.json */

const prisma = new PrismaClient()

async function fetchData() {
    const status = await prisma.status.findMany();
    const movies = await prisma.filme.findMany();
    return { status, movies };
}

fetchData()
    .then((data) => {
        const timestamp = new Date().toISOString().replace(/:/g, '');
        const fileName = `backupData-${timestamp}.json`;
        const seedData = JSON.stringify(data);

        fs.writeFileSync(fileName, seedData);
        console.log(`Backup saved to ${fileName}`);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
