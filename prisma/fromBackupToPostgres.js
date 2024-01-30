import fs from 'fs';

/** lê os objetos json do arquivo de backup e gera o scrip postgres para inserir os objetos no banco de dados */

function loadBackupFile(filePath = 'prisma/backupData.json') {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        return null;
    }
}


const data = loadBackupFile();
console.log('INSERT INTO "Filme" ( "id", "ano", "tituloOriginal", "titulo", "sinopse", "classificacaoIndicativa", "avaliacaoIMDB", "avaliacaoMetascore", "urlCapa", "statusId", "createdAt", "updatedAt") VALUES')
data.movies.forEach(m => console.log(
    "("
    + "'" + m.id + "',"
    + m.ano + ','
    + "'" + m.tituloOriginal.replace(/'/g, "''") + "',"
    + "'" + m.titulo.replace(/'/g, "''") + "',"
    + "'" + m.sinopse.replace(/'/g, "''") + "',"
    + m.classificacaoIndicativa + ','
    + m.avaliacaoIMDB + ','
    + m.avaliacaoMetascore + ','
    + "'" + m.urlCapa + "',"
    + m.statusId + ','
    + "'" + m.createdAt + "',"
    + "'" + m.updatedAt + "'),"
))