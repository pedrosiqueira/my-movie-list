ao colar várias linhas, antes de apertar o botão de buscar no imdb, poderia listar filtrar filmes que correspondam a uma das linhas.

ao procurar um filme, muitas vezes são listados vários. talvez ter o botão de adicionar em cada um dos filmes da lista.

ao procurar um filme já adicionado, ter a opção de alterar seu status dali.

os status estão chumbados. depois tem que carregar os status do banco.

teclas de atalho para o app

colocar os modais em componentes separados

estou pensando em mudar aquela tabela que apresenta os filmes para algo mais responsível especialmente para telas pequenas.

fazer paginação e filtrar pelos status, pra não gastar muita transferência do vercel.

converter as seguintes linhas de código, `document.querySelectorAll('[class*="sortable-"]').forEach((sortable) => {` e `function sort(event) {`, numa biblioteca, de modo que ao importá-la, qualquer elemento com a classe `sortable-` possa servir como botão para ordenar um array passado depois do sortable-. a ideia seria algo assim, `sortable-[array que quero ordenar]-[campo que quero ordenar]-[e se esse campo for outro objeto, como diferenciar separando pelos hifens?]`, mas no momento, está apenas assim `sortable-[campo que quero ordenar]`, e o array está chumbado no código.
