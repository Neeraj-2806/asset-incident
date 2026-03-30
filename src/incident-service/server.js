const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   REDIS CONFIG
   incident-service has its
   own dedicated Redis
========================= */
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;
const redis = createClient({
  socket: { host: redisHost, port: redisPort },
});
redis.on("error", (err) => console.log("Redis Error:", err));
(async () => {
  await redis.connect();
  console.log(`Incident Service connected to Redis at ${redisHost}:${redisPort}`);
})();

const PORT = 5002;

/* =========================
   HELPER - GET NEXT ID
========================= */
const getNextId = async (key) => {
  return await redis.incr(key);
};

/* =========================
   CREATE INCIDENT
   Called by browser via Nginx
========================= */
app.post("/api/incident", async (req, res) => {
  const { assetId, issue } = req.body;
  const id = await getNextId("counter:incidentId");
  const incident = { id, assetId, issue, createdAt: new Date() };
  await redis.rPush(`incidents:asset:${assetId}`, JSON.stringify(incident));
  res.send(incident);
});

/* =========================
   GET INCIDENTS BY ASSET ID
   Called internally by
   asset-service only
========================= */
app.get("/incidents/:assetId", async (req, res) => {
  const { assetId } = req.params;
  const incidents = await redis.lRange(`incidents:asset:${assetId}`, 0, -1);
  res.send(incidents.map((i) => JSON.parse(i)));
});

/* =========================
   DELETE ALL INCIDENTS
   FOR AN ASSET
   Called internally by
   asset-service when
   an asset is deleted
========================= */
app.delete("/incidents/asset/:assetId", async (req, res) => {
  const { assetId } = req.params;
  await redis.del(`incidents:asset:${assetId}`);
  res.send("Incidents deleted for asset");
});

/* =========================
   UPDATE INCIDENT
   Called by browser via Nginx
========================= */
app.put("/api/incident/:assetId/:incidentId", async (req, res) => {
  const { assetId, incidentId } = req.params;
  const { issue } = req.body;
  const key = `incidents:asset:${assetId}`;
  const incidents = await redis.lRange(key, 0, -1);
  const updated = incidents.map((item) => {
    const obj = JSON.parse(item);
    if (obj.id == incidentId) obj.issue = issue || obj.issue;
    return JSON.stringify(obj);
  });
  await redis.del(key);
  if (updated.length > 0) await redis.rPush(key, updated);
  res.send("Incident updated");
});

/* =========================
   DELETE INCIDENT
   Called by browser via Nginx
========================= */
app.delete("/api/incident/:assetId/:incidentId", async (req, res) => {
  const { assetId, incidentId } = req.params;
  const key = `incidents:asset:${assetId}`;
  const incidents = await redis.lRange(key, 0, -1);
  const filtered = incidents.filter((item) => {
    const obj = JSON.parse(item);
    return obj.id != incidentId;
  });
  await redis.del(key);
  if (filtered.length > 0) await redis.rPush(key, filtered);
  res.send("Incident deleted");
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Incident Service running on port ${PORT}`);
});
