const baseTitleURL = 'http://localhost:8000/api/v1/titles/';
const baseGenreURL = 'http://localhost:8000/api/v1/genres/';
const fallbackImg = 'assets/bookplaceholder.jpg';

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
    bestMovieImg.src = bestMovie.image_url;
    bestMovieImg.alt = bestMovie.original_title;
    bestMovieImg.onerror = () => { bestMovieImg.src = fallbackImg; };    
    
    const bestMovieTitle = document.querySelector('.best-movie-title');
    bestMovieTitle.textContent = bestMovie.original_title;

    const bestMovieDescription = document.querySelector('.best-movie-description');
    bestMovieDescription.textContent = bestMovie.description;

    const bestMovieId = document.getElementById('best-movie-id');
    bestMovieId.textContent = bestMovie.id;
    
}

async function fetchMovies(category) {

    const params = new URLSearchParams({
        page_size: 6,
        sort_by: '-imdb_score',
        });
    
    if (category) {
            params.append('genre', category);
        }

    const reponse = await fetch(`${baseTitleURL}?${params.toString()}`);
    const data = await reponse.json();
    return data;
}

async function fetchBestMovies() {
    const data = await fetchMovies();
    addMoviestoContainer(data, 'other-best-container');
}
    
const addMoviestoContainer = (data, container) => {
    const template = document.getElementById('movie-card-template');
    const sectionContainer = document.getElementById(container);

    data.results.forEach(movie => {
        const clone = template.content.cloneNode(true);
        const movieImg = clone.querySelector('.movie-image');
        movieImg.src = movie.image_url || fallbackImg;
        movieImg.onerror = () => { movieImg.src = fallbackImg; };
        clone.querySelector('.movie-title').textContent = movie.title;
        clone.querySelector('.card-id').textContent = movie.id;
        sectionContainer.appendChild(clone);
    });
    afficherFilms(container);
}

const afficherFilms = (containerSelector) => {
    const container = document.getElementById(containerSelector);
    if (!container) return;

    const cards = container.querySelectorAll('.movie-card');
    const btnVoirPlus = container.closest('section').querySelector('.voir-plus');
    
    cards.forEach((card, index) => {
        if (index >= 2 && index < 4) {
            card.classList.add('hidden', 'md:block');
        } else if (index >= 4) {
            card.classList.add('hidden', 'md:hidden', 'lg:block');
        }
    });
    
    if (btnVoirPlus) {
        btnVoirPlus.addEventListener('click', function() {
            cards.forEach((card, index) => {
                if (index >= 2) {
                    card.classList.toggle('!block');
                }
            });
            this.textContent = this.textContent.trim() === 'Voir plus' ? 'Voir moins' : 'Voir plus';
        });
    }
};

async function getAllCat() {

    const params = new URLSearchParams({
        page_size: 50,
    });

    const reponse = await fetch(`${baseGenreURL}?${params.toString()}`);
    const data = await reponse.json();
    const catList = data.results.map(cat => cat.name);
    return catList;
}

async function populateCategorySelect1() {
    const categories = await getAllCat();
    const select1 = document.getElementById('choix-cat1');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select1.appendChild(option);
    });
}

async function populateCategorySelect2() {
    const categories = await getAllCat();
    const select2 = document.getElementById('choix-cat2');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select2.appendChild(option);
    });
}

const fetchCategory = async () => {
    const selectCategory1 = document.getElementById('choix-cat1');
    const selectCategory2 = document.getElementById('choix-cat2');
    const cat1Container = document.getElementById('cat1-container');
    const cat2Container = document.getElementById('cat2-container');

    selectCategory1.addEventListener('change', async () => {
        const selectedCategory1 = selectCategory1.value
        if (selectedCategory1) {
            const data1 = await fetchMovies(selectedCategory1);
            cat1Container.innerHTML = '';
            addMoviestoContainer(data1, 'cat1-container');
        }
    }
    )

    selectCategory2.addEventListener('change', async () => {
        const selectedCategory2 = selectCategory2.value
        if (selectedCategory2) {
            const data2 = await fetchMovies(selectedCategory2);
            cat2Container.innerHTML = '';
            addMoviestoContainer(data2, 'cat2-container');
        }
    }
    )

    const mysteryData = await fetchMovies('Mystery');
    addMoviestoContainer(mysteryData, 'mystery-container');

    const actionData = await fetchMovies('Action');
    addMoviestoContainer(actionData, 'action-container');


    
}

fetchBestMovie();
fetchBestMovies();
populateCategorySelect1();
populateCategorySelect2();
fetchCategory();
