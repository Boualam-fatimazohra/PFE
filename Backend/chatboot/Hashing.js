const crypto = require('crypto');
require('dotenv').config();
const encryptionKey = crypto.scryptSync(process.env.CRYPTO_KEY, 'salt', 32);
const iv = process.env.CRYPTO_IV;
function crypt(text, key = encryptionKey) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}
function decrypt(encrypted, key = encryptionKey) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
    crypt, decrypt
}
