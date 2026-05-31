import { ethers } from "ethers";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      return res.status(400).json({ error: "Missing address or signature parameters" });
    }

    global.nonceStore = global.nonceStore || new Map();
    const expectedNonce = global.nonceStore.get(address.toLowerCase());

    if (!expectedNonce) {
      return res.status(400).json({ error: "Challenge nonce expired or missing. Please reconnect MetaMask." });
    }

    // Recover address using cryptographic math (ethers.verifyMessage)
    const recoveredAddress = ethers.verifyMessage(expectedNonce, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      global.nonceStore.delete(address.toLowerCase()); // Purge spent nonce
      return res.status(200).json({ success: true, verifiedAddress: recoveredAddress });
    } else {
      return res.status(401).json({ error: "Cryptographic signature validation failure." });
    }
  } catch (error) {
    console.error("[Web3 Signature Vercel Verification Exception]:", error);
    return res.status(500).json({ error: error.message || "Internal Verification Failure" });
  }
}
