const modal = document.getElementById('modale');

document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.open-modal-btn') || e.target.closest('.movie-image');
    if (openBtn) {
        modal.classList.remove('hidden');
    }

    const closeBtn = e.target.closest('.close-modal-btn');
    if (closeBtn) {
        modal.classList.add('hidden');
    }
});

document.addEventListener('click', async (e) => {
    const openBtn = e.target.closest('.open-modal-btn') || e.target.closest('.movie-image');
    if (!openBtn) return;

    const card = openBtn.closest('.movie-card') || openBtn.closest('section');
    const id = card?.querySelector('.card-id')?.textContent;

    if (id) {
        const data = await fetchMovie(id)

        const modaleTitle = modal.querySelectorAll('.modale-h2');
        modaleTitle.forEach(title => {title.textContent = data.original_title});

        const modaleDateGenre = modal.querySelectorAll('.date-genre');
        modaleDateGenre.forEach(dateGenre => {
            dateGenre.textContent = `${data.year} - ${data.genres.join(', ')}`;
        });

        const modaleRatedDurationCountries = modal.querySelectorAll('.rated-duration-countries');
        const rated = data.rated && data.rated !== 'Not rated or unkown rating' ? data.rated : 'Non classifié';
        modaleRatedDurationCountries.forEach(el => {
            el.textContent = `${rated} - ${data.duration} minutes (${data.countries.join(' / ')})`;
        });

        const modaleImdbScore = modal.querySelectorAll('.imdb-score');
        modaleImdbScore.forEach(imdbScore => { 
            imdbScore.textContent = `IMDB score: ${data.imdb_score}/10`;
        });

        const modaleIncome = modal.querySelectorAll('.income');
        modaleIncome.forEach(income => { 
            income.textContent = data.income ? `Recettes au box-office: $${data.income}` : '';
        });

        const modaleDescription = modal.querySelectorAll('.modale-description');
        modaleDescription.forEach(description => { 
            description.textContent = data.long_description;
        });

        const modaleDirector = modal.querySelectorAll('.director');
        modaleDirector.forEach(director => { 
            director.textContent = `${data.directors.join(', ')}`;
        });

        const modaleImage = modal.querySelectorAll('.modale-img');
        modaleImage.forEach(image => {
            image.src = data.image_url || 'assets/bookplaceholder.jpg';
            image.onerror = () => { image.src = 'assets/bookplaceholder.jpg'; };
        });

        const modaleCasting = modal.querySelectorAll('.casting');
        modaleCasting.forEach(casting => { 
            casting.textContent = data.actors.join(', ');
        });


} });

async function fetchMovie(id) {
    const reponse = await fetch(`http://localhost:8000/api/v1/titles/${id}`);
    const filmData = await reponse.json();

    return filmData
}