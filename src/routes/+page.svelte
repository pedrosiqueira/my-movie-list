<script>
	import { onMount } from 'svelte';

	let moviesString = '';
	let counter = 0;
	let moviesCandidates = [];
	let busy = false;
	let candidates = [];
	let active = 0;
	let loadingMoviesToast;
	let searchMovieModal;
	let myMovieList = [];
	export let data;

	onMount(() => {
		loadingMoviesToast = bootstrap.Toast.getOrCreateInstance(document.getElementById('loadingMoviesToast'));
		searchMovieModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('searchMovieModal'));

		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

		const searchFilterTA = document.getElementById('searchFilterTA');
		const table = new DataTable('#movieList', { paging: false });
		DataTable.ext.search.push(function (settings, data, dataIndex) {
			return data.some((el) => convertCaseDiacritic(el).includes(convertCaseDiacritic(searchFilterTA.value)));
		});
		searchFilterTA.addEventListener('input', function () {
			table.draw();
		});
		const defaultSearchInput = document.querySelector('div.dataTables_filter');
		defaultSearchInput.style.display = 'none';
		defaultSearchInput.parentNode.appendChild(document.getElementById('searchFilterSpan'));

		document.getElementById('searchMovieModal')?.addEventListener('hidden.bs.modal', (event) => {
			busy = false;
			searchMovie();
		});

		document.querySelectorAll('.dropdown-item').forEach((element) => {
			element.addEventListener('click', async (event) => {
				let movieStatus = event.target.textContent;
				const url = `https://www.imdb.com/title/${candidates[active].id}/`;
				fetch('/api/database', {
					method: 'POST',
					body: JSON.stringify({ url, movieStatus }),
					headers: {
						'content-type': 'application/json'
					}
				})
					.then((response) => response.json())
					.then((result) => {
						data.movies = [...data.movies, result.movie];
					});
				searchMovieModal.hide();
			});
		});
	});

	function convertCaseDiacritic(str) {
		return str
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	async function searchMovies() {
		loadingMoviesToast.show();
		const moviesList = moviesString.trim().split('\n');
		for (let movie of moviesList) {
			const url = `https://www.imdb.com/find/?q=${encodeURIComponent(movie)}&ref_=nv_sr_sm`;
			fetch('/api/imdb', {
				method: 'POST',
				body: JSON.stringify({ url }),
				headers: {
					'content-type': 'application/json'
				}
			})
				.then((response) => response.json())
				.then((candidates) => {
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
		candidates = moviesCandidates.pop();
		searchMovieModal.show();
	}
</script>

<div class="container-fluid">
	<h1>My Movie List</h1>
	<span id="searchFilterSpan" class="input-group">
		<textarea id="searchFilterTA" class="form-control" placeholder="Movie's name" rows="1" data-bs-toggle="tooltip" data-bs-title="You can paste multiple lines, one for each movie" bind:value={moviesString} />
		<button class="btn btn-primary" type="button" id="searchMoviesButton" on:click={searchMovies}>Search on IMDB</button>
	</span>
	<div class="row">
		<div class="col">
			<table id="movieList" class="table display">
				<thead>
					<tr>
						<!-- <th>id</th> -->
						<th>Capa</th>
						<th>Ano</th>
						<th>Título</th>
						<th>Sinopse</th>
						<th data-bs-toggle="tooltip" data-bs-title="Classificação Indicativa">⚠️</th>
						<th data-bs-toggle="tooltip" data-bs-title="Nota dos usuários IMDB">👍</th>
						<th data-bs-toggle="tooltip" data-bs-title="Metascore">🎓</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each data.movies as movie}
						<tr>
							<td><img src={movie.urlCapa} alt={movie.titulo} class="avatar" /></td>
							<td>{movie.ano}</td>
							<td>{movie.titulo}</td>
							<td>{movie.sinopse}</td>
							<td>{movie.classificacaoIndicativa}</td>
							<td>{movie.avaliacaoIMDB}</td>
							<td>{movie.avaliacaoMetascore ?? '-'}</td>
							<td>
								{#if movie.status.id === 1}
									<span data-bs-toggle="tooltip" data-bs-title="A baixar">📥</span>
								{:else if movie.status.id === 2}
									<span data-bs-toggle="tooltip" data-bs-title="Por ver">▶️</span>
								{:else if movie.status.id === 3}
									<span data-bs-toggle="tooltip" data-bs-title="Visto">✔️</span>
								{:else}
									<span data-bs-toggle="tooltip" data-bs-title="Veria de novo">🔄</span>
								{/if}
							</td>
						</tr>
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
				<h3>Filme(s) encontrado(s)</h3>
				<ul class="list-group">
					{#each candidates as candidate, index}
						<a href="#top" class="list-group-item list-group-item-action d-flex {index === active ? 'active' : ''} align-items-center" on:click={() => (active = index)}>
							<img src={candidate.titlePosterImageModel?.url ?? ''} alt={candidate.titleNameText} class="avatar" />
							<div>
								<h5 class="mb-0">{candidate.titleNameText} ({candidate.titleReleaseText})</h5>
								{#if candidate.topCredits}
									<p class="mb-0">{candidate.topCredits}</p>
								{/if}
							</div>
						</a>
					{/each}
				</ul>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
				<div class="btn-group dropup">
					<button id="addMovieButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Add film</button>
					<ul class="dropdown-menu">
						<!-- to-do em vez de chumbar os status, colocar um for-each com resultados trazidos da tabela Status do banco -->
						<li><a class="dropdown-item" href="#top">1. To download</a></li>
						<li><a class="dropdown-item" href="#top">2. To watch</a></li>
						<li><a class="dropdown-item" href="#top">3. Watched</a></li>
						<li><a class="dropdown-item" href="#top">4. Would watch again</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.avatar {
		width: 50px;
		height: 74px;
		object-fit: cover;
		margin-right: 10px;
	}
</style>
