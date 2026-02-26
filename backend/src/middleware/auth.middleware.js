const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    console.log("Auth middleware called");
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
}

module.exports = auth;