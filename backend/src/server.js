require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { start: startWorker } = require("./workers/notification.worker");

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  if (process.env.ENABLE_WORKER !== 'false') {
    startWorker();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
