import { useState } from "react";

/* =========================================================
   LEFT SIDEBAR: Chat History & "New Chat" Button
   ========================================================= */
export function Sidebar({ 
  messages, 
  onNewChat, 
  onSelectHistory, 
  activeLogId,
  isNewChat,
  sidebarOpen,
  setSidebarOpen,
  bentoOpen,
  setBentoOpen
}) {
  return (
    <aside 
      style={{
        width: sidebarOpen ? "280px" : "0px",
        borderRight: sidebarOpen ? "1px solid var(--border-charcoal)" : "none",
        background: "var(--sand-light)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        flexShrink: 0
      }}
    >
      {/* Header Info */}
      <div 
        style={{ 
          padding: "20px 24px", 
          borderBottom: "1px solid var(--border-charcoal)", 
          display: "flex", 
          flexDirection: "column",
          gap: "12px",
          flexShrink: 0
        }}
      >
        {/* New Chat Pill Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="flat-btn flat-btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "10px 16px",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            fontWeight: "600",
            borderRadius: "24px",
            gap: "6px"
          }}
        >
          <span>✦</span> New Chat
        </button>
      </div>

      {/* Chat Logs Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: "700", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 10px 8px 10px" }}>
          Discovery Sessions
        </div>
        {messages.length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--text-charcoal)", opacity: 0.6, padding: "10px" }}>
            No previous telemetry sessions logged.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {messages
              .filter(m => m.role === "user")
              .slice(-12)
              .map((msg, i) => {
                const isActive = !isNewChat && (activeLogId === msg.id || (activeLogId === null && i === messages.filter(m => m.role === "user").slice(-12).length - 1));
                return (
                  <button 
                    key={msg.id || i}
                    type="button"
                    onClick={() => onSelectHistory(msg.id)}
                    style={{
                      padding: "10px 14px",
                      background: isActive ? "var(--sand-dark)" : "transparent",
                      border: isActive ? "1px solid var(--text-charcoal)" : "1px solid transparent",
                      fontSize: "0.8rem",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      width: "100%",
                      outline: "none",
                      color: "var(--text-charcoal)",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(55,56,58,0.06)";
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    💬 {msg.content.replace(/\[RAG Ingestion:.*?\]\n/g, "")}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Footer Controls & System Status */}
      <div 
        style={{ 
          padding: "16px 20px", 
          borderTop: "1px solid var(--border-charcoal)", 
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "var(--bg-paper)",
          flexShrink: 0
        }}
      >
        <button
          type="button"
          onClick={() => setBentoOpen(!bentoOpen)}
          className="flat-btn"
          style={{
            width: "100%",
            fontSize: "0.8rem",
            padding: "8px 12px",
            justifyContent: "center",
            borderRadius: "20px"
          }}
        >
          {bentoOpen ? "⚙️ Hide Telemetry" : "⚙️ Telemetry Controls"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", opacity: 0.7 }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4CAF50", display: "inline-block" }}></span>
          <span>Matrix Node: Operational</span>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   COLLAPSIBLE FIGMA-STYLE PROPERTIES PANEL (RIGHT)
   ========================================================= */
export function TelemetryPanel({
  profile,
  editingProfile,
  setEditingProfile,
  profileForm,
  setProfileForm,
  onProfileSave,
  ragToggles,
  onToggleRag,
  emotionalAspects,
  onSliderChange,
  bentoOpen,
  setBentoOpen
}) {
  // Accordion expanded states
  const [openSections, setOpenSections] = useState({
    identity: true,
    telemetry: true,
    scrapers: true,
    emotions: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const percentageUsed = Math.min(100, Math.round((profile.tokensUsed / profile.apiQuota) * 100));
  const remainingQuota = Math.max(0, profile.apiQuota - profile.tokensUsed);

  return (
    <aside 
      style={{
        width: bentoOpen ? "350px" : "0px",
        borderLeft: bentoOpen ? "1px solid var(--border-charcoal)" : "none",
        background: "var(--sand-light)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        flexShrink: 0
      }}
    >
      {bentoOpen && (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Title Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "12px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "600", fontFamily: "var(--font-sans)" }}>Figma Properties</h3>
            <button 
              type="button"
              onClick={() => setBentoOpen(false)}
              style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--text-charcoal)", opacity: 0.6 }}
            >
              ×
            </button>
          </div>

          {/* =========================================================
             SECTION: Identity Profile Accordion
             ========================================================= */}
          <div style={{ border: "1px solid var(--border-charcoal)", borderRadius: "4px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => toggleSection("identity")}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--sand-dark)",
                border: "none",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-charcoal)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>👤 IDENTITY PROFILE</span>
              <span>{openSections.identity ? "▼" : "◀"}</span>
            </button>
            <div style={{
              height: openSections.identity ? "auto" : "0px",
              opacity: openSections.identity ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.25s ease",
              padding: openSections.identity ? "14px" : "0px"
            }}>
              {!editingProfile ? (
                <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div><strong>Name:</strong> {profile.firstName || "Unset"}</div>
                  <div><strong>Alias:</strong> {profile.alias || "Unset"}</div>
                  <div><strong>Age:</strong> {profile.age || "Unset"} ({profile.gender || "Other"})</div>
                  <div style={{ maxHeight: "70px", overflowY: "auto", fontSize: "0.75rem", opacity: 0.85, background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid var(--border-charcoal)" }}>
                    <strong>Goal:</strong> {profile.basicInfo || "No declared background goals."}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditingProfile(true)} 
                    className="flat-btn" 
                    style={{ width: "100%", padding: "6px 12px", fontSize: "0.75rem", marginTop: "4px", borderRadius: "20px" }}
                  >
                    Edit Identity Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={onProfileSave} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="text" name="firstName" value={profileForm.firstName} onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem" }} placeholder="First Name" />
                  <input type="text" name="alias" value={profileForm.alias} onChange={(e) => setProfileForm(prev => ({ ...prev, alias: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem" }} placeholder="Alias" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <input type="number" name="age" value={profileForm.age} onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem" }} placeholder="Age" />
                    <select name="gender" value={profileForm.gender} onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem", height: "30px" }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <textarea name="basicInfo" value={profileForm.basicInfo} onChange={(e) => setProfileForm(prev => ({ ...prev, basicInfo: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem", resize: "vertical" }} placeholder="Goals background" />
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <button type="submit" className="flat-btn" style={{ padding: "4px 10px", fontSize: "0.75rem", background: "var(--accent-coral)", color: "white", border: "1px solid var(--accent-coral)", borderRadius: "14px" }}>Save</button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="flat-btn" style={{ padding: "4px 10px", fontSize: "0.75rem", borderRadius: "14px" }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* =========================================================
             SECTION: Compute Telemetry Accordion
             ========================================================= */}
          <div style={{ border: "1px solid var(--border-charcoal)", borderRadius: "4px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => toggleSection("telemetry")}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--sand-dark)",
                border: "none",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-charcoal)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>📊 COMPUTE TELEMETRY</span>
              <span>{openSections.telemetry ? "▼" : "◀"}</span>
            </button>
            <div style={{
              height: openSections.telemetry ? "auto" : "0px",
              opacity: openSections.telemetry ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.25s ease",
              padding: openSections.telemetry ? "14px" : "0px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600" }}>
                  <span>Token Depletion:</span>
                  <strong>{profile.tokensUsed} / {profile.apiQuota}</strong>
                </div>
                <div style={{ background: "var(--sand-dark)", height: "6px", width: "100%", position: "relative", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${percentageUsed}%`, background: "var(--accent-coral)", height: "100%", transition: "width 0.3s ease" }}></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem", marginTop: "4px" }}>
                  <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid var(--border-charcoal)", borderRadius: "4px" }}>
                    <div>Queries Run</div>
                    <strong style={{ fontSize: "1rem", color: "var(--accent-coral)" }}>{profile.computeCallFrequency}</strong>
                  </div>
                  <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid var(--border-charcoal)", borderRadius: "4px" }}>
                    <div>Remaining</div>
                    <strong style={{ fontSize: "1rem" }}>{remainingQuota}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
             SECTION: Scraper Filters Accordion
             ========================================================= */}
          <div style={{ border: "1px solid var(--border-charcoal)", borderRadius: "4px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => toggleSection("scrapers")}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--sand-dark)",
                border: "none",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-charcoal)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>🔍 RAG SCRAPERS</span>
              <span>{openSections.scrapers ? "▼" : "◀"}</span>
            </button>
            <div style={{
              height: openSections.scrapers ? "auto" : "0px",
              opacity: openSections.scrapers ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.25s ease",
              padding: openSections.scrapers ? "6px 14px" : "0px"
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Weather */}
                <div className="flat-toggle-wrapper" style={{ padding: "8px 0" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>☁️ Weather Stream</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.weather} onChange={() => onToggleRag("weather")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* Sports */}
                <div className="flat-toggle-wrapper" style={{ padding: "8px 0" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>🏆 Sports Standings</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.sports} onChange={() => onToggleRag("sports")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* News Scraper */}
                <div className="flat-toggle-wrapper" style={{ borderBottom: "none", padding: "8px 0" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>🔍 Web News Scraper</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.scraper} onChange={() => onToggleRag("scraper")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
             SECTION: Emotional Aspect Sliders Accordion
             ========================================================= */}
          <div style={{ border: "1px solid var(--border-charcoal)", borderRadius: "4px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => toggleSection("emotions")}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--sand-dark)",
                border: "none",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-charcoal)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>🎭 EMOTIONAL ASPECTS</span>
              <span>{openSections.emotions ? "▼" : "◀"}</span>
            </button>
            <div style={{
              height: openSections.emotions ? "auto" : "0px",
              opacity: openSections.emotions ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.25s ease",
              padding: openSections.emotions ? "14px" : "0px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                
                {/* Empathy */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" }}>
                    <span>Empathy</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.empathy}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.empathy} 
                    onChange={(e) => onSliderChange("empathy", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)", cursor: "pointer" }}
                  />
                </div>

                {/* Candor */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" }}>
                    <span>Candor (Directness)</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.candor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.candor} 
                    onChange={(e) => onSliderChange("candor", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)", cursor: "pointer" }}
                  />
                </div>

                {/* Humor */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" }}>
                    <span>Humor</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.humor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.humor} 
                    onChange={(e) => onSliderChange("humor", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)", cursor: "pointer" }}
                  />
                </div>

                {/* Formality */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" }}>
                    <span>Formality</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.formality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.formality} 
                    onChange={(e) => onSliderChange("formality", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)", cursor: "pointer" }}
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      )}
    </aside>
  );
}
