export async function load() {
    const movie = await searchRottenTomatoesInfo('Oblivion', 'Oblivion', 'Tom Cruise', 2013)
    return { movie }
}

async function bringRottenTomatoesInfo(url, title, titleOriginal, cast) {
    let htmlContent = await (await fetch(url)).text();

    let startIndex = htmlContent.indexOf(`<h1>`);
    let endIndex = htmlContent.indexOf('</h1>', startIndex)
    const titleFound = htmlContent.substring(startIndex + 4, endIndex)
    if (titleFound != title && titleFound != titleOriginal) return null // o título não bateu

    startIndex = htmlContent.indexOf(`<div class="actors">`)
    endIndex = htmlContent.indexOf(`<div id="movie-tech-specs"`, startIndex)
    const castFound = htmlContent.substring(startIndex, endIndex)
    if (!castFound.includes(cast)) return null // o elenco não bateu

    startIndex = htmlContent.indexOf(`Rotten Tomatoes Critics`)
    startIndex = htmlContent.indexOf(`<span>`, startIndex) + 6
    endIndex = htmlContent.indexOf(`&`, startIndex)
    const tomatometer = htmlContent.substring(startIndex, endIndex)
    if (!tomatometer) return null // não há avaliação do rotten

    startIndex = htmlContent.indexOf(`Rotten Tomatoes Audience`)
    startIndex = htmlContent.indexOf(`<span>`, startIndex) + 6
    endIndex = htmlContent.indexOf(`&`, startIndex)
    const audience = htmlContent.substring(startIndex, endIndex)

    startIndex = htmlContent.indexOf(`https://www.rottentomatoes.com`)
    endIndex = htmlContent.indexOf(`"`, startIndex)
    const rottenUrl = htmlContent.substring(startIndex, endIndex)

    return { tomatometer, audience, rottenUrl }
}

async function searchRottenTomatoesInfo(title, titleOriginal, cast, year) {
    let htmlContent = await fetch(`https://yts.mx/browse-movies/${encodeURIComponent(title)}`);
    htmlContent = await htmlContent.text();
    let startIndex = htmlContent.indexOf(`<div class="browse-movie-wrap`);
    let endIndex = htmlContent.indexOf('</section>', startIndex)
    htmlContent = htmlContent.substring(startIndex, endIndex)
    startIndex = 0
    while (startIndex != -1) { // para cada filme da lista
        startIndex = htmlContent.indexOf('<div class="browse-movie-wrap', startIndex)
        endIndex = htmlContent.indexOf('<div class="browse-movie-year"', startIndex) + 35
        let movieContent = htmlContent.substring(startIndex, endIndex)

        if (movieContent.includes('browse-movie-year">' + year)) { // a lista só mostra os títulos em inglês, portanto, devo entrar em cada título para ver seu nome original
            startIndex = movieContent.indexOf('href="');
            endIndex = movieContent.indexOf('" ', startIndex);
            const found = bringRottenTomatoesInfo(movieContent.substring(startIndex + 6, endIndex), title, titleOriginal, cast)
            if (found) return found
        }
        startIndex = endIndex
    }
    return { tomatometer: null, audience: null, rottenUrl: null }
}