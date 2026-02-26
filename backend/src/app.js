const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const TestSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});
const TestModel = mongoose.model("Test", TestSchema);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/test', async (req, res) => {
  try {
    const newEntry = new TestModel({ name: req.body.name || "Test Entry" });
    await newEntry.save();
    res.status(201).json({ message: "Entry created successfully", data: newEntry });
  } catch (error) {
    res.status(500).json({ error: "Failed to create entry", details: error.message });
  }
});

// GET route to retrieve entries
app.get('/test', async (req, res) => {
  try {
    const entries = await TestModel.find();
    res.status(200).json({ message: "Entries retrieved successfully", data: entries });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve entries", details: error.message });
  }
});

module.exports = app;