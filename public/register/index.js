import template from './index.html';
import { decrypt } from '~/system/security';
import $ from 'jquery';
import { registerAPI } from '~/services/register';

export default function() {
  $('#wrapper').html(template);

  $('#wrapper').on('click', '.register', function(event) {
  	event.preventDefault();

    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();

    if (username === '')
      $('.registration-username').html("<span class='error'>Please enter a username.</span>");
    if (email === '')
      $('.registration-email').html("<span class='error'>Please enter an email address.</span>");
    if (password === '')
      $('.registration-password').html("<span class='error'>Please enter a password.</span>");

    if ((username != '') && (email != '') && (password != '')) {

    	const data = {
    	  username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val()
      };

      registerAPI(data)
        .then((data) => {
          if (data)
            $('#registration').html(`Thank you for registering, ${username}! Please <a href="/#">click here</a> to return to the main page and log in.`);
          else
            $('#registration-text').html(`There was something wrong with your registration! Please enter different credentials and try again.`);
        })
        .catch((error) => {
          console.error(error);
        });
    }

  })
}