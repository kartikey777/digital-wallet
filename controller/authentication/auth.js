const Users = require("../../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { generateToken } = require("../../config/jwtTokenFunction.js");
const userInputSchema = zod.object({
  userName: zod.string().min(3).max(20),
  password: zod.string().min(4).max(20),
});

const register = async (req, res) => {
  try {
    // await userInputSchema.parse(req.body); // validate user input
    const { userName, password } = req.body;

    if (await Users.findOne({ userName })) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await Users.create({ userName, password: hashedPassword });
    const token = await generateToken(newUser._id);

    

    return res
      .status(200)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    console.log("register", error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    await userInputSchema.safeParse(req.body); // validate user input

    const { userName, password } = req.body;

    const user = await Users.findOne({ userName });

    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = await generateToken(user._id);
      return res
        .status(200)
        .json({ message: "User logged in successfully", token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.log("login", error);
    return res.status(500).json({ message: error.message });
  }
};

const usersData = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await Users.find({
      userName: { $regex: filter, $options: "i" , $ne : req.user.userName},
    });

    return res.status(200).json(users); 
  } 
  catch (error) {
    return res.status(400).json({ message: "data not found" });
  }
};

module.exports = { register, login, usersData };
