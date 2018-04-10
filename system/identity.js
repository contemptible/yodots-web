import {decrypt} from './security';

// returns the decrypted yodots.token from localStorage
export default function identity() {
	return decrypt(window.localStorage.getItem(process.env.token));
}