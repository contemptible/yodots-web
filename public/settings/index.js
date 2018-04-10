import template from './index.html';
import $ from 'jquery';
import {logout} from '~/services/login';
import {decrypt} from '~/system/security';
import {changeUsernameAPI} from '../../services/settings';

let initialized = false;

export default function() {

  const user = decrypt(window.localStorage.getItem(process.env.token));

	$('#wrapper').html(template);
	$('#login-block').html(`<div id="logout-blurb big">Welcome back, ${user._doc.username}!</div><div><button type="submit" class="logout-button">Log Out</button></div>`);

	$('#login-block').on('click', '.logout-button', function(event) {
    event.preventDefault();
    logout();
  });

  if (initialized)
    return;

  initialized = true;

  $('#wrapper').on('click', '.change-username-button', function(event) {
    event.preventDefault();
    const newUsername = $('#change-username').val();

    if (newUsername ==='')
      $('.error').html("Please enter a valid username.");
    else {

      changeUsernameAPI(user._doc._id, newUsername);

      $('main').html(`<p class="big settings">Your username has been changed. <a href="/#/movies">Click here</a> to return to your movies.</p>`);
      $('#login-block').html(`<div id="logout-blurb big">Welcome back, ${newUsername}!</div><div><button type="submit" class="logout-button">Log Out</button></div>`);
    }

  });

}