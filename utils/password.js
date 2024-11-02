const crypto = require('node:crypto');
const util = require('node:util');

const scryptAsync = util.promisify(crypto.scrypt);
const randomBytesAsync = util.promisify(crypto.randomBytes);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = await randomBytesAsync(SALT_LENGTH);
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [saltHex, keyHex] = storedHash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
  const key = Buffer.from(keyHex, 'hex');
  return crypto.timingSafeEqual(derivedKey, key);
}

module.exports = {
  hashPassword,
  verifyPassword
};