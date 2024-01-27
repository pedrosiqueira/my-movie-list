import { prisma } from '$lib/server/prisma.js';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';

export async function load() {
	const movies = await prisma.filme.findMany({ include: { status: { select: { id: true } } } })
	return { movies }
}

export const actions = {
	add: async ({ request, fetch }) => {
		const data = await request.formData();
		const url = `https://www.imdb.com/title/${data.get('choosen')}/`;
		const movieStatus = data.get('status');

		let imdbData = (await fetchIMDB(url)).props.pageProps.aboveTheFoldData

		try {
			const movie = await prisma.filme.create({
				data: {
					id: imdbData.id,
					ano: imdbData.releaseYear.year,
					tituloOriginal: imdbData.originalTitleText.text,
					titulo: imdbData.titleText.text,
					sinopse: imdbData.plot.plotText.plainText,
					// synopsis,
					classificacaoIndicativa: imdbData.certificate.rating,
					avaliacaoIMDB: imdbData.ratingsSummary.aggregateRating,
					avaliacaoMetascore: imdbData.metacritic?.metascore.score ?? null,
					urlCapa: imdbData.primaryImage.url,
					// avaliacaoTomatometer:filme.,
					// avaliacaoTomatoAudicence:filme.,
					status: { connect: { status: movieStatus } }
				},
				include: { status: true }
			})
			return { movie };
		} catch (err) {
			console.error(err)
			return fail(500, { message: "Could not insert the movie." })
		}
	}
};