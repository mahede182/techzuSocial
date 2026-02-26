const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../utils/auth.util");
const auth = require("../middleware/auth.middleware");

const register = async (req,res)=> {
    const {name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({error: "User already exists"});
        }
        
        const hashedPassword = await hashPassword(password);
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Failed to register user" });
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "User not found"});
        }
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({message: "Login successful", token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {login, register};