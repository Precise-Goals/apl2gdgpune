import { useState } from "react";

export default function BentoDashboard({ 
  profile, 
  onUpdateProfile, 
  ragToggles, 
  onToggleRag 
}) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    alias: profile.alias || "",
    age: profile.age || "",
    gender: profile.gender || "Other",
    phone: profile.phone || "",
    email: profile.email || ""
  });

  const characters = {
    cyberpunk_hacker: { name: "Cyberpunk Hacker", icon: "⚡", avatar: "🤖", color: "#aa3bff" },
    synthwave_samurai: { name: "Synthwave Samurai", icon: "🎸", avatar: "👺", color: "#cf5254" },
    solarpunk_mystic: { name: "Solarpunk Mystic", icon: "🌱", avatar: "👽", color: "#10b981" },
    retro_gamer: { name: "Retro Gamer", icon: "🕹️", avatar: "👾", color: "#f59e0b" }
  };

  const activeChar = characters[profile.characterPreference] || characters.cyberpunk_hacker;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await onUpdateProfile(formData);
      setEditing(false);
    } catch (err) {
      alert("Error saving profile changes!");
    }
  };

  // Compute stats calculations for dynamic monitoring visualizer
  const percentageUsed = Math.min(100, Math.round((profile.tokensUsed / profile.apiQuota) * 100));
  const remainingQuota = Math.max(0, profile.apiQuota - profile.tokensUsed);

  return (
    <div className="bento-grid" style={{ padding: "10px", boxSizing: "border-box" }}>
      
      {/* MODULE A: Biometric Profile Record Tile */}
      <section className="glass-panel asymmetric-tile" style={{ gridColumn: "span 5", padding: "24px", minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div className="skewed-tag" style={{ fontSize: "0.8rem", marginBottom: "15px" }}>
            Biometric Profile
          </div>
          <h3>Welcome back, {profile.alias || "Nomad"}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--sand-dark)", marginBottom: "20px" }}>
            Real-time synchronization active with Cloud Node.
          </p>

          {!editing ? (
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
              <div><strong>First Name:</strong> {profile.firstName || "Unset"}</div>
              <div><strong>Alias Name:</strong> {profile.alias || "Unset"}</div>
              <div><strong>Age:</strong> {profile.age || "Unset"}</div>
              <div><strong>Gender:</strong> {profile.gender || "Unset"}</div>
              <div><strong>Phone Number:</strong> {profile.phone || "Unset"}</div>
              <div><strong>Email Account:</strong> {profile.email || "Unset"}</div>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="clay-input" placeholder="First Name" />
                <input type="text" name="alias" value={formData.alias} onChange={handleInputChange} className="clay-input" placeholder="Alias" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="clay-input" placeholder="Age" />
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="clay-input">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="clay-input" placeholder="Phone" />
              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <button type="submit" className="clay-pill" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Save</button>
                <button type="button" onClick={() => setEditing(false)} className="clay-pill" style={{ padding: "8px 18px", fontSize: "0.85rem", background: "var(--slate-deep)" }}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {!editing && (
          <button 
            type="button"
            className="clay-pill" 
            style={{ width: "100%", marginTop: "15px" }} 
            onClick={() => {
              setFormData({
                firstName: profile.firstName || "",
                alias: profile.alias || "",
                age: profile.age || "",
                gender: profile.gender || "Other",
                phone: profile.phone || "",
                email: profile.email || ""
              });
              setEditing(true);
            }}
          >
            Modify Biometrics ⚙️
          </button>
        )}
      </section>

      {/* MODULE B: Dynamic 3D Character Companion Frame */}
      <section className="glass-panel" style={{ gridColumn: "span 4", padding: "24px", minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
        <div className="skewed-tag" style={{ fontSize: "0.8rem", alignSelf: "flex-start", marginBottom: "10px" }}>
          companion engine
        </div>

        <div className="floating-asset" style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeChar.color}50 0%, transparent 70%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "5rem",
          boxShadow: `0 0 30px 5px ${activeChar.color}25`
        }}>
          {activeChar.avatar}
        </div>

        <div style={{ width: "100%" }}>
          <h4 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>{activeChar.icon}</span>
            <span>{activeChar.name}</span>
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--sand-dark)", marginTop: "6px" }}>
            Prompt baseline injection active.
          </p>
        </div>
      </section>

      {/* MODULE C: API & Compute telemetry Monitor */}
      <section className="glass-panel" style={{ gridColumn: "span 3", padding: "24px", minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div className="skewed-tag" style={{ fontSize: "0.8rem", marginBottom: "15px" }}>
            Compute Monitor
          </div>
          <h3>Token Depletion</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--sand-dark)", marginBottom: "20px" }}>
            Live platform metrics.
          </p>

          {/* Simple Vector Graph representation for elegant visuals */}
          <div style={{ height: "70px", display: "flex", alignItems: "flex-end", gap: "6px", margin: "15px 0", padding: "10px 0", borderBottom: "1px solid rgba(225, 219, 209, 0.2)" }}>
            <div style={{ flex: 1, height: "35%", background: "rgba(225, 219, 209, 0.2)", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: "55%", background: "rgba(225, 219, 209, 0.3)", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: "45%", background: "rgba(207, 82, 84, 0.4)", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: "75%", background: "rgba(207, 82, 84, 0.7)", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: `${percentageUsed}%`, background: "var(--coral-crimson)", borderRadius: "4px", minHeight: "15%" }}></div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "10px" }}>
            <span>Tokens Consumed:</span>
            <strong>{profile.tokensUsed} / {profile.apiQuota}</strong>
          </div>

          <div style={{ background: "rgba(26, 27, 28, 0.6)", borderRadius: "10px", height: "10px", marginTop: "6px", overflow: "hidden" }}>
            <div style={{ width: `${percentageUsed}%`, background: "var(--coral-crimson)", height: "100%", borderRadius: "10px", transition: "width 0.5s ease" }}></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem", textAlign: "left", marginTop: "10px" }}>
          <div style={{ background: "rgba(26, 27, 28, 0.4)", padding: "8px 10px", borderRadius: "10px" }}>
            <div style={{ color: "var(--sand-dark)" }}>Queries</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--sand-light)" }}>{profile.computeCallFrequency}</div>
          </div>
          <div style={{ background: "rgba(26, 27, 28, 0.4)", padding: "8px 10px", borderRadius: "10px" }}>
            <div style={{ color: "var(--sand-dark)" }}>Left</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--sand-light)" }}>{remainingQuota}</div>
          </div>
        </div>
      </section>

      {/* RAG Core Toggles Module (Spans full width of Bento grid bottom row) */}
      <section className="glass-panel asymmetric-tile" style={{ gridColumn: "span 12", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
        <div style={{ textAlign: "left" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--coral-crimson)" }}>⚙️</span> 
            <span>RAG Scraper Aggregation Filters</span>
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--sand-dark)" }}>
            Supplementary streams inject live metadata payloads directly into active chat buffers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          {/* Weather Feed Toggle */}
          <div className="toggle-wrapper" style={{ minWidth: "160px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>☁️ Weather Stream</span>
            <label className="clay-switch">
              <input 
                type="checkbox" 
                checked={!!ragToggles.weather} 
                onChange={() => onToggleRag("weather")} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          {/* Sports Feed Toggle */}
          <div className="toggle-wrapper" style={{ minWidth: "160px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>🏆 Sports Match</span>
            <label className="clay-switch">
              <input 
                type="checkbox" 
                checked={!!ragToggles.sports} 
                onChange={() => onToggleRag("sports")} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          {/* Web Headless Scraper Toggle */}
          <div className="toggle-wrapper" style={{ minWidth: "160px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>🔍 Web Scraper</span>
            <label className="clay-switch">
              <input 
                type="checkbox" 
                checked={!!ragToggles.scraper} 
                onChange={() => onToggleRag("scraper")} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </section>

    </div>
  );
}
