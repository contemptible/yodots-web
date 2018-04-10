import jwt from 'jsonwebtoken';

export function encrypt(value) {
  return jwt.sign(value, process.env.SHARED_SECRET);
}

export function decrypt(value) {
  return jwt.decode(value);
}