<script>
	export let form;
	console.log(form);
	let active = 1;
	let candidates = [{ nome: 'maria' }, { nome: 'francisca' }, { nome: 'joão' }];
</script>

<div class="dropdown">
	<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Dropdown button </button>
	<ul class="dropdown-menu">
		<form method="POST" action="?/create"></form>
	</ul>
</div>
