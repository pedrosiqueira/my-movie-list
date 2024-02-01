<script>
	import { convertCaseDiacritic } from '$lib/sharedFunctions.js';
	import { enhance } from '$app/forms';

	export let data;
	let moviesString = '';

	$: searchQuery = convertCaseDiacritic(moviesString).replace(/\s+/g, ' '); // substitui qualquer sequência de whitespaces por apenas um espaço
	$: searchQuerySimple = searchQuery.replace(/\d|\(|\)/g, '').trim(); // sem numeros nem parênteses
	$: filteredMovies = data.movies.filter((movie) => {
		return (
			convertCaseDiacritic(movie.titulo).includes(searchQuery) || // procura pelo titulo
			convertCaseDiacritic(movie.titulo).includes(searchQuerySimple) ||
			convertCaseDiacritic(movie.tituloOriginal).includes(searchQuery) || //procura pelo titulo original
			convertCaseDiacritic(movie.tituloOriginal).includes(searchQuerySimple)
		);
	});
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/" data-sveltekit-reload>My Movie List</a>
	</div>
</nav>
<div class="container-fluid">
	<div class="row" style="align-items: center;">
		<div class="col text-md-start text-center">Showing {filteredMovies.length} of {data.movies.length} movies.</div>
		<div class="col-md-6">
			<span id="searchFilterSpan" class="input-group">
				<textarea id="searchFilterTA" class="form-control" placeholder="Movie's name" rows="1" data-bs-toggle="tooltip" data-bs-title="You can paste multiple lines, one for each movie" bind:value={moviesString} />
				<button class="btn btn-primary" type="button" id="searchMoviesButton">Search on IMDB</button>
			</span>
		</div>
	</div>
	<div class="row">
		<!-- <div class="col table-responsive">
			<table id="movieList" class="table align-middle">
				<thead>
					<tr>
						<th>Capa</th>
						<th class="sortable-ano">Ano</th>
						<th class="sortable-titulo">Título</th>
						<th class="sortable-classificacaoIndicativa" data-bs-toggle="tooltip" data-bs-title="Classificação Indicativa">⚠️</th>
						<th class="sortable-avaliacaoIMDB" data-bs-toggle="tooltip" data-bs-title="IMDB rating"><img style="height: 1em;" src="/icons/imdb_favicon_desktop_32x32._CB1582158068_.png" alt="IMDB rating" /></th>
						<th class="sortable-avaliacaoMetacritic" data-bs-toggle="tooltip" data-bs-title="Metacritic"><img style="height: 1em;" src="/icons/metacritic_favicon.ico" alt="metacritic rating" /></th>
						<th class="sortable-avaliacaoTomatometer" data-bs-toggle="tooltip" data-bs-title="Tomatometer"><img style="height: 1em;" src="/icons/tomatometer-fresh.149b5e8adc3.svg" alt="Tomatometer" /></th>
						<th class="sortable-avaliacaoTomatoAudience" data-bs-toggle="tooltip" data-bs-title="Tomato Audience"><img style="height: 1em;" src="/icons/aud_score-fresh.6c24d79faaf.svg" alt="Tomato Audience" /></th>
						<th class="sortable-status" data-bs-toggle="tooltip" data-bs-title="Status">⭐</th>
						<th class="sortable-status" data-bs-toggle="tooltip" data-bs-title="Delete">🚮</th>
					</tr>
				</thead>
			</table>
		</div> -->
		{#each filteredMovies as movie (movie.id)}
			<div class="row">
				<div class="col">
					<img src={movie.urlCapa} alt={movie.titulo} class="avatar" />
				</div>
				<div class="col">
					<p>⚠️ {movie.classificacaoIndicativa}</p>
					<p>
						<img style="height: 1em;" src="/icons/imdb_favicon_desktop_32x32._CB1582158068_.png" alt="IMDB rating" />
						<a data-bs-toggle="tooltip" data-bs-title="Open on IMDB" href="https://www.imdb.com/title/{movie.id}/" target="blank"> {movie.avaliacaoIMDB}</a>
					</p>
					<p><img style="height: 1em;" src="/icons/metacritic_favicon.ico" alt="metacritic rating" /> {movie.avaliacaoMetacritic ?? '-'}</p>
					<p>
						<img style="height: 1em;" src="/icons/tomatometer-fresh.149b5e8adc3.svg" alt="Tomatometer" />
						{#if movie.urlRottenTomatoes}
							<a data-bs-toggle="tooltip" data-bs-title="Open on Rotten" href={movie.urlRottenTomatoes} target="blank"> {movie.avaliacaoTomatometer}</a>
						{:else}-{/if}
					</p>
					<p>
						<img style="height: 1em;" src="/icons/aud_score-fresh.6c24d79faaf.svg" alt="Tomato Audience" />
						{movie.avaliacaoTomatoAudience ?? '-'}
					</p>
				</div>				
				<div class="col"><span data-bs-toggle="tooltip" data-bs-title={movie.tituloOriginal}>{movie.titulo} ({movie.ano})</span></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.avatar {
		/* width: 50px; */
		height: 99px;
		object-fit: cover;
		margin-right: 10px;
	}

	.without-border * {
		/* apply to this and all his descendant */
		border-style: none;
		padding-bottom: 0%;
	}

	.without-border + tr * {
		/* apply to next sibling of him */
		padding-top: 0%;
	}
</style>
