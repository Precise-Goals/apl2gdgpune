import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";

export default function Home({ isAuthenticated, onOpenAuth, profile, handleLogout }) {
  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      profile={profile}
      handleLogout={handleLogout}
      onOpenAuth={onOpenAuth}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 30px", boxSizing: "border-box" }}>
        
        {/* Spacious Hero Header */}
        <header style={{ marginBottom: "80px", maxWidth: "900px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--accent-coral)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>
            <span>✦ HYBRID RAG-OPTIMIZED AI CONVERSATIONAL NETWORK</span>
          </div>
          <h1 style={{ fontSize: "5rem", lineHeight: "1.08", marginBottom: "30px", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}>
            Meet Mellow. Reimagining Real-Time Discovery.
          </h1>
          <p style={{ fontSize: "1.35rem", lineHeight: "1.65", color: "var(--text-charcoal)", opacity: 0.9, fontWeight: "300", marginBottom: "40px" }}>
            Mellow is an elite, competition-grade, character-based RAG AI discovery platform. Built upon a warm, tactile paper design layout, it bridges raw meteorological/sports API streaming and custom web scrapers, verified under strict cryptographic signature validations.
          </p>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <Link 
                to="/agent" 
                className="flat-btn flat-btn-primary" 
                style={{ padding: "14px 28px", fontSize: "0.95rem", borderRadius: "24px", textDecoration: "none" }}
              >
                Launch Workspace ✦
              </Link>
            ) : (
              <button 
                type="button"
                onClick={onOpenAuth} 
                className="flat-btn flat-btn-primary" 
                style={{ padding: "14px 28px", fontSize: "0.95rem", borderRadius: "24px" }}
              >
                Get Started ✦
              </button>
            )}
            <Link 
              to="/docs" 
              className="flat-btn" 
              style={{ padding: "14px 28px", fontSize: "0.95rem", borderRadius: "24px", textDecoration: "none" }}
            >
              Technical Specifications
            </Link>
          </div>
        </header>

        {/* Extensive Deep Copy Feature Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginTop: "100px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "80px" }}>
          
          {/* Dual LLM Architecture */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "var(--accent-coral)", fontWeight: "500" }}>
              01 / Dual-LLM Routing Protocol
            </div>
            <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)" }}>Sarvam AI Core & Gemini Resiliency Fallback</h3>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-charcoal)", opacity: 0.85 }}>
              To deliver optimized regional completions with rapid context evaluation, Mellow routes active prompts through a secure Bun/Vercel serverless layer directly to the **Sarvam AI** completion API (`sarvam-2b-chat` model). If API key quotas are depleted, or if latency limits are reached, the system automatically falls back to a presentation-tier LLM. This provides absolute continuous uptime for hackathon testing and real-world workloads.
            </p>
          </div>

          {/* Web3 Nonce Challenge */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "var(--accent-coral)", fontWeight: "500" }}>
              02 / Web3 Cryptographic Security
            </div>
            <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)" }}>MetaMask Nonce Signed Verification Flow</h3>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-charcoal)", opacity: 0.85 }}>
              Mellow rejects standard vulnerability-prone local storage variables for wallet logins. Access control is maintained by generating a dynamic, high-entropy UUID nonce on our secure Vercel backend. The client signs this challenge cryptographically using their MetaMask private key. Mellow recovers the signer address on our Vercel server using `ethers.verifyMessage()`, protecting user data from spoofing attacks.
            </p>
          </div>

          {/* Dynamic Bento telemetries */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "var(--accent-coral)", fontWeight: "500" }}>
              03 / Realtime Telemetry Grid
            </div>
            <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)" }}>Firebase Realtime Database Profile Sync</h3>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-charcoal)", opacity: 0.85 }}>
              Our control panels are structured into a 1px solid bordered Bento Grid layout. Every modification to user biometric details, dynamic companion selections, and API compute allocations updates instantly in the Firebase Realtime Database. This maintains a persistent, zero-latency sync of compute telemetry across client pages.
            </p>
          </div>

          {/* RAG Scraper nodes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "var(--accent-coral)", fontWeight: "500" }}>
              04 / Perplexity-Style Scrapers
            </div>
            <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)" }}>Meteorological & Athletic API Pipelines</h3>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-charcoal)", opacity: 0.85 }}>
              Mellow integrates genuine data scraper operations. When filters are enabled in the dashboard, the backend makes active HTTP requests to the `Open-Meteo` meteorological network, `OpenLigaDB` tournament databases, and Algolia `HackerNews` article indices. The prompt is automatically grounded inside this dynamic real-time context.
            </p>
          </div>

        </section>

        {/* Editorial Footer callout */}
        <div style={{ marginTop: "120px", padding: "50px", border: "1px solid var(--border-solid)", background: "var(--sand-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
          <div style={{ maxWidth: "600px" }}>
            <h4 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>Team Falcons Engineering Directives</h4>
            <p style={{ fontSize: "0.95rem", opacity: 0.85, margin: 0 }}>
              Dedicated to 100% data integrity, client cryptographic safety, and beautiful paper design spaces.
            </p>
          </div>
          <Link 
            to="/about" 
            className="flat-btn flat-btn-primary" 
            style={{ padding: "12px 24px", borderRadius: "24px", textDecoration: "none" }}
          >
            Read About Team Falcons
          </Link>
        </div>

      </div>
    </PageLayout>
  );
}
