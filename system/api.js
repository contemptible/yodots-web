import request from 'superagent';
import {encrypt, decrypt} from './security';

export default {
  get: get,
  post: post,
  put: put,
  delete: del
}

function get(url) {
  return new Promise((resolve, reject) => {
    Request('get', url)
      .end((error, response) => {
        if (error)
          return reject(error);
        resolve(response.body);
      })
  })
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    Request('post', url)
      .send(data)
      .end((error, response) => {
        if (error)
          return reject(error);
        resolve(response.body);
      })
  })
}

function put(url, data) {
  return new Promise((resolve, reject) => {
    Request('put', url)
      .send(data)
      .end((error, response) => {
        if (error)
          return reject(error);
        resolve(response.body);
      })
  })
}

function del(url) {
  return new Promise((resolve, reject) => {
    Request('delete', url)
      .end((error, response) => {
        if (error)
          return reject(error);
        resolve(response.body);
      })
  })
}

function Request(action, url) {
  return request[action](process.env.baseUrl + url)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + window.localStorage.getItem(process.env.token));
}