import { json } from '@sveltejs/kit';
import { fetchIMDB } from '$lib/server/sharedFunctions.js';

export async function GET({ url }) {
    let obj = await fetchIMDB(url.searchParams.get('url'))
    return json(obj.props.pageProps.titleResults.results)
}
