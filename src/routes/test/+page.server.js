export async function load() {
    const movies = [
        {
            id: "tt0029583", ano: 1937, classificacaoIndicativa: 0, avaliacaoIMDB: 7.6, avaliacaoMetacritic: 96, avaliacaoTomatometer: 97, avaliacaoTomatoAudience: 78, status: { id: 1 }, statusId: 1, createdAt: "2024-02-01T00:09:49.009Z", updatedAt: "2024-02-01T00:09:49.009Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BNWQ4N2I1MzctNGU2YS00YzYyLTgyNmEtMTliZTQ5MGYxYzlkXkEyXkFqcGdeQXVyMTAyOTE2ODg0._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/snow_white_and_the_seven_dwarfs",
            tituloOriginal: "Snow White and the Seven Dwarfs", titulo: "Branca de Neve e os Sete Anões", sinopse: "Deixada numa floresta perigosa por sua madrasta malvada, uma princesa é resgatada por sete mineiros anões que a fazem parte de sua casa."
        },
        {
            id: "tt0033563", ano: 1941, classificacaoIndicativa: 0, avaliacaoIMDB: 7.2, avaliacaoMetacritic: 96, avaliacaoTomatometer: 95, avaliacaoTomatoAudience: 70, status: { id: 2 }, statusId: 1, createdAt: "2024-02-01T00:18:00.909Z", updatedAt: "2024-02-01T00:18:00.909Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BMmU1NjQ3YjktZGMxYS00N2IwLTllZWQtOGNjYWE4MzgxNzk2XkEyXkFqcGdeQXVyODU2MDg1NzU@._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/dumbo",
            tituloOriginal: "Dumbo", titulo: "Dumbo", sinopse: "Ridicularizado por suas enormes orelhas, um jovem elefante de circo é auxiliado por um rato a alcançar todo o seu potencial."
        },
        {
            id: "tt0032455", ano: 1940, classificacaoIndicativa: 0, avaliacaoIMDB: 7.7, avaliacaoMetacritic: 96, avaliacaoTomatometer: 95, avaliacaoTomatoAudience: null, status: { id: 3 }, statusId: 1, createdAt: "2024-02-01T00:24:55.354Z", updatedAt: "2024-02-01T00:24:55.354Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BYjhlYzNkOGEtZjNkZC00OTQ4LWJiMzEtMTM3YzBiM2FkMDUxXkEyXkFqcGdeQXVyNzY1NDgwNjQ@._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/fantasia",
            tituloOriginal: "Fantasia", titulo: "Fantasia", sinopse: "A integração das grandes obras da música clássica com visuais extremamente criativos e originais da animação."
        },
        {
            id: "tt0034492", ano: 1942, classificacaoIndicativa: 0, avaliacaoIMDB: 7.3, avaliacaoMetacritic: 91, avaliacaoTomatometer: 91, avaliacaoTomatoAudience: null, status: { id: 4 }, statusId: 1, createdAt: "2024-02-01T00:25:13.303Z", updatedAt: "2024-02-01T00:25:13.303Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BNTVhMDc3MzYtNzI4Ni00YmNmLTkzM2YtMjBhMGFkODFjOTk4XkEyXkFqcGdeQXVyMTU3NDU4MDg2._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/bambi",
            tituloOriginal: "Bambi", titulo: "Bambi", sinopse: "Relata a história de uma jovem corça crescendo na floresta."
        },
        {
            id: "tt0082694", ano: 1981, classificacaoIndicativa: 16, avaliacaoIMDB: 7.6, avaliacaoMetacritic: 77, avaliacaoTomatometer: 93, avaliacaoTomatoAudience: null, status: { id: 5 }, statusId: 4, createdAt: "2024-02-01T00:25:28.411Z", updatedAt: "2024-02-01T00:25:28.411Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BYzc0YjAwOGUtMDM4Ni00NzljLTgxMGYtZDRiNGFiYmViMWZmXkEyXkFqcGdeQXVyMTAyOTE2ODg0._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/mad_max_2_the_road_warrior",
            tituloOriginal: "Mad Max 2", titulo: "Mad Max 2: A Caçada Continua", sinopse: "Em um deserto australiano pós-apocalíptico, um empresário cínico concorda em ajudar uma pequena comunidade rica em gás a fugir de uma horda de bandidos."
        },
        {
            id: "tt0093773", ano: 1987, classificacaoIndicativa: 16, avaliacaoIMDB: 7.8, avaliacaoMetacritic: 47, avaliacaoTomatometer: 80, avaliacaoTomatoAudience: 87, status: { id: 6 }, statusId: 6, createdAt: "2024-02-01T00:26:18.455Z", updatedAt: "2024-02-01T00:26:18.455Z",
            urlCapa: "https://m.media-amazon.com/images/M/MV5BMDIyOTFjMTctZWYzYi00MDM1LTk5ODgtMzA3MmEwZDJmNjUwXkEyXkFqcGdeQXVyMTY4MjE1MDA@._V1_.jpg", urlRottenTomatoes: "https://www.rottentomatoes.com/m/predator",
            tituloOriginal: "Predator", titulo: "O Predador", sinopse: "Um grupo de soldados na selva do Centroamérica são perseguidos por um guerreiro extraterrestre."
        }
    ]
    return { movies }
}