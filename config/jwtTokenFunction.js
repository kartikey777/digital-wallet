const jwt = require("jsonwebtoken");
const jwtSecret = "aatish";

const generateToken = async (id) => {
  return await jwt.sign({ id }, jwtSecret, { expiresIn: "30d" });
};

const verifyToken = async (token) => {
    return await jwt.verify(token, jwtSecret);
}

module.exports = { generateToken , verifyToken};
