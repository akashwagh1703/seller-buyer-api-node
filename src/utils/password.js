const crypto = require('crypto');

// CodeIgniter-style encryption/decryption
const encrypt = (text, key) => {
  if (!text || !key) return text;
  
  try {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

const decrypt = (encryptedText, key) => {
  if (!encryptedText || !key) return encryptedText;
  
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText;
  }
};

const verifyPassword = (plainPassword, encryptedPassword, encryptionKey) => {
  if (!plainPassword) return false;
  if (!encryptedPassword || encryptedPassword === null) {
    console.log('No password stored for user');
    return false;
  }
  
  try {
    // First try direct comparison (in case password is stored as plain text)
    if (encryptedPassword === plainPassword) {
      return true;
    }
    
    // Then try decryption
    const decryptedPassword = decrypt(encryptedPassword, encryptionKey);
    console.log('Plain:', plainPassword, 'Encrypted:', encryptedPassword, 'Decrypted:', decryptedPassword);
    return decryptedPassword === plainPassword;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

module.exports = { encrypt, decrypt, verifyPassword };