"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");


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
  const actorRes = await fetchActors(movie.id);
  const relatedFilms = await fetchRelatedFilms(movie.id);
  renderMovie(movieRes, actorRes, relatedFilms);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

const fetchActors = async (id) => {
  const url = constructUrl(`movie/${id}/credits`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
};

const fetchRelatedFilms = async (id) => {
  const url = constructUrl(`movie/${id}/similar`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
}

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
const renderMovie = (movie, actors, relatedFilms) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled" >
        
            </ul>
        </div>
        <div>
        <h3>Similar Films:</h3>
            <ul id="similarFilms" class="list-unstyled">
            
            </ul>
        </div>`;
 renderActors(actors)
 renderSimilarFilms(relatedFilms)

};

//this function provides to get main 5 actor informations about each film
const renderActors = (actors) =>  {
  const actorList = document.querySelector("#actors") 
    actors.cast.slice(0, 5).map((actor) => {
    const actorDiv = document.createElement("ul");
    actorDiv.innerHTML = `
        <li>${actor.name}</li>
        <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster">`;
    actorDiv.addEventListener("click", () => {displaySingleActorPage();});
    actorList.appendChild(actorDiv);
  });
}


//this function provides to get 5 related films about the chosen film
const renderSimilarFilms = (similarFilms) =>  {
  const relatedFilmsList = document.querySelector("#similarFilms")
    similarFilms.results.slice(0, 5).map((film) => {
    const filmDiv = document.createElement("ul");
    filmDiv.innerHTML = `
        <li>${film.original_title}</li>
        <img src="${BACKDROP_BASE_URL + film.poster_path}" alt="${film.title} poster">`;
    ///actorDiv.addEventListener("click", () => {displaySingleActorPage();});
    relatedFilmsList.appendChild(filmDiv);
  });

}
  const displaySingleActorPage = () => {
    CONTAINER.innerHTML = `
      <div class="row">
          <div class="col-md-4">
               <h1>welcome, you are in actor page</h1>
          </div>`;
  };


document.addEventListener("DOMContentLoaded", autorun);
