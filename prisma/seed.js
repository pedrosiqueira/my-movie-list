import { PrismaClient } from "@prisma/client"
import fs from 'fs';

function loadBackupFile(filePath = 'prisma/backupData.json') {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        return null;
    }
}

const prisma = new PrismaClient()

async function main() {
    const data = loadBackupFile();
    const status = await prisma.status.createMany({ data: data.status })
    const movies = await prisma.filme.createMany({ data: data.movies })
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