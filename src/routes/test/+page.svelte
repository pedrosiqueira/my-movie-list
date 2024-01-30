<script>
	let searchText = '';
	let active = 1;
	const candidates = [
		{
			id: 'tt5255770',
			titleNameText: 'Edge of Tomorrow: Weapons of the Future',
			titleReleaseText: '2014',
			titleTypeText: 'Vídeo',
			titlePosterImageModel: {
				url: 'https://m.media-amazon.com/images/M/MV5BYjYyY2Y1M2EtNWM5Ni00ODRhLWE2MmYtNTQyMDU4NzQ0OWRjXkEyXkFqcGdeQXVyMjA3NzQyMA@@._V1_.jpg',
				maxHeight: 570,
				maxWidth: 467,
				caption: 'Edge of Tomorrow: Weapons of the Future (2014)'
			},
			topCredits: ['Emily Blunt', 'Pierre Bohanna'],
			imageType: 'video'
		},
		{
			id: 'tt3773590',
			titleNameText: 'Edge of Tomorrow Special',
			titleReleaseText: '2014',
			titleTypeText: 'Filme para televisão',
			topCredits: ['Emily Blunt', 'Tom Cruise'],
			imageType: 'tvMovie'
		},
		{
			id: 'tt5255760',
			titleNameText: 'Edge of Tomorrow: Storming the Beach',
			titleReleaseText: '2014',
			titleTypeText: 'Vídeo',
			titlePosterImageModel: {
				url: 'https://m.media-amazon.com/images/M/MV5BNTc2NGVjMGEtNjAwMi00OTI5LWJkMDAtMjliNTI2NzU4Nzc4XkEyXkFqcGdeQXVyMjA3NzQyMA@@._V1_.jpg',
				maxHeight: 570,
				maxWidth: 467,
				caption: 'Edge of Tomorrow: Storming the Beach (2014)'
			},
			topCredits: ['Emily Blunt', 'Simon Crane'],
			imageType: 'video'
		}
	];
</script>

<ul class="list-group">
	{#each candidates as candidate, index}
		<a href="#top" class="list-group-item list-group-item-action d-flex align-items-center {candidate.alreadyExists ? 'disabled' : index === active ? 'active' : ''}" on:click={() => (active = index)}>
			<img src={candidate.titlePosterImageModel?.url ?? ''} alt={candidate.titleNameText} class="avatar" />
			<div>
				<h5 class="mb-0">{candidate.titleNameText} | {candidate.titleReleaseText}</h5>
				{#if candidate.topCredits}
					<p class="mb-0">{candidate.topCredits}</p>
				{/if}
				{#if candidate.alreadyExists}
					<span class="badge bg-primary rounded-pill">already added</span>
				{/if}
			</div>
			<div class="ms-auto align-self-start">
				<small>3 days ago</small>
			</div>
		</a>
	{/each}
</ul>

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
