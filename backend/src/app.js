const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth.routes")

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", auth)


module.exports = app;