const { verifyToken } = require("../config/jwtTokenFunction");
const Users = require("../models/user.model");

const userValidationMiddleware = async (request, response, next) => {
  try {
    const jwtToken = request.headers.authorization.split(" ")[1];

    const user = await Users.findById((await verifyToken(jwtToken)).id).select(
      "-password"
    );

    request.user = user;
    next();
  } catch (error) { 
    return response.status(401).json({ message: "User Unauthorized" });
  }
}; 

module.exports = userValidationMiddleware;
