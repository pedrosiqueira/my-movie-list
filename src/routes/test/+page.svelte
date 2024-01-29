<script>
	let searchText = '';

	const items = [
		{ id: 1, name: 'Item 1' },
		{ id: 2, name: 'Item 2' },
		{ id: 3, name: 'Another Item' }
		// Add more items as needed
	];

	$: filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
</script>

<main>
	<input type="text" bind:value={searchText} placeholder="Search..." />

	<ul>
		{#each filteredItems as item (item.id)}
			<li>{item.name}</li>
		{/each}
	</ul>
</main>

<style>
	/* Add your styles here */
</style>
