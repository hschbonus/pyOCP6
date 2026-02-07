const baseTitleURL = 'http://localhost:8000/api/v1/titles/';
const baseGenreURL = 'http://localhost:8000/api/v1/genres/';

async function fetchBestMovie() {

    const params = new URLSearchParams({
        sort_by: '-imdb_score',
    });

    const reponse = await fetch(`${baseTitleURL}?${params.toString()}`);
    const data = await reponse.json();
    const bestMovieURL = data.results[0].url;
    
    const bestMovieResponse = await fetch(bestMovieURL);
    const bestMovie = await bestMovieResponse.json();

    const bestMovieImg = document.querySelector('.best-movie-img');
    bestMovieImg.innerHTML = `<img src="${bestMovie.image_url}" alt="Best Movie Image">`;
    
    const bestMovieTitle = document.querySelector('.best-movie-title');
    bestMovieTitle.textContent = bestMovie.title;

    const bestMovieDescription = document.querySelector('.best-movie-description');
    bestMovieDescription.textContent = bestMovie.description;
    
}

async function fetchOtherBest() {

    const params = new URLSearchParams({
        page_size: 6,
        sort_by: '-imdb_score',
    });

    const reponse = await fetch(`${baseTitleURL}?${params.toString()}`);
    const data = await reponse.json();
    
    const template = document.getElementById('movie-card-template');

    data.results.forEach(movie => {
        
        const clone = template.content.cloneNode(true);

        clone.querySelector('.movie-image').src = movie.image_url;
        clone.querySelector('.movie-title').textContent = movie.title;
        document.getElementById('other-best').appendChild(clone);
    })

    afficherFilms();
}

const afficherFilms = () => {
    const cards = document.querySelectorAll('.movie-card');
    
    cards.forEach((card, index) => {
        if (index >= 2 && index < 4) {
            card.classList.add('hidden', 'md:block');
        } else if (index >= 4) {
            card.classList.add('hidden', 'md:hidden', 'lg:block');
        }
    });
    
    document.querySelector('.voir-plus').addEventListener('click', function() {
        cards.forEach((card, index) => {
            if (index >= 2) {
                card.classList.toggle('!block');
            }
        });
        
        this.textContent = this.textContent === 'Voir plus' ? 'Voir moins' : 'Voir plus';
    });
};

const catList = document.querySelectorAll('.cat');

async function getAllCat() {

    const params = new URLSearchParams({
        page_size: 50,
    });

    const reponse = await fetch(`${baseGenreURL}?${params.toString()}`);
    const data = await reponse.json();
    const catList = data.results.map(cat => cat.name);
    return catList;
}



fetchBestMovie();
fetchOtherBest();
getAllCat();
