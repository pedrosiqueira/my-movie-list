os status estão chumbados. depois tem que carregar os status do banco.

teclas de atalho para o app

colocar os modais em componentes separados

estou pensando em mudar aquela tabela que apresenta os filmes para algo mais responsível especialmente para telas pequenas.

fazer paginação e filtrar pelos status, pra não gastar muita transferência do vercel.

converter as seguintes linhas de código, `document.querySelectorAll('[class*="sortable-"]').forEach((sortable) => {` e `function sort(event) {`, numa biblioteca, de modo que ao importá-la, qualquer elemento com a classe `sortable-` possa servir como botão para ordenar um array passado depois do sortable-. a ideia seria algo assim, `sortable-[array que quero ordenar]-[campo que quero ordenar]-[e se esse campo for outro objeto, como diferenciar separando pelos hifens?]`, mas no momento, está apenas assim `sortable-[campo que quero ordenar]`, e o array está chumbado no código.