import API from '../system/api';
import {decrypt} from '../system/security';


export function createMovieAPI(userId, data) {

  return API.post('/users/' + userId + '/movies/', data)
    .catch((err) => {
      console.error(err);
    });

}


export function changeMovieAPI(userId, movieId, data) {

  return API.put('/users/' + userId + '/movies/' + movieId, data)
  .catch((err) => {
    console.error(err);
  });

}


export function deleteMovieAPI(userId, movieId) {

  return API.delete('/users/' + userId + '/movies/' + movieId)
    .catch((err) => {
      console.error(err);
    });
    
}


export function getAllMoviesAPI(userId) {

  return API.get('/users/' + userId + '/movies')
    .then(formatMovies)
    .catch((err) => {
      console.error(err);
    });

}


function formatMovies(response) {

  const movies = {};

  // goes through each object in the response array and creates an
  // empty array in the movies object with the date as its key
  response.sort(function(a, b) {
    if (a.title < b.title)
      return -1;
    if (a.title > b.title)
      return 1;
    return 0;
  }).forEach((movie) => { movies[movie.date.year] = []; });

  // goes through each year key in movies and creates an empty
  // array for each used month in that year
  Object.keys(movies).forEach((year) => {
    response.forEach((movie) => {
      if (movie.date.year === year)
        movies[year][movie.date.month] = [];
    });
  });

  // goes through each year key in movies and each month key in each year
  // and creates an empty array for each used day in that year
  for (let year in movies) {
    Object.keys(movies[year]).forEach((month) => {
      response.forEach((movie) => {
        if ((movie.date.year === year) && (movie.date.month === month))
          movies[year][month][movie.date.day] = [];
      });
    });
  }

  // for every year/month/day in the object movies, filter response for movies
  // with the same year/month/day and add the movies that match as values
  // for that year/month/day key
  for (let i=0; i<response.length; i++) {
    movies[response[i].date.year][response[i].date.month][response[i].date.day].push(response[i]);
  }

  return movies;

}