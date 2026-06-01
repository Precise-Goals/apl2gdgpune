import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { 
  RiCpuLine, 
  RiSearchEyeLine, 
  RiShieldKeyholeLine, 
  RiDatabase2Line,
  RiSparkling2Line,
  RiArrowRightUpLine,
  RiDoubleQuotesL
} from "react-icons/ri";

export default function Home({ isAuthenticated, onOpenAuth, profile, handleLogout }) {
  // State to track hovered bento tiles for micro-animations
  const [hoveredTile, setHoveredTile] = useState(null);

  const bentoTiles = [
    {
      id: "sarvam",
      number: "01",
      icon: <RiCpuLine size={24} style={{ color: "var(--accent-coral)" }} />,
      tag: "Sarvam AI Completer",
      title: "Dual-LLM Completions & Gemini Resiliency",
      desc: "Prompts are securely routed through a Vercel serverless layer directly to Sarvam completion endpoints, backed by Gemini automatic presenter level fallbacks.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      colSpan: 8,
      height: "320px"
    },
    {
      id: "metamask",
      number: "02",
      icon: <RiShieldKeyholeLine size={24} style={{ color: "var(--accent-coral)" }} />,
      tag: "Metamask Integration",
      title: "Web3 Cryptographic Signatures",
      desc: "Rejects vulnerability-prone storage. Authenticates identities via a high-entropy backend nonce cryptographically verified on serverless gateway loops.",
      bgImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      colSpan: 4,
      height: "320px"
    },
    {
      id: "firebase",
      number: "03",
      icon: <RiDatabase2Line size={24} style={{ color: "var(--accent-coral)" }} />,
      tag: "RTDB Persistent Sync",
      title: "Firebase Live Telemetry Profiles",
      desc: "Updates dynamic biometrics, custom companion directions, and remaining API query allocations instantly in Firebase Realtime Database.",
      bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      colSpan: 4,
      height: "300px"
    },
    {
      id: "scrapers",
      number: "04",
      icon: <RiSearchEyeLine size={24} style={{ color: "var(--accent-coral)" }} />,
      tag: "Perplexity RAG Scrapers",
      title: "Live Meteorological & News Pipelines",
      desc: "Enables active REST requests fetching real atmospheric conditions and HackerNews stories, grounding prompts securely inside active world context.",
      bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      colSpan: 8,
      height: "300px"
    }
  ];

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      profile={profile}
      handleLogout={handleLogout}
      onOpenAuth={onOpenAuth}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 30px 100px", boxSizing: "border-box" }}>
        
        {/* Spacious Hero Header */}
        <header style={{ marginBottom: "80px", maxWidth: "950px", textAlign: "left" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--accent-coral)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px" }}>
            <RiSparkling2Line size={16} />
            <span>✦ RAG-OPTIMIZED AI DISCOVERY WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: "5.4rem", lineHeight: "1.05", marginBottom: "28px", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}>
            Meet Mellow. Beautifully Grounded.
          </h1>
          <p style={{ fontSize: "1.35rem", lineHeight: "1.65", color: "var(--text-charcoal)", opacity: 0.9, fontWeight: "300", marginBottom: "40px", maxWidth: "800px" }}>
            Mellow is an elite, competition-grade conversational platform. Wrapped inside a warm, tactile paper layout, it unifies meteorological API streams, custom web scrapers, and dynamic emotional telemetry parameters under MetaMask cryptographic authentications.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <Link 
                to="/agent" 
                className="flat-btn flat-btn-primary" 
                style={{ padding: "14px 30px", fontSize: "0.95rem", borderRadius: "24px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                Enter Workspace <RiArrowRightUpLine size={18} />
              </Link>
            ) : (
              <button 
                type="button"
                onClick={onOpenAuth} 
                className="flat-btn flat-btn-primary" 
                style={{ padding: "14px 30px", fontSize: "0.95rem", borderRadius: "24px" }}
              >
                Launch Workspace ✦
              </button>
            )}
            <Link 
              to="/docs" 
              className="flat-btn" 
              style={{ padding: "14px 30px", fontSize: "0.95rem", borderRadius: "24px", textDecoration: "none" }}
            >
              Technical Specifications
            </Link>
          </div>
        </header>

        {/* =========================================================
           HIGH-FIDELITY INTERACTIVE BENTO GRID
           ========================================================= */}
        <section style={{ marginBottom: "100px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", marginBottom: "30px" }}>
            Platform Node Telemetries
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "24px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            {bentoTiles.map((tile) => {
              const isHovered = hoveredTile === tile.id;
              return (
                <div
                  key={tile.id}
                  onMouseEnter={() => setHoveredTile(tile.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  style={{
                    gridColumn: `span ${tile.colSpan}`,
                    height: tile.height,
                    border: "1px solid var(--border-solid)",
                    background: "var(--sand-light)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "30px",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease",
                    transform: isHovered ? "translateY(-4px)" : "none",
                    boxShadow: isHovered ? "0 12px 30px var(--shadow-color)" : "none"
                  }}
                >
                  {/* Curated Tactile Unsplash background image with smooth parallax hover */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${tile.bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isHovered ? 0.08 : 0.03,
                    transition: "opacity 0.4s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    pointerEvents: "none",
                    zIndex: 0
                  }} />

                  {/* Top segment: Numbers, Tags, Icons */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", opacity: 0.4 }}>{tile.number}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-coral)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {tile.tag}
                      </span>
                    </div>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid var(--border-charcoal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-paper)",
                      transition: "transform 0.3s ease",
                      transform: isHovered ? "rotate(15deg)" : "none"
                    }}>
                      {tile.icon}
                    </div>
                  </div>

                  {/* Bottom segment: Text Block */}
                  <div style={{ textAlign: "left", zIndex: 1, marginTop: "40px" }}>
                    <h3 style={{ fontSize: "1.7rem", fontFamily: "var(--font-serif)", fontWeight: "600", marginBottom: "10px", lineHeight: "1.2" }}>
                      {tile.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", lineHeight: "1.6", opacity: isHovered ? 0.95 : 0.75, margin: 0, transition: "opacity 0.2s" }}>
                      {tile.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Editorial Quote callout */}
        <section style={{
          marginTop: "100px",
          borderTop: "1px solid var(--border-charcoal)",
          paddingTop: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "800px",
          margin: "80px auto 0"
        }}>
          <RiDoubleQuotesL size={45} style={{ color: "var(--accent-coral)", opacity: 0.6, marginBottom: "20px" }} />
          <blockquote style={{
            fontSize: "1.8rem",
            fontFamily: "var(--font-serif)",
            lineHeight: "1.5",
            color: "var(--text-charcoal)",
            textAlign: "center",
            margin: "0 0 24px 0",
            fontStyle: "italic"
          }}>
            "We engineered Mellow to elevate web interactions. It values tactile paper layouts, verified live-stream grounding metrics, and cryptographic user security boundaries over hollow, static placeholders."
          </blockquote>
          <div style={{ fontSize: "0.9rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-coral)" }}>
            Team Falcons Directives / May 2026
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
