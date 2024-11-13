const registerModel = require("../models/register");
const jwt = require("jsonwebtoken");

exports.isLogin = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).send({ message: "Access Denied. No token provided." });

        const { id } = jwt.verify(token, "myjwtsecret"); // Destructure 'id' from the token verification
        req.userId = id; // Pass the user ID to the next middleware

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(400).json({ message: "Invalid token." });
    }
};
