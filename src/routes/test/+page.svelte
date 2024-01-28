<script>
	import { enhance } from '$app/forms';
	export let form;
	console.log(form);
	let movie = { id: 'tt3235888' };
</script>

<a href="https://www.imdb.com/title/{movie.id}/">👁️</a>
<a onclick="return confirm('Are you sure you want to delete?');" name="id" value={movie.id}>🗑️</a>
