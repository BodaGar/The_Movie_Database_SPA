'use strict';

async function movies() {

    const APIKey = '913ed8559c6f0258f9254c24d56cb577';
    const baseURL = 'https://api.themoviedb.org/3/';

    const selectOverview = document.querySelector('.overview');
    const selectListMovies = document.getElementById('movies');
    const btn = document.querySelector('.search');
    const currentUl = document.querySelector('.searchMovie');

    const urlTrending = "".concat(baseURL, 'trending/all/day?api_key=', APIKey); 
    const trending = await fetch(urlTrending);
    const trendMovies = await trending.json();

    async function getTrendMovies() {
        if (trending.ok) { 
            trendMovies.results.forEach(element => {
                if (element.title) {
                    selectListMovies.insertAdjacentHTML("beforeend", 
                        `<li class="trendMovies">
                            <a href="${element.id}">${element.title}</a>
                         </li>`
                    );
                }
            });
            selectListMovies.addEventListener('click', (event) => {
                selectListMovies.innerHTML = '';
                event.preventDefault();
                getMoviesInfo(event.target.getAttribute('href'));
            })
        } else {
            alert(`Error HTTP: ${trending.status}`);
        }
    } 
    getTrendMovies();  


    async function getMoviesInfo(movieId) {
        if (!movieId) return;
        const urlMovie = "".concat(baseURL, `movie/${movieId}?api_key=`, APIKey);
        const movie = await fetch(urlMovie);
        const movieJson = await movie.json();
            
        if (movie.ok) {
            selectOverview.innerHTML = '';
            selectOverview.insertAdjacentHTML("beforeend", 
            `<img src="https://image.tmdb.org/t/p/w300/${movieJson.poster_path}" alt="poster_path">
                <h1 class="heading">${movieJson.title}</h1>
                <p class="description">${movieJson.overview}</p>
                <h2 class="recommendations">Recommendations</h2>`);   

            getRecomendedMovies(movieId);
        } else {
            alert(`Error HTTP: ${movie.status}`);
        }
    }

    async function getRecomendedMovies(movieId) {
        if (!movieId) return;
        const urlRecommendations =  "".concat(baseURL, `movie/${movieId}/recommendations?api_key=`, APIKey);
        const recommend = await fetch(urlRecommendations);
        const recommendJson = await recommend.json();

        if (recommend.ok) { // якщо HTTP-статус в діапазоні 200-299, получаємо тіло відповіді
            let arr = recommendJson.results.slice(0,3);

            arr.forEach(element => {

                if (element.title) {
                    selectOverview.insertAdjacentHTML("beforeend", 
                        `<li class="trendMovies">
                            <a href="${element.id}">${element.title}</a>
                         </li>`
                    );
                }
            });
            selectOverview.removeEventListener('click', removeAdd);
            selectOverview.addEventListener('click', removeAdd);
        } else {
            alert(`Error HTTP: ${trending.status}`);
        }
    }

    function removeAdd(event) {
        let recomLi = document.querySelectorAll('trendMovies');
        selectListMovies.innerHTML = '';
        recomLi.innerHTML = '';
        
        event.preventDefault();
        getMoviesInfo(event.target.getAttribute('href'));
    }
    
           
    btn.onclick = () => {    
         const inputMovie = document.querySelector('.allMovies').value;

         selectOverview.innerHTML = '';                
         if (selectListMovies.style.display = 'block') {
             selectOverview.style.display = 'block';
         } 
         getlistAllMovies(inputMovie);     
    }          


     async function getlistAllMovies(thisInputMovie) {
        const url = ''.concat(baseURL, 'search/movie?api_key=', APIKey, '&query=', thisInputMovie);
        const searchMovie = await fetch(url);
        const searchMovieJson = await searchMovie.json();
        
        if (searchMovie.ok) {
            searchMovieJson.results.forEach(el => {             
                currentUl.insertAdjacentHTML("beforeend", 
                    `<li class="allMovies">
                        <a href="${el.id}">${el.title}</a>
                    </li>`
                );  
                    selectListMovies.style.display = 'none';
            });
        
            let allLi = document.querySelectorAll('.allMovies > a');
            allLi.forEach(el => {
                el.addEventListener('click', (event) => {   
                    currentUl.innerHTML = '';  
                    event.preventDefault();
                    getMoviesInfo(event.target.getAttribute('href'));
                })
            });
        } else {
            alert(`Error HTTP: ${searchMovie.status}`);
        }
    }     
}
document.addEventListener('DOMContentLoaded', movies);