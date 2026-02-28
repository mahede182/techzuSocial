const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth.routes")
const post = require("./routes/post.routes")
const { run: runWorker } = require("./workers/notification.worker");

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ 'message': 'Hello World!' })
})

app.use("/api/auth", auth)
app.use("/api/posts", post);

/**
 * POST /api/workers/run
 *
 * Manual worker trigger — only used on Vercel (serverless). 
 * Deploy guide:
 * Render → set ENABLE_WORKER=true (or leave unset), done.
 * Vercel → set ENABLE_WORKER=false + WORKER_SECRET=<random>
 * then add vercel.json:
 * { "crons": [{ "path": "/api/workers/run", "schedule": "* * * * *" }] }
 */
app.post('/api/workers/run', async (req, res) => {
  const secret = process.env.WORKER_SECRET;
  if (secret && req.headers['x-worker-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const processed = await runWorker();
    res.json({ ok: true, processed });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = app;