import { prisma } from '$lib/server/prisma.js';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';
import { convertCaseDiacritic } from '$lib/sharedFunctions.js';

/**
 * Extract substring between startMarker+startOffset and endMarker+endOffset.
 */
function extractSubstring(input, startMarker, endMarker, startOffset = 0, endOffset = 0) {
	const startIndex = input.indexOf(startMarker) + startMarker.length;
	const endIndex = input.indexOf(endMarker, startIndex);
	if (startIndex == startMarker.length - 1 || endIndex == -1) return ''
	return input.substring(startIndex + startOffset, endIndex + endOffset);
}

async function bringRottenTomatoesInfoFromYtsMx(url, titles, directors) {
	let htmlContent = await fetch(url)
	htmlContent = await htmlContent.text();

	const titleFound = convertCaseDiacritic(extractSubstring(htmlContent, '<h1>', '</h1>'))
	if (!titles.some(title => convertCaseDiacritic(title) == titleFound)) return null // o título não bateu

	const directorFound = convertCaseDiacritic(extractSubstring(htmlContent, '<div class="directors">', '<div class="actors">'))
	if (!directors.some(director => directorFound.includes(convertCaseDiacritic(director)))) return null // o diretor não bateu

	let startIndex = htmlContent.indexOf(`Rotten Tomatoes Critics`)
	const tomatometer = Number(extractSubstring(htmlContent.substring(startIndex), '<span>', '&'))
	if (!tomatometer) return null // não há avaliação do rotten

	startIndex = htmlContent.indexOf(`Rotten Tomatoes Audience`)
	const audience = Number(extractSubstring(htmlContent.substring(startIndex), '<span>', '&'))

	const rottenUrl = extractSubstring(htmlContent, 'https://www.rottentomatoes.com', '"', -30)

	return { tomatometer, audience, rottenUrl }
}

async function searchRottenTomatoesInfoFromYtsMx(titles, directors, year) {
	let htmlContent = await fetch(`https://yts.mx/browse-movies/${encodeURIComponent(titles[0])}`);
	htmlContent = await htmlContent.text();
	htmlContent = extractSubstring(htmlContent, '<div class="browse-movie-wrap', '</section>', -30)
	while (htmlContent) { // para cada filme da lista
		let movieContent = extractSubstring(htmlContent, '<div class="browse-movie-wrap', '<div class="browse-movie-year"', 0, 35)
		if (movieContent.includes('browse-movie-year">' + year)) { // a lista só mostra os títulos em inglês, portanto, devo entrar em cada título para ver seu nome original
			const found = await bringRottenTomatoesInfoFromYtsMx(extractSubstring(movieContent, 'href="', '" '), titles, directors)
			if (found) return found
		}
		htmlContent = movieContent.length ? htmlContent.substring(movieContent.length) : null
	}
	return null;
}

async function searchRottenTomatoesInfo(titles, cast, year) {
	let htmlContent = await fetch(`https://www.rottentomatoes.com/search?search=${encodeURIComponent(titles[0])}`);
	htmlContent = await htmlContent.text();
	htmlContent = extractSubstring(htmlContent, '<search-page-result skeleton="panel" type="movie"', '</search-page-result>')
	while (htmlContent) { // para cada filme da lista
		let movieContent = extractSubstring(htmlContent, '<search-page-media-row', '</search-page-media-row>')
		if (titles.some(title => movieContent.includes(title)) && cast.some(actor => movieContent.includes(actor)) && movieContent.includes(year)) {
			return {
				tomatometer: Number(extractSubstring(movieContent, 'tomatometerscore="', '"')),
				rottenUrl: extractSubstring(movieContent, 'https://www.rottentomatoes.com/m/', '"', -33),
				audience: null
			}
		}
		htmlContent = movieContent.length ? htmlContent.substring(movieContent.length) : null
	}
	return null;
}

export async function load() {
	const movies = await prisma.filme.findMany({
		orderBy: [{ status: { status: 'asc' } }, { ano: 'asc' }],
		include: { status: { select: { id: true } } }
	})
	return { movies }
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const url = `https://www.imdb.com/title/${data.get('choosen')}/`;
		const movieStatus = data.get('status');

		let imdbData = (await fetchIMDB(url)).props.pageProps
		const akas = imdbData.mainColumnData.akas.edges.map(item => item.node.text)
		const directors = imdbData.mainColumnData.directors[0].credits.map(item => item.name.nameText.text)
		const cast = imdbData.aboveTheFoldData.principalCredits[2].credits.map(item => item.name.nameText.text)
		const titles = [imdbData.aboveTheFoldData.originalTitleText.text, imdbData.aboveTheFoldData.titleText.text, ...akas]
		imdbData = imdbData.aboveTheFoldData

		let rottenData = await searchRottenTomatoesInfoFromYtsMx(titles, directors, imdbData.releaseYear.year);
		if (!rottenData) rottenData = await searchRottenTomatoesInfo(titles, cast, imdbData.releaseYear.year)
		if (!rottenData) rottenData = { tomatometer: null, url: null, audience: null }

		if (!imdbData.certificate) imdbData.certificate = { rating: null };
		else if (imdbData.certificate.rating == 'Livre') imdbData.certificate.rating = 0
		else if (imdbData.certificate.rating == 'G') imdbData.certificate.rating = 0
		else if (imdbData.certificate.rating == 'PG') imdbData.certificate.rating = 0
		else if (imdbData.certificate.rating == 'PG-13') imdbData.certificate.rating = 13
		else if (imdbData.certificate.rating == 'R') imdbData.certificate.rating = 17
		else if (imdbData.certificate.rating == 'NC-17') imdbData.certificate.rating = 18
		else if (imdbData.certificate.rating == 'Not Rated') imdbData.certificate.rating = null
		else imdbData.certificate.rating = Number(imdbData.certificate.rating)

		try {
			const movie = await prisma.filme.create({
				data: {
					id: imdbData.id,
					ano: imdbData.releaseYear.year,
					tituloOriginal: imdbData.originalTitleText.text,
					titulo: imdbData.titleText.text,
					sinopse: imdbData.plot.plotText.plainText,
					classificacaoIndicativa: imdbData.certificate.rating,
					avaliacaoIMDB: imdbData.ratingsSummary.aggregateRating,
					avaliacaoMetacritic: imdbData.metacritic?.metascore.score ?? null,
					avaliacaoTomatometer: rottenData.tomatometer,
					avaliacaoTomatoAudience: rottenData.audience,
					urlCapa: imdbData.primaryImage.url,
					urlRottenTomatoes: rottenData.rottenUrl,
					status: { connect: { status: movieStatus } }
				},
				include: { status: true }
			})
			return { movie };
		} catch (err) {
			console.log(err);
			if (err.code = 'P2002') return { error: 'movie already added' }
			return fail(500, { message: "Could not insert the movie." })
		}
	},
	edit: async ({ request }) => {
		const data = await request.formData();
		const movie = await prisma.filme.update({
			where: { id: data.get('id'), },
			data: { status: { connect: { status: data.get('status') } } },
			include: { status: true }
		})
		return movie
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const movie = await prisma.filme.delete({ where: { id: data.get('id'), } })
		return movie
	}
};