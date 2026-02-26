const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})

module.exports = mongoose.model("User", userSchema);