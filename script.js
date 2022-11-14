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
const navEl = document.createElement('nav');
navEl.innerHTML = `<div class="navbar">
<i class='bx bx-menu'></i>
<div class="logo"><a href="#">MOVIES</a></div>
<div class="nav-links">
  <div class="sidebar-logo">
    <span class="logo-name">CodingLab</span>
    <i class='bx bx-x' ></i>
  </div>
  <ul class="links">
    <li><a href="#">HOME</a></li>
    <li>
      <a href="#">GENRES</a>
      <i class='bx bxs-chevron-down htmlcss-arrow arrow  '></i>
      <ul class="htmlCss-sub-menu sub-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Romantic</a></li>
        <li><a href="#">Drama</a></li>
      </ul>
    </li>
    <li>
      <a href="#">FILTER</a>
      <i class='bx bxs-chevron-down js-arrow arrow '></i>
      <ul class="js-sub-menu sub-menu">
        <li><a href="#">Most Popular</a></li>
        <li><a href="#">New</a></li>
        <li><a href="#">Good rated</a></li>
        <li><a href="#">Example</a></li>
      </ul>
    </li>
    <li><a href="#">ACTORS</a></li>
    <li><a href="#">ABOUT US</a></li>
  </ul>
</div>
<div class="search-box">
  <i class='bx bx-search'></i>
  <div class="input-box">
    <input type="text" placeholder="Search...">
  </div>
</div>
</div>`
document.querySelector('body').prepend(navEl);
 // search-box open close js code
 let navbar = document.querySelector(".navbar");
 let searchBox = document.querySelector(".search-box .bx-search");

 
 searchBox.addEventListener("click", ()=>{
   navbar.classList.toggle("showInput");
   if(navbar.classList.contains("showInput")){
     searchBox.classList.replace("bx-search" ,"bx-x");
   }else {
     searchBox.classList.replace("bx-x" ,"bx-search");
   }
 });
 
 // sidebar open close js code
 let navLinks = document.querySelector(".nav-links");
 let menuOpenBtn = document.querySelector(".navbar .bx-menu");
 let menuCloseBtn = document.querySelector(".nav-links .bx-x");
 menuOpenBtn.onclick = function() {
 navLinks.style.left = "0";
 }
 menuCloseBtn.onclick = function() {
 navLinks.style.left = "-100%";
 }
 
 
//  sidebar submenu open close js code
 let htmlcssArrow = document.querySelector(".htmlcss-arrow");
 htmlcssArrow.onclick = function() {
  navLinks.classList.toggle("show1");
 }

 let jsArrow = document.querySelector(".js-arrow");
 jsArrow.onclick = function() {
  navLinks.classList.toggle("show3");
 }