import API from '../system/api';
import {encrypt, decrypt} from '../system/security';

export function changeUsernameAPI(userId, data) {
  API.put('/users/' + userId, { username: data })
    .then((response) => {

      const updatedUser = decrypt(window.localStorage.getItem(process.env.token));
    	updatedUser._doc.username = data;
      window.localStorage.setItem(process.env.token, encrypt(updatedUser));

    })
    .catch((err) => {
      console.error(err);
    })
}