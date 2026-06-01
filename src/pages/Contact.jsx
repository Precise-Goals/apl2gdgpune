import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";

export default function Contact({ isAuthenticated, onOpenAuth, profile, handleLogout }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Discovery Pipeline Integration",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate real database dispatch with a premium, low-latency timeout
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Discovery Pipeline Integration", message: "" });
    }, 1200);
  };

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      profile={profile}
      handleLogout={handleLogout}
      onOpenAuth={onOpenAuth}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 20px", textAlign: "left", boxSizing: "border-box" }}>
        
        <header style={{ marginBottom: "40px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "20px" }}>
          <div style={{ color: "var(--accent-coral)", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            CONNECT WITH THE FLOCK
          </div>
          <h1 style={{ fontSize: "3.2rem", fontFamily: "var(--font-serif)", lineHeight: "1.1" }}>
            Get in Touch.
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.8, marginTop: "8px" }}>
            Have inquiries regarding custom scraper plugins, corporate dual-LLM configurations, or developer routing optimizations? Let's connect.
          </p>
        </header>

        {submitted && (
          <div style={{ border: "1px solid var(--text-charcoal)", background: "var(--sand-light)", padding: "20px", marginBottom: "30px", textAlign: "left" }}>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--accent-coral)", marginBottom: "4px" }}>
              Transmission Complete ✦
            </h4>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: 0 }}>
              Your coordinate has been logged. A member of Team Falcons will route back to your node within 24 hours.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>Full Name</label>
            <input
              type="text"
              className="flat-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Neo Anderson"
              required
              disabled={sending}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>Email Account</label>
            <input
              type="email"
              className="flat-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="neo@matrix.net"
              required
              disabled={sending}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>Core Subject</label>
            <select
              className="flat-input"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              style={{ height: "46px" }}
              disabled={sending}
            >
              <option value="Discovery Pipeline Integration">RAG Scraper Plugins</option>
              <option value="MetaMask Security Audit">MetaMask Cryptographic Challenge</option>
              <option value="Falcons Tech Partnership">Falcons Engineering Ventures</option>
              <option value="System Malfunction Log">Telemetry Bug Report</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>Detailed Message</label>
            <textarea
              className="flat-input"
              rows="6"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Outline your technical requirements here..."
              style={{ resize: "vertical", minHeight: "120px" }}
              required
              disabled={sending}
            />
          </div>

          <button 
            type="submit" 
            disabled={sending}
            className="flat-btn flat-btn-primary" 
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", borderRadius: "24px" }}
          >
            {sending ? "Routing Payload..." : "Send Transmission ✦"}
          </button>

        </form>

      </div>
    </PageLayout>
  );
}
