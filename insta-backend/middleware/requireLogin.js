const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in (no auth header)" });
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(payload._id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        return res.status(401).json({ error: "Invalid token" });
    }
};
