import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useWeb3Auth() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-connect if already authenticated in local session state
  useEffect(() => {
    const storedAccount = localStorage.getItem("mellow_web3_account");
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask extension not detected. Please install a Web3 wallet.");
      }

      // Initialize provider using Ethers.js v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request active accounts from the browser extension
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) {
        throw new Error("No accounts authorized.");
      }
      const address = accounts[0];
      const signer = await provider.getSigner();

      // Step 1: Request unique, server-side generated nonce challenge
      const nonceRes = await fetch(`/api/auth/nonce?address=${encodeURIComponent(address)}`);
      if (!nonceRes.ok) {
        throw new Error("Failed to generate authorization challenge nonce.");
      }
      const { nonce } = await nonceRes.json();

      // Step 2: Request user to cryptographically sign the challenge
      const signature = await signer.signMessage(nonce);

      // Step 3: Validate the cryptographic signature via the secure backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Web3 Cryptographic challenge verification failed.");
      }

      // Session approved! Persist state in memory and localStorage
      localStorage.setItem("mellow_web3_account", address);
      setAccount(address);
      return address;
    } catch (err) {
      console.error("[Web3 Auth Error]:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("mellow_web3_account");
    setAccount(null);
  };

  return {
    account,
    loading,
    error,
    connectWallet,
    disconnectWallet
  };
}
