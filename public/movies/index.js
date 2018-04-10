import template from './index.html';
import { logout } from '~/services/login';
import { decrypt } from '~/system/security';
import { createMovieAPI, changeMovieAPI, deleteMovieAPI, getAllMoviesAPI } from '~/services/movies';
import components from '~/components'
import $ from 'jquery';

let initialized = false;
let Movies;
let openAccordions = [];

export default function() {
  const user = decrypt(window.localStorage.getItem(process.env.token));

	$('#wrapper').html(template);

  $('#login-block').html(`<div id="logout-blurb big">Welcome back, ${user._doc.username}!</div>
      <div><button type="submit" class="settings-button">Settings</button>
      <button type="submit" class="logout-button">Log Out</button></div>`);

  getAllMoviesAPI(user._doc._id)
    .then((movies) => {
      // get all the movies associated with this user and pass them to the movies component to be rendered
      Movies = components.movies.render(movies, $('#movies'), openAccordions);
    })
    .catch((err) => {
      console.error(err);
    });



  // go to settings
  $('#login-block').on('click', '.settings-button', function(event) {
      event.preventDefault();
      window.location.hash = "#/settings";
  });



  // logout
  $('#login-block').on('click', '.logout-button', function(event) {
      event.preventDefault();
      logout();
  });



  if (initialized)
    return;

  initialized = true;



  // upon clicking the "add a movie" button, produce the menus to enter a new movie
  $('#wrapper').on('click', '.add-movie-button', function(event) {
    event.preventDefault();

    $('.database-add').html(`<h3>Add A Movie</h3>
      <p><span class="add-title">Title:</span><br />
      <input type="text" name="movie-title" id="movie-title"><br />
      <span class="add-date">Date Viewed:</span><br />
      <select name="add-date-month" id="add-date-month">
        <option disabled selected>Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <input type="text" name="add-date-day" id="add-date-day" placeholder="Day" maxlength="2" size="4">
      <input type="text" name="add-date-year" id="add-date-year" placeholder="Year" maxlength="4" size="5"><br />
      <button type="submit" id="movie-database-button">Submit</button><button type="submit" class="movie-database-cancel">Cancel</button></p>`);

  });



  // add a movie to the user's database
  $('#wrapper').on('keyup', '#movie-title', function(event) {
    event.preventDefault();

    if (event.keyCode == 13)
      $('#movie-database-button').trigger('click');
  });

  $('#wrapper').on('keyup', '#add-date-day', function(event) {
    event.preventDefault();

    if (event.keyCode == 13)
      $('#movie-database-button').trigger('click');
  });

  $('#wrapper').on('keyup', '#add-date-year', function(event) {
    event.preventDefault();

    if (event.keyCode == 13)
      $('#movie-database-button').trigger('click');
  });

  $('#wrapper').on('click', '#movie-database-button', function(event) {
    event.preventDefault();

    let validMonth = false;
    let validDay = false;
    let validYear = false;
    let validTitle = false;

    const month = $('#add-date-month').val();

    if (!month) {
      $('.add-date').html(`<span class="error">Please choose a valid month.</span>`);
    }
    else {
      validMonth = true;
    }

    const day = $('#add-date-day').val();

    if (((month === '4') || (month === '6') || (month === '9') || (month === '11')) && (day > 30)) {
      $('.add-date').html(`<span class="error">The month you chose only has 30 days! Please choose a valid day.</span>`);
    }
    else if ((month === '2') && (day > 29)) {
      $('.add-date').html(`<span class="error">The month you chose only has up to 29 days! Please choose a valid day.</span>`);
    }
    else if ((day < 1) || (day > 31)) {
      $('.add-date').html(`<span class="error">Please enter a valid day.</span>`);
    }
    else {
      validDay = true;
    }

    const year = $('#add-date-year').val();
    if ((year < 0) || (!year)) {
      $('.add-date').html(`<span class="error">Please choose a valid year.</span>`);
    }
    else {
      validYear = true;
    }

    const title = $('#movie-title').val();

    if (title.trim() === '')
      $('.add-title').html(`<span class="error">Please enter a valid title:</span>`);
    else if (title.length > 75)
      $('.add-title').html(`<span class="error">Please enter a shorter title:</span>`);
    else
      validTitle = true;

    if ((validDay) && (validYear) && (validTitle)) {
        const data = {
          title: title,
          date: {
            year: year,
            month: month,
            day: day
          }
        };

      createMovieAPI(user._doc._id, data)
        .then(() => {
          return getAllMoviesAPI(user._doc._id);
        })
        .then((movies) => {
          components.movies.render(movies, $('#movies'), openAccordions);
        })
        .catch((err) => {
          console.error(err);
        });
    }

  });



  // cancel adding a movie to the user's database
  $('#wrapper').on('click', '.movie-database-cancel', function(event) {
    event.preventDefault();

    $('.database-add').html(`<button type="add-movie-button" class="add-movie-button">Add A Movie</button>`);

  });



  // delete a movie from the user's database
  $('#wrapper').on('click', '.delete-movie-button', function(event) {
    event.preventDefault();

    const movieId = $(this).attr('data-id');

    deleteMovieAPI(user._doc._id, movieId)
      .then(() => {
        return getAllMoviesAPI(user._doc._id);
      })
      .then((movies) => {
        components.movies.render(movies, $('#movies'), openAccordions);
      })
      .catch((err) => {
        console.error(err);
      });

  });



  // edit a movie's title
  $('#wrapper').on('click', '.edit-title-button', function(event) {
    event.preventDefault();

    const oldTitle = $(this).parent('div').parent('div').children('div.accordion').children('span').html();

    $(this).parent('div').html(`<input type="text" name="new-title" class="new-title" value="${oldTitle}">
                                <button type="submit" class="new-title-button">Submit</button>
                                <button type="submit" class="new-title-cancel">Cancel</button>`);

  });

  $('#wrapper').on('keyup', '.new-title', function(event) {
    event.preventDefault();

    if (event.keyCode == 13)
      $('.new-title-button').trigger('click');
  });

  $('#wrapper').on('click', '.new-title-button', function(event) {
    event.preventDefault();

    const movieId = $(this).parent('div').parent('div').attr('data-id');
    const data = { title: $('.new-title').val() };

    changeMovieAPI(user._doc._id, movieId, data)
      .then(() => {
        return getAllMoviesAPI(user._doc._id);
      })
      .then((movies) => {
        components.movies.render(movies, $('#movies'), openAccordions);
      })

  });

  $('#wrapper').on('click', '.new-title-cancel', function(event) {
    event.preventDefault();

    const dataId = $(this).parent('div').parent('div').attr('data-id');

    $(this).parent('div').html(`<button type="submit" class="edit-title-button" data-id="${dataId}">Edit</button>`);

  });



  // edit a movie's date
  $('#wrapper').on('click', '.edit-date-button', function(event) {
    event.preventDefault();

    $(this).parent('span').html(`<select name="edit-date-month" class="edit-date-month">
                                  <option disabled selected>Month</option>
                                  <option value="1">January</option>
                                  <option value="2">February</option>
                                  <option value="3">March</option>
                                  <option value="4">April</option>
                                  <option value="5">May</option>
                                  <option value="6">June</option>
                                  <option value="7">July</option>
                                  <option value="8">August</option>
                                  <option value="9">September</option>
                                  <option value="10">October</option>
                                  <option value="11">November</option>
                                  <option value="12">December</option>
                                </select>
                                <input type="text" name="edit-date-day" id="edit-date-day" placeholder="Day" maxlength="2" size="4">
                                <input type="text" name="edit-date-year" id="edit-date-year" placeholder="Year" maxlength="4" size="5">
                                <button type="submit" class="new-date-button">Submit</button>
                                <button type="submit" class="new-date-cancel">Cancel</button>
                                <span class="edit-date-text"></span>`);

  });

  $('#wrapper').on('click', '.new-date-button', function(event) {
    event.preventDefault();

    const movieId = $(this).parent('span').parent('div').attr('data-id');

    let validMonth = false;
    let validDay = false;
    let validYear = false;

    const month = $(this).parent('.edit-date').children('.edit-date-month').val();

    if (!month) {
      $('.edit-date-text').html(`<span class="error">Please choose a valid month.</span>`);
    }
    else {
      validMonth = true;
    }


    const day = $('#edit-date-day').val();

    if (((month === '4') || (month === '6') || (month === '9') || (month === '11')) && (day > 30)) {
      $('.edit-date-text').html(`<span class="error">Please enter a valid day.</span>`);
    }
    else if ((month === '2') && (day > 29)) {
      $('.edit-date-text').html(`<span class="error">Please enter a valid day.</span>`);
    }
    else if ((day < 1) || (day > 31)) {
      $('.edit-date-text').html(`<span class="error">Please enter a valid day.</span>`);
    }
    else {
      validDay = true;
    }


    const year = $('#edit-date-year').val();
    if (year < 0) {
      $('.edit-date-text').html(`<span class="error">Please choose a valid year.</span>`);
    }
    else {
      validYear = true;
    }

    if ((validDay) && (validYear) && (validMonth)) {
        const data = {
          date: {
            year: year,
            month: month,
            day: day
          }
        };

      changeMovieAPI(user._doc._id, movieId, data)
      .then(() => {
        return getAllMoviesAPI(user._doc._id);
      })
      .then((movies) => {
        components.movies.render(movies, $('#movies'), openAccordions);
      })
    }
});

  $('#wrapper').on('click', '.new-date-cancel', function(event) {
    event.preventDefault();

    const dataId = $(this).parent('span').parent('div').attr('data-id');

    $(this).parent('span').html(`<button type="submit" class="edit-date-button" data-id="${dataId}">Edit</button>`);

  });



  // edit a movie's star rating
  $('#wrapper').on({
      mousemove: function() {

        components.movies.renderStars($(this), $(this).attr('data-id'));

      },

      mouseleave: function() {

        components.movies.renderStars($(this), $(this).parent('div').children('.star-original').attr('data-id'));

      },

      click: function(event) {
        event.preventDefault();

        let newRating = $(this).attr('data-id');
        newRating++;
        const movieId = $(this).parent('.database-starrating').attr('data-id');

        const data = { starRating: newRating };

        changeMovieAPI(user._doc._id, movieId, data)
          .then(() => {
            return getAllMoviesAPI(user._doc._id);
          })
          .then((movies) => {
            components.movies.render(movies, $('#movies'), openAccordions);
          })
      }

  }, '.star');



  // edit a movie's review
  $('#wrapper').on('click', '.edit-review-button', function(event) {
    event.preventDefault();

    const oldReview = $(this).parent('div').parent('div').children('div.read-review').html();

    $(this).parent('div').html(`<textarea name="new-review big" id="new-review" rows="10" cols="80%" placeholder="Write your review here.">${oldReview}</textarea><br />
                                <button type="submit" class="new-review-button">Submit</button>
                                <button type="submit" class="new-review-cancel">Cancel</button>`);

  });

  $('#wrapper').on('click', '.new-review-button', function(event) {
    event.preventDefault();

    const movieId = $(this).parent('div').attr('data-id');
    const data = { review: $('#new-review').val() };

    changeMovieAPI(user._doc._id, movieId, data)
      .then(() => {
        return getAllMoviesAPI(user._doc._id);
      })
      .then((movies) => {
        components.movies.render(movies, $('#movies'), openAccordions);
      })

  });

  $('#wrapper').on('click', '.new-review-cancel', function(event) {
    event.preventDefault();

    $('.edit-review').html(`<button type="submit" class="edit-review-button">Edit Your Review</button>`);

  });



  // expand movie accordions
  $('#wrapper').on('click', '.accordion', function(event) {
    event.preventDefault();

    $(this).parent('.database-entry').children('.panel').toggleClass('retracted');
    $(this).parent('.database-entry').children('.title-edit-right').toggleClass('retracted');
    $(this).toggleClass('make-room');

    const accordionIndex = openAccordions.indexOf($(this).attr('data-id'));

    if (accordionIndex === -1) {
      openAccordions.push($(this).attr('data-id'));
    }
    else {
      openAccordions.splice(accordionIndex, 1);
    }

  });

}