const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyUser = async (req, res, next) => {
    const bearertoken = req.headers.authorization;
    try {
        if(!bearertoken){
            throw new Error("Authentication failed!")
        }
        const token = bearertoken.split(" ").pop();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id, {password: 0})
        next();
    } catch (error) {
        return res.status(401).send({error: error.message});
    }
}
module.exports = {verifyUser}