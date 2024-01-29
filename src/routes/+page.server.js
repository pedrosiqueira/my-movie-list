import { prisma } from '$lib/server/prisma.js';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';

export async function load() {
	const movies = await prisma.filme.findMany({ include: { status: { select: { id: true } } } })
	return { movies }
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const url = `https://www.imdb.com/title/${data.get('choosen')}/`;
		const movieStatus = data.get('status');

		let imdbData = (await fetchIMDB(url)).props.pageProps.aboveTheFoldData

		if (imdbData.certificate.rating == 'Livre') imdbData.certificate.rating = 0
		imdbData.certificate.rating = Number(imdbData.certificate.rating)

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