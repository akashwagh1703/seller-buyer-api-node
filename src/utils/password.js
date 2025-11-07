const crypto = require('crypto');

// CodeIgniter-style encryption/decryption
const encrypt = (text, key) => {
  if (!text || !key) return text;
  
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(key, 'salt', 32), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

const decrypt = (encryptedText, key) => {
  if (!encryptedText || !key) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return encryptedText;
    
    const iv = Buffer.from(parts[0], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(key, 'salt', 32), iv);
    let decrypted = decipher.update(parts[1], 'base64', 'utf8');
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
    
    // Try new encryption format first
    if (encryptedPassword.includes(':')) {
      const decryptedPassword = decrypt(encryptedPassword, encryptionKey);
      return decryptedPassword === plainPassword;
    }
    
    // Fallback to old encryption format
    try {
      const crypto = require('crypto');
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
      let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted === plainPassword;
    } catch (oldError) {
      console.log('Old decryption failed, trying new format');
      const decryptedPassword = decrypt(encryptedPassword, encryptionKey);
      return decryptedPassword === plainPassword;
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

module.exports = { encrypt, decrypt, verifyPassword };