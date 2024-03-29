<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { convertCaseDiacritic } from '$lib/sharedFunctions.js';

	let moviesString = '';
	let counter = 0;
	let moviesCandidates = [];
	let busy = false;
	let candidates = [];
	let active = 0;
	let loadingMoviesToast;
	let searchMovieModal;
	let current_sorted;

	export let data;
	// console.log('loaded');

	onMount(() => {
		document.querySelectorAll('[class*="sortable-"]').forEach((sortable) => {
			let content = sortable.innerHTML;
			sortable.innerHTML = '↕' + content;
			sortable.style.cursor = 'pointer';
			sortable.addEventListener('click', (event) => {
				sort(event);
			});
		});

		function sort(event) {
			if (current_sorted && current_sorted != event.currentTarget) {
				current_sorted.innerHTML = '↕' + current_sorted.innerHTML.substring(1);
			}
			current_sorted = event.currentTarget;

			const indexOfSortable = current_sorted.classList.value.indexOf('sortable-');
			const sortableField = current_sorted.classList.value.slice(indexOfSortable + 9, current_sorted.classList.value.indexOf(' ', indexOfSortable));

			if (current_sorted.innerHTML[0] == '↓') {
				data.movies.sort((a, b) => {
					if (sortableField == 'status') return a.status.id - b.status.id; // pra ordenar um campo que na verdade é um objeto, tive que apelar pro jeitinho, mas o ideal seria fazer algo como está na lista to-do.md
					if (a[sortableField] < b[sortableField]) return -1;
					if (a[sortableField] > b[sortableField]) return 1;
					return 0;
				});
				current_sorted.innerHTML = '↑' + current_sorted.innerHTML.substring(1);
			} else {
				data.movies.sort((a, b) => {
					if (sortableField == 'status') return b.status.id - a.status.id; // pra ordenar um campo que na verdade é um objeto, tive que apelar pro jeitinho, mas o ideal seria fazer algo como está na lista to-do.md
					if (a[sortableField] > b[sortableField]) return -1;
					if (a[sortableField] < b[sortableField]) return 1;
					return 0;
				});
				current_sorted.innerHTML = '↓' + current_sorted.innerHTML.substring(1);
			}
			data.movies = data.movies;
		}

		// console.log('mounted');
		loadingMoviesToast = bootstrap.Toast.getOrCreateInstance(document.getElementById('loadingMoviesToast'));
		searchMovieModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('searchMovieModal'));

		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

		document.getElementById('searchMovieModal')?.addEventListener('hidden.bs.modal', (event) => {
			busy = false;
			searchMovie();
		});
	});

	async function searchMovies() {
		loadingMoviesToast.show();
		const moviesList = moviesString.trim().split('\n');
		for (let movie of moviesList) {
			const url = `https://www.imdb.com/find/?q=${encodeURIComponent(movie)}&ref_=nv_sr_sm`;
			fetch(`/api/imdb/?url=${encodeURIComponent(url)}`)
				.then((response) => response.json())
				.then((candidates) => {
					candidates = candidates.filter((obj) => obj.imageType == 'movie'); // quero apenas movies
					candidates.forEach((obj1) => {
						if (data.movies.some((obj2) => obj2.id === obj1.id)) {
							// se já está adicionado, marque-o como tal
							obj1.alreadyExists = true;
						}
					});
					candidates.query = movie;
					moviesCandidates.push(candidates);
					searchMovie();
					counter--;
					if (counter == 0) loadingMoviesToast.hide();
				});
			counter++;
		}
	}

	async function searchMovie() {
		if (busy || moviesCandidates.length === 0) return;
		busy = true;
		candidates = moviesCandidates.shift();
		searchMovieModal.show();
	}

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
				<button class="btn btn-primary" type="button" id="searchMoviesButton" on:click={searchMovies}>Search on IMDB</button>
			</span>
		</div>
	</div>
	<div class="row">
		<div class="col table-responsive">
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
				<tbody>
					{#each filteredMovies as movie (movie.id)}
						<!-- https://learn.svelte.dev/tutorial/keyed-each-blocks -->
						<tr class="without-border">
							<td><img src={movie.urlCapa} alt={movie.titulo} class="avatar" /></td>
							<td>{movie.ano}</td>
							<td><span data-bs-toggle="tooltip" data-bs-title={movie.tituloOriginal}>{movie.titulo}</span></td>
							<td>{movie.classificacaoIndicativa}</td>
							<td> <a data-bs-toggle="tooltip" data-bs-title="Open on IMDB" href="https://www.imdb.com/title/{movie.id}/" target="blank"> {movie.avaliacaoIMDB}</a></td>
							<td>{movie.avaliacaoMetacritic ?? '-'}</td>
							<td>
								{#if movie.urlRottenTomatoes}
									<a data-bs-toggle="tooltip" data-bs-title="Open on Rotten" href={movie.urlRottenTomatoes} target="blank"> {movie.avaliacaoTomatometer}</a>
								{:else}-{/if}
							</td>
							<td>{movie.avaliacaoTomatoAudience ?? '-'}</td>
							<td>
								<div class="btn-group dropstart">
									<button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
										{#if movie.status.id === 1}
											<span data-bs-toggle="tooltip" data-bs-title="Assistir">▶️</span>
										{:else if movie.status.id === 2}
											<span data-bs-toggle="tooltip" data-bs-title="Baixar">📥</span>
										{:else if movie.status.id === 3}
											<span data-bs-toggle="tooltip" data-bs-title="Assistiria de novo">🔄</span>
										{:else}
											<span data-bs-toggle="tooltip" data-bs-title="Assistido">✔️</span>
										{/if}
									</button>
									<ul class="dropdown-menu">
										<!-- prettier-ignore -->
										<form action="?/edit" method="post" use:enhance>
											<input type="hidden" name="id" value={movie.id} />
											<li><button class="dropdown-item" type="submit" name="status" value="1. To watch">1. To watch</button></li>
											<li><button class="dropdown-item" type="submit" name="status" value="2. To download">2. To download</button></li>
											<li><button class="dropdown-item" type="submit" name="status" value="3. Would watch again">3. Would watch again</button></li>
											<li><button class="dropdown-item" type="submit" name="status" value="4. Watched">4. Watched</button></li>
										</form>
									</ul>
								</div>
							</td>
							<td>
								<form action="?/delete" method="post" use:enhance>
									<button class="btn p-0" data-bs-toggle="tooltip" data-bs-title="Delete movie" onclick="return confirm('Are you sure you want to delete?');" type="submit" name="id" value={movie.id}>🗑️</button>
								</form>
							</td>
						</tr>
						<tr> <td colspan="9"> {movie.sinopse}</td> </tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Toast -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
	<div id="loadingMoviesToast" class="toast text-bg-warning" role="alert" data-bs-config="&lcub; &quot;autohide&quot;: false &rcub;">
		<div class="toast-body">Loading movie(s)...</div>
	</div>
</div>

<!-- to-do mudar esse modal para seu próprio componente e importá-lo aqui -->
<!-- Modal -->
<div class="modal fade" id="searchMovieModal" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body">
				<h3>Movie(s) found(s) for {candidates.query}:</h3>
				<ul class="list-group">
					{#each candidates as candidate, index}
						<a href="#top" class="list-group-item list-group-item-action d-flex align-items-center {candidate.alreadyExists ? 'disabled' : index === active ? 'active' : ''}" on:click={() => (active = index)}>
							<img src={candidate.titlePosterImageModel?.url ?? ''} alt={candidate.titleNameText} class="avatar" />
							<div>
								<h5 class="mb-0">{candidate.titleNameText} | {candidate.titleReleaseText}</h5>
								{#if candidate.topCredits}
									<p class="mb-0">{candidate.topCredits}</p>
								{/if}
							</div>
							<div class="ms-auto align-self-start">
								{#if candidate.alreadyExists}
									<span class="badge bg-primary rounded-pill">already added</span>
								{:else}
									<small> <a class="btn p-0" data-bs-toggle="tooltip" data-bs-title="Open on IMDB" href="https://www.imdb.com/title/{candidate.id}/" target="blank">👁️</a> </small>
								{/if}
							</div>
						</a>
					{/each}
				</ul>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
				<div class="btn-group dropup">
					<!-- svelte-ignore a11y-accesskey -->
					<button id="addMovieButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" accesskey="a">Add film</button>
					<ul class="dropdown-menu">
						<!-- to-do em vez de chumbar os status, colocar um for-each com resultados trazidos da tabela Status do banco -->
						<!-- prettier-ignore -->
						<form action="?/add" method="post" use:enhance={() => { searchMovieModal.hide(); }} >
							<input type="hidden" name="choosen" value={candidates[active]?.id} />
							<li><button class="dropdown-item" type="submit" name="status" value="1. To watch">1. To watch</button></li>
							<li><button class="dropdown-item" type="submit" name="status" value="2. To download">2. To download</button></li>
							<li><button class="dropdown-item" type="submit" name="status" value="3. Would watch again">3. Would watch again</button></li>
							<li><button class="dropdown-item" type="submit" name="status" value="4. Watched">4. Watched</button></li>
						</form>
					</ul>
				</div>
			</div>
		</div>
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
