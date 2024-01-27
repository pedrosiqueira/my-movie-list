import { fetchIMDB } from '$lib/server/sharedFunctions.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function POST({ request }) {
    let data = await request.json();
    let imdbData = (await fetchIMDB(data.url)).props.pageProps.aboveTheFoldData
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
                status: { connect: { status: data.movieStatus } }
            },
            include: { status: true }
        })
        return json({ movie });
    } catch (err) {
        console.error(err)
        return fail(500, { message: "Could not insert the movie." })
    }
}
