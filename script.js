"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

//get film details

//get actors
// TMD_BASE_URL / movie/{movieid} / credits?api-key=xxx & language=en-US
//https://api.themoviedb.org/3/ movie/436270 /credits?api_key=542003918769df50083a13c415bbc602&language=en-US

//get similar films
// TMD_BASE_URL  / movie/{movieid} / similar?api-key=xxx & language=en-US
//https://api.themoviedb.org/3/movie/436270/similar?api_key=542003918769df50083a13c415bbc602&language=en-US&page=1

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};
//console.log(atob("NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="))
//console.log(btoa("542003918769df50083a13c415bbc602"))

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const staffRes = await fetchStaff(movie.id);
  const relatedFilms = await fetchRelatedFilms(movie.id);
  renderMovie(movieRes, staffRes, relatedFilms);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

//this function provides actors and director information from API
const fetchStaff = async (id) => {
  const url = constructUrl(`movie/${id}/credits`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
};

//this function provides to get similar films from API
const fetchRelatedFilms = async (id) => {
  const url = constructUrl(`movie/${id}/similar`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, staffs, relatedFilms) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id= "movie-genres">Genres: </p>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <p id="movie-director"> </p>
            <p id="movie-vote-average">Rating: ${movie.vote_average}</p>
            <p id="movie-vote-count">Vote count: ${movie.vote_count}</p>
            <p id="movie-language">Language: ${movie.original_language.toUpperCase()}</p>
        </div>
        </div>
        <div>
             <h3>Production Companies:</h3>
             <div id= "production-companies" class= "row">
             
             </div>
        </div>
        </div >
            <h3>Actors:</h3>
            <div id="actors" class="row" >
        
            </div>
        </div>
        <div >
        <h3>Similar Films:</h3>
            <div id="similarFilms" class="row">
            
            </div>`;
  renderActors(staffs);
  renderSimilarFilms(relatedFilms);
  findDirector(staffs.crew)
  findGenres(movie.genres)
  renderProductionCompanies(movie.production_companies)
};

//this function provides to get main 5 actor informations about each film
const renderActors = (staffs) => {
  const actorList = document.querySelector("#actors");
  staffs.cast.slice(0, 5).map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.className = "col";
    const actorCard = document.createElement("div");
    actorCard.className = "card";
    
    actorCard.innerHTML = `
    <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200">
    <div class = "card-body">
          <p class = "card-text">${actor.name}</p>
        </div>`;
    actorCard.addEventListener("click", () => {
      displaySingleActorPage();
    });

    actorDiv.appendChild(actorCard)
    actorList.appendChild(actorDiv);
  });
};

//this function provides to get 5 related films about the chosen film
const renderSimilarFilms = (similarFilms) => {
  const relatedFilmsList = document.querySelector("#similarFilms");
  similarFilms.results.slice(0, 5).map((film) => {
    const filmDiv = document.createElement("div");
    filmDiv.className = "col";
    const similarFilmCard = document.createElement("div");
    similarFilmCard.className = "card";
    

    similarFilmCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + film.poster_path}" alt="${film.title} poster" height="200">
        <div class = "card-body">
          <p class = "card-text">${film.original_title}</p>
        </div>`;
    ///actorDiv.addEventListener("click", () => {displaySingleActorPage();});
    filmDiv.appendChild(similarFilmCard);
    relatedFilmsList.appendChild(filmDiv);
  });
};

const findDirector = (staffs) => {  
  staffs.map((staff) => {
    if(staff.job === 'Director'){
      const directorInfo = document.getElementById('movie-director')
      directorInfo.innerText = `Director : ${staff.name}`
    }
  })
}

const findGenres = (genres) => {
  genres.map((genre) => {
    const movieGenreInfo = document.getElementById('movie-genres')
    movieGenreInfo.append(` ${genre.name}, `)
  })
}

const renderProductionCompanies = (companies) => {
  companies.map((company) => {
    const companyInfo = document.getElementById('production-companies')



    const companyDiv = document.createElement("div");
    companyDiv.className = "col";
    const companyCard = document.createElement("div");
    companyCard.className = "card";
    
    companyCard.innerHTML = `
    <img src="${BACKDROP_BASE_URL + company.logo_path}" alt="${company.name} poster" width="100" height = "100%">
    <div class = "card-body">
          <p class = "card-text">${company.name}</p>
        </div>`;

    companyDiv.appendChild(companyCard);
    companyInfo.appendChild(companyDiv)
  })
}

const displaySingleActorPage = () => {
  CONTAINER.innerHTML = `
      <div class="row">
          <div class="col-md-4">
               <h1>welcome, you are in actor page</h1>
          </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);
