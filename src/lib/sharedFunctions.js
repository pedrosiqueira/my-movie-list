export function convertCaseDiacritic(str) {
    return str
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}