import API from '../system/api';
import {encrypt} from '../system/security';

export function registerAPI(data) {
  return API.post('/users', { payload: encrypt(data) })
    .then((data) => {
    	return data;
    })
    .catch((err) => {
      console.error(err);
    })
}