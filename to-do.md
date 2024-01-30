ao tentar adicionar filme já repetido, voltar com uma mensagem ao usuário, informando que o filme já está adicionado. no momento, não adiciona mas o usuário fica sem saber.

os status estão chumbados. depois tem que carregar os status do banco.

teclas de atalho para o app

depois que buscou do imdb, ao clicar num botão do filme candidato, exibir as informações na página do imdb

colocar os modais em componentes separados

popular o filme com os campos faltantes, como rotten tomatoes

ao adicionar filmes, o último não aparece na lista a não ser que eu atualize a página. será problema do datatables.net ou do sveltekit?

converter as seguintes linhas de código, `document.querySelectorAll('[class*="sortable-"]').forEach((sortable) => {` e `function sort(event) {`, numa biblioteca, de modo que ao importá-la, qualquer elemento com a classe `sortable-` possa servir como botão para ordenar um array passado depois do sortable-. a ideia seria algo assim, `sortable-[array que quero ordenar]-[campo que quero ordenar]-[e se esse campo for outro objeto, como diferenciar separando pelos hifens?]`, mas no momento, está apenas assim `sortable-[campo que quero ordenar]`, e o array está chumbado no código.