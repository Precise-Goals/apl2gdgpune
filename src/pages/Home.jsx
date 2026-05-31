import { Link } from "react-router-dom";

export default function Home({ isAuthenticated, onOpenAuth }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 20px", textAlign: "left", boxSizing: "border-box" }}>
      
      {/* Hero Section */}
      <header style={{ marginBottom: "60px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-coral)", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "15px" }}>
          <span>✦ RAG-OPTIMIZED AI CONVERSATIONAL PLATFORM</span>
        </div>
        <h1 style={{ fontSize: "4.5rem", lineHeight: "1.05", marginBottom: "25px", fontFamily: "var(--font-serif)" }}>
          Meet Mellow. Your RAG-Optimized Discovery Engine.
        </h1>
        <p style={{ fontSize: "1.35rem", lineHeight: "1.5", color: "var(--text-charcoal)", opacity: 0.9, fontWeight: "300", maxWidth: "780px", marginBottom: "35px" }}>
          A beautiful, typography-driven research canvas that seamlessly bridges real-time Scraping pipelines, tournament standing metrics, and cryptographic Web3 identity protocols under a clean paper visual system.
        </p>

        <div style={{ display: "flex", gap: "15px" }}>
          {isAuthenticated ? (
            <Link to="/agent" className="flat-btn flat-btn-primary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
              Launch Workspace ✦
            </Link>
          ) : (
            <button 
              type="button"
              onClick={onOpenAuth} 
              className="flat-btn flat-btn-primary" 
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Get Started ✦
            </button>
          )}
          <Link to="/docs" className="flat-btn" style={{ padding: "14px 28px", fontSize: "1rem" }}>
            Read Specifications
          </Link>
        </div>
      </header>

      {/* Feature Grids - Flat, 1px Outlines */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "80px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "60px" }}>
        
        {/* Core RAG Architecture */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)", color: "var(--text-charcoal)" }}>
            01 / Unified RAG Integration
          </div>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)" }}>Retrieval-Augmented Context</h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-charcoal)", opacity: 0.8 }}>
            Unlike simple conversational logs, Mellow integrates live background scraping matrices. It dynamically pulls real-time weather logs, Bundesliga sports standings, and performs search crawling queries using headless scraper nodes to inject contextual prompts prior to model evaluations.
          </p>
        </div>

        {/* Dual LLM Architecture */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)", color: "var(--text-charcoal)" }}>
            02 / Double LLM Engine
          </div>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)" }}>Sarvam AI + Gemini Gateway</h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-charcoal)", opacity: 0.8 }}>
            Mellow isolates production tokens by running server-side requests through a secure Sarvam AI chat endpoint layer optimized for lightning-fast regional context routing, and dynamically falls back to standard LLM completions if rate limits or API quotas are exhausted.
          </p>
        </div>

        {/* MetaMask Nonce Challenge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)", color: "var(--text-charcoal)" }}>
            03 / Cryptographic Session Gate
          </div>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)" }}>Signature Verification</h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-charcoal)", opacity: 0.8 }}>
            To prevent identity spoofing, Mellow's Web3 vector requests user address confirmations via cryptographically signed nonce challenges. The server runs `ethers.verifyMessage()` strictly in our secure Bun backend to match signers, securing sessions securely.
          </p>
        </div>

        {/* Clean Bento Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)", color: "var(--text-charcoal)" }}>
            04 / Typographic Bento Grids
          </div>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)" }}>Compute Telemetry</h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-charcoal)", opacity: 0.8 }}>
            Ditching cramped dark dashboards, Mellow structures user configurations inside an elegant, flat, 1px-outlined Bento Grid system on warm paper backdrops, monitoring token depletion, query frequencies, and profile details in real-time.
          </p>
        </div>

      </section>

      {/* Falcon Footer Tag */}
      <div style={{ marginTop: "100px", padding: "30px", border: "1px solid var(--text-charcoal)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h4 style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)" }}>Falcon Tech Community Standard</h4>
          <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "4px" }}>Engineered for the May 2026 RAG Discovery Hackathon.</p>
        </div>
        <Link to="/about" className="flat-btn" style={{ background: "var(--text-charcoal)", color: "var(--bg-paper)" }}>
          About Team Falcons
        </Link>
      </div>

    </div>
  );
}
