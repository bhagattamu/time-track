const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../../config/vars");
const { tokenTypes } = require("../../config/tokens");

const generateToken = (user, expiresIn, type, secret = jwtConfig.secret) => {
  const payload = {
    userId: user.id,
    roles: user.roles,
    type,
  };

  return jwt.sign(payload, secret, { expiresIn });
};

const generateAuthTokens = async (user) => {
  const accessTokenExpiresIn = jwtConfig.accessTokenExpirationMinutes;
  const refreshTokenExpiresIn = jwtConfig.refreshTokenExpirationDays;
  const accessToken = generateToken(
    user,
    accessTokenExpiresIn,
    tokenTypes.ACCESS
  );
  const refreshToken = generateToken(
    user,
    refreshTokenExpiresIn,
    tokenTypes.REFRESH
  );
  return {
    accessToken,
    refreshToken,
  };
};

const verifyTokens = async (token) => {
  const { userId } = jwt.verify(token, jwtConfig.secret);
  return userId;
};

module.exports = {
  generateToken,
  verifyTokens,
  generateAuthTokens,
};
