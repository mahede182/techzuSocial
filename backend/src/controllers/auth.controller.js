const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../utils/auth.util");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Failed to register user" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        // user = await User.findOne({ email: email.toLowerCase() });
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ _id: user._id, name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
}

module.exports = { login, register, getMe };