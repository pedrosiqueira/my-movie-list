import { prisma } from '$lib/server/prisma.js';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';

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

		let imdbData = (await fetchIMDB(url)).props.pageProps.aboveTheFoldData

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