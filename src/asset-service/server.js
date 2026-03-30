const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   REDIS CONFIG
   asset-service has its
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
  console.log(`Asset Service connected to Redis at ${redisHost}:${redisPort}`);
})();

/* =========================
   INCIDENT SERVICE URL
   Used for inter-service
   communication
========================= */
const INCIDENT_SERVICE_URL =
  process.env.INCIDENT_SERVICE_URL || "http://localhost:5002";

const PORT = 5001;

/* =========================
   HELPER - GET NEXT ID
========================= */
const getNextId = async (key) => {
  return await redis.incr(key);
};

/* =========================
   CREATE ASSET
========================= */
app.post("/api/asset", async (req, res) => {
  const { name, type } = req.body;
  const id = await getNextId("counter:assetId");
  const asset = { id, name, type, createdAt: new Date() };
  await redis.set(`asset:${id}`, JSON.stringify(asset));
  res.send(asset);
});

/* =========================
   GET ALL ASSETS WITH
   INCIDENTS
   Calls incident-service
   via HTTP to get incidents
========================= */
app.get("/api/data", async (req, res) => {
  const keys = await redis.keys("asset:*");
  const result = [];

  for (let key of keys) {
    const asset = JSON.parse(await redis.get(key));

    // ✅ Call incident-service to get incidents for this asset
    try {
      const incidentRes = await fetch(
        `${INCIDENT_SERVICE_URL}/incidents/${asset.id}`
      );
      asset.incidents = await incidentRes.json();
    } catch (err) {
      console.log(`Could not fetch incidents for asset ${asset.id}:`, err.message);
      asset.incidents = [];
    }

    result.push(asset);
  }

  res.send(result);
});

/* =========================
   UPDATE ASSET
========================= */
app.put("/api/asset/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  const assetData = await redis.get(`asset:${id}`);
  if (!assetData) return res.status(404).send("Asset not found");
  const asset = JSON.parse(assetData);
  asset.name = name || asset.name;
  asset.type = type || asset.type;
  await redis.set(`asset:${id}`, JSON.stringify(asset));
  res.send(asset);
});

/* =========================
   DELETE ASSET
   Also calls incident-service
   to delete related incidents
========================= */
app.delete("/api/asset/:id", async (req, res) => {
  const { id } = req.params;
  await redis.del(`asset:${id}`);

  // ✅ Call incident-service to delete all incidents for this asset
  try {
    await fetch(`${INCIDENT_SERVICE_URL}/incidents/asset/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(`Could not delete incidents for asset ${id}:`, err.message);
  }

  res.send("Asset deleted");
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Asset Service running on port ${PORT}`);
  console.log(`Incident Service URL: ${INCIDENT_SERVICE_URL}`);
});
