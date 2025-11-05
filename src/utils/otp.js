const generateOTP = (mobile) => {
  const testNumbers = ['9876543210', '9976543210'];
  
  if (testNumbers.includes(mobile)) {
    return '643215';
  }
  
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateOTP };
