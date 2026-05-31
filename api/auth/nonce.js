import crypto from "crypto";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Missing wallet address" });
  }

  const randomNonce = `Mellow Challenge Nonce: ${crypto.randomUUID()} - Address: ${address} - Timestamp: ${Date.now()}`;
  
  // Persist within global lambda environment memory bounds
  global.nonceStore = global.nonceStore || new Map();
  global.nonceStore.set(address.toLowerCase(), randomNonce);

  return res.status(200).json({ nonce: randomNonce });
}
