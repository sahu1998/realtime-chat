const User = require("../models/user.model");
const { generateToken } = require("../utils/util");
module.exports = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    const file = req.files;
    console.log("file:", file);
    if (file.length) {
      const [image] = file;
      req.body.image = process.env.SERVER_URL + "/uploads/" + image.filename;
    }
    try {
      if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter the required fields!");
      }

      // const userExist = await User.findOne({ email });
      // if (userExist) {
      //   res.status(400);
      //   throw new Error("Email already registered!");
      // }

      const user = await User.create(req.body);
      if (user) {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          token: generateToken({ _id: user._id }),
        });
      } else {
        res.status(500);
        throw new Error("Failed to create the user!");
      }
    } catch (error) {
      res.send({ error: error.message });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        res.status(404);
        throw new Error("Email and Password is required!");
      }
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          token: generateToken({ _id: user._id }),
        });
      } else {
        res.status(404);
        throw new Error("Invalid email or password!");
      }
    } catch (error) {
      res.send({ error: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const userId = req.user._id;
      const {search} = req.query;
      const keyword = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};
        const users = await User.find({_id: {$ne: userId}, ...keyword});
      res.status(200).send(users)
    } catch (error) {
      res.status(400).send({error: error.message})
    }
  },
};
