const jwt = require('jsonwebtoken');

const generateVerificationToken = () => {
  const verificationToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' });
  return verificationToken;
};

module.exports = {
  generateVerificationToken,
};
