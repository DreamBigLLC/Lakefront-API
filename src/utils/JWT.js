const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { email: user.email, userType: user.userType },
    process.env.JWT_secret
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(400).json({ error: "User not Authenticated" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_secret);
    if (validToken) {
        req.authenticated = true
        return next()
    }
  } catch (err) {
      return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
