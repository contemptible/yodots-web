import main from './main';
import movies from './movies';
import settings from './settings';
import register from './register';
import director from 'director/build/director';

const routes = {
	'/': main,
	'/movies': movies,
	'/settings': settings,
	'/register': register
}

var router = director.Router(routes);

router.init('#/');