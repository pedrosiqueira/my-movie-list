import { json } from '@sveltejs/kit';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';

export async function POST({ request }) {
    let obj = await fetchIMDB((await request.json()).url)
    return json(obj.props.pageProps.titleResults.results)
}
