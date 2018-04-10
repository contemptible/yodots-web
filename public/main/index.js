import template from './index.html';
import { loginAPI } from '~/services/login';
import $ from 'jquery';
import security from '~/system/security';
import identity from '~/system/identity';

export default function() {

  if (identity()) {
    window.location.hash = "#/movies";
  }

	$('#wrapper').html(template);

  $('#login-block').on('keyup', '#password', function(event) {
    event.preventDefault();

    if (event.keyCode == 13)
      $('.login-button').trigger('click');
  });
	
	$('#login-block').on('click', '.login-button', function(event) {
    event.preventDefault();

    const data = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    // display an error if the user left a field blank
    if ((data.email === '') || (data.password === '')) {
      $('#login-error').html(`<span class="error">Please fill in all fields.</span>`);
    }

    // otherwise, display a loading animation and log the user in
    $('#loading').html(`<div class="loader"></div>`);

    loginAPI(data)
      .then((response) => {
        if (!response)
          $('#loading').html(``);
          $('#login-error').html(`<span class="error">Your credentials are invalid! Please reenter them.</span>`);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  $('#wrapper').on('click', '.registration-button', function(event) {
    event.preventDefault();

    window.location.hash = '#/register';
  });

}