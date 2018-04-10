import API from '../system/api';
import {encrypt} from '../system/security';

export function loginAPI(data) {
  return API.post('/login', { payload: encrypt(data) })
    .then((response) => {
      // assign the returning token to local storage
      window.localStorage.setItem(process.env.token, response.token);
      window.location.hash = '#/movies';

      return response;
    })
    .catch((err) => {
      console.error(err);
    })
}

export function logout() {
  window.localStorage.setItem(process.env.token, '');
  window.location.hash = '#/';
}