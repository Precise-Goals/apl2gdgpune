import { useState } from "react";
import { 
  LuPlus, 
  LuMessageSquare, 
  LuLogOut, 
  LuSlidersHorizontal, 
  LuCloud, 
  LuTrophy, 
  LuGlobe, 
  LuRotateCcw, 
  LuArchive,
  LuCpu
} from "react-icons/lu";

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
  profile,
  handleLogout
}) {
  // Extract user-role messages for history thread indexing
  const userMessages = messages.filter(m => m.role === "user");

  return (
    <aside 
      style={{
        width: sidebarOpen ? "280px" : "0px",
        borderRight: sidebarOpen ? "1px solid #37383A" : "none",
        background: "#37383A",
        color: "#E1DBD1",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        flexShrink: 0,
        zIndex: 15
      }}
    >
      {/* Header Info with Mellow Sparkle Logo */}
      <div 
        style={{ 
          padding: "20px 24px", 
          display: "flex", 
          flexDirection: "column",
          gap: "20px",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#CF5254", fontSize: "1.3rem", display: "flex", alignItems: "center", fontWeight: "600" }}>✦</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: "600", letterSpacing: "normal", color: "#E1DBD1" }}>
            Mellow AI
          </span>
        </div>

        {/* New Chat Pill Button */}
        <button
          type="button"
          onClick={onNewChat}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 16px",
            fontSize: "0.85rem",
            fontWeight: "600",
            borderRadius: "24px",
            background: "#CF5254",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            gap: "8px",
            transition: "background-color 0.2s ease",
            fontFamily: "var(--font-sans)"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#b84143"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#CF5254"}
        >
          <LuPlus size={16} /> New Chat
        </button>
      </div>

      {/* Chat Logs Area (Scrolled Thread list) */}
      <div 
        className="chat-scroll" 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "0 24px 20px" 
        }}
      >
        <div style={{ 
          fontSize: "0.75rem", 
          fontWeight: "600", 
          color: "rgba(225, 219, 209, 0.4)", 
          textTransform: "uppercase", 
          letterSpacing: "0.08em", 
          marginBottom: "12px",
          fontFamily: "var(--font-sans)"
        }}>
          Discovery Sessions
        </div>

        {userMessages.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#E1DBD1", opacity: 0.5, fontWeight: "500", fontStyle: "normal", padding: "0 4px", fontFamily: "var(--font-sans)" }}>
            No previous telemetry logs.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {userMessages.slice(-12).map((msg, i) => {
              const isActive = !isNewChat && (activeLogId === msg.id || (activeLogId === null && i === userMessages.slice(-12).length - 1));
              return (
                <button 
                  key={msg.id || i}
                  type="button"
                  onClick={() => onSelectHistory(msg.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(225, 219, 209, 0.3)" : "1px solid transparent",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    fontFamily: "var(--font-sans)",
                    textAlign: "left",
                    cursor: "pointer",
                    width: "100%",
                    outline: "none",
                    color: "#E1DBD1",
                    borderRadius: "8px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <LuMessageSquare size={15} style={{ flexShrink: 0, opacity: isActive ? 0.9 : 0.5 }} />
                  <span style={{ 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap" 
                  }}>
                    {msg.content.replace(/\[RAG Ingestion:.*?\]\n/g, "")}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Archived Threads Mock list to replicate HTML parity */}
        <div style={{ 
          fontSize: "0.75rem", 
          fontWeight: "600", 
          color: "rgba(225, 219, 209, 0.4)", 
          textTransform: "uppercase", 
          letterSpacing: "0.08em", 
          marginTop: "24px",
          marginBottom: "12px",
          fontFamily: "var(--font-sans)"
        }}>
          Archived Threads
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            fontSize: "0.85rem",
            fontWeight: "500",
            fontFamily: "var(--font-sans)",
            color: "#E1DBD1",
            opacity: 0.6,
            borderRadius: "8px",
            border: "1px solid transparent"
          }}>
            <LuArchive size={15} style={{ flexShrink: 0, opacity: 0.5 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              German Fab Subsidy Analysis
            </span>
          </div>
        </div>
      </div>

      {/* Footer Controls & System Status */}
      <div 
        style={{ 
          padding: "20px 24px", 
          borderTop: "1px solid rgba(225, 219, 209, 0.1)", 
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: "#2D2E30",
          flexShrink: 0
        }}
      >
        {/* User Identity and Sign Out Icon */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#CF5254",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "0.9rem",
              flexShrink: 0,
              fontFamily: "var(--font-sans)"
            }}>
              {profile?.alias ? profile.alias[0].toUpperCase() : "N"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{ 
                fontSize: "0.85rem", 
                fontWeight: "600", 
                color: "#E1DBD1", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                fontFamily: "var(--font-sans)"
              }}>
                {profile?.firstName || "Nomad"}
              </span>
              <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "#E1DBD1", opacity: 0.5, fontFamily: "var(--font-sans)" }}>
                {profile?.alias ? `@${profile.alias.toLowerCase()}` : "Active Session"}
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#E1DBD1",
              opacity: 0.6,
              transition: "opacity 0.2s, color 0.2s",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#CF5254"; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.color = "#E1DBD1"; }}
          >
            <LuLogOut size={16} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", fontWeight: "500", opacity: 0.7, fontFamily: "var(--font-sans)" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF50", display: "inline-block" }}></span>
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
  setBentoOpen,
  onResetSliders
}) {
  const [activeTab, setActiveTab] = useState("parameters");

  const percentageUsed = profile 
    ? Math.min(100, Math.round((profile.tokensUsed / profile.apiQuota) * 100)) 
    : 0;
  const remainingQuota = profile 
    ? Math.max(0, profile.apiQuota - profile.tokensUsed) 
    : 0;

  // Helper label indicators based on floats
  const getCandorLabel = (val) => {
    if (val < 30) return "Gentle";
    if (val < 70) return "Moderate";
    return "Direct";
  };

  const getEmpathyLabel = (val) => {
    if (val < 30) return "Analytical";
    if (val < 70) return "Moderate";
    return "High Empathy";
  };

  const getHumorLabel = (val) => {
    if (val < 30) return "Serious";
    if (val < 70) return "Dry";
    return "Witty";
  };

  const getFormalityLabel = (val) => {
    if (val < 30) return "Casual";
    if (val < 70) return "Professional";
    return "Academic";
  };

  return (
    <aside 
      style={{
        width: bentoOpen ? "320px" : "0px",
        borderLeft: bentoOpen ? "1px solid rgba(55, 56, 58, 0.2)" : "none",
        background: "rgba(225, 219, 209, 0.5)",
        backdropFilter: "blur(10px)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
        zIndex: 10
      }}
    >
      {bentoOpen && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* Header */}
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(55, 56, 58, 0.1)", flexShrink: 0 }}>
            <LuSlidersHorizontal size={18} style={{ color: "#37383A" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#37383A", fontFamily: "var(--font-serif)" }}>Inspector</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(55, 56, 58, 0.7)", fontFamily: "var(--font-sans)" }}>Real-time Tuning</span>
            </div>
            <button 
              type="button"
              onClick={() => setBentoOpen(false)}
              style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", marginLeft: "auto", color: "#37383A", opacity: 0.6 }}
            >
              ×
            </button>
          </div>

          {/* Sub Navigation Bar inside Right Panel */}
          <nav style={{ display: "flex", gap: "16px", padding: "12px 20px 0", borderBottom: "1px solid rgba(55, 56, 58, 0.08)", fontSize: "0.8rem", fontWeight: "600", flexShrink: 0, fontFamily: "var(--font-sans)" }}>
            <button 
              type="button" 
              onClick={() => setActiveTab("parameters")}
              style={{ 
                background: "none", 
                border: "none", 
                borderBottom: activeTab === "parameters" ? "2px solid #CF5254" : "2px solid transparent", 
                paddingBottom: "8px", 
                color: activeTab === "parameters" ? "#CF5254" : "rgba(55, 56, 58, 0.6)", 
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Parameters
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("context")}
              style={{ 
                background: "none", 
                border: "none", 
                borderBottom: activeTab === "context" ? "2px solid #CF5254" : "2px solid transparent", 
                paddingBottom: "8px", 
                color: activeTab === "context" ? "#CF5254" : "rgba(55, 56, 58, 0.6)", 
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Context
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("identity")}
              style={{ 
                background: "none", 
                border: "none", 
                borderBottom: activeTab === "identity" ? "2px solid #CF5254" : "2px solid transparent", 
                paddingBottom: "8px", 
                color: activeTab === "identity" ? "#CF5254" : "rgba(55, 56, 58, 0.6)", 
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Identity
            </button>
          </nav>

          {/* Scrollable Inspector panel controls */}
          <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {activeTab === "parameters" && (
              <>
                {/* 1. Emotional Matrix parameters section */}
                <section style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(55, 56, 58, 0.15)", borderRadius: "8px", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "16px", color: "#37383A", fontFamily: "var(--font-serif)" }}>
                    Emotional Matrix
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "var(--font-sans)" }}>
                    {/* Candor */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", color: "#37383A", marginBottom: "6px" }}>
                        <span>Candor</span>
                        <span style={{ color: "rgba(55, 56, 58, 0.7)" }}>{getCandorLabel(emotionalAspects.candor)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={emotionalAspects.candor} 
                        onChange={(e) => onSliderChange("candor", e.target.value)}
                      />
                    </div>

                    {/* Empathy */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", color: "#37383A", marginBottom: "6px" }}>
                        <span>Empathy</span>
                        <span style={{ color: "rgba(55, 56, 58, 0.7)" }}>{getEmpathyLabel(emotionalAspects.empathy)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={emotionalAspects.empathy} 
                        onChange={(e) => onSliderChange("empathy", e.target.value)}
                      />
                    </div>

                    {/* Humor */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", color: "#37383A", marginBottom: "6px" }}>
                        <span>Humor</span>
                        <span style={{ color: "rgba(55, 56, 58, 0.7)" }}>{getHumorLabel(emotionalAspects.humor)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={emotionalAspects.humor} 
                        onChange={(e) => onSliderChange("humor", e.target.value)}
                      />
                    </div>

                    {/* Formality */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600", color: "#37383A", marginBottom: "6px" }}>
                        <span>Formality</span>
                        <span style={{ color: "rgba(55, 56, 58, 0.7)" }}>{getFormalityLabel(emotionalAspects.formality)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={emotionalAspects.formality} 
                        onChange={(e) => onSliderChange("formality", e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* 2. RAG Context toggles */}
                <section style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(55, 56, 58, 0.15)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <LuCpu size={16} style={{ color: "#37383A" }} />
                    <h4 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#37383A", fontFamily: "var(--font-serif)" }}>
                      Active Context (RAG)
                    </h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)" }}>
                    {/* Weather Toggle */}
                    <div className="flat-toggle-wrapper" style={{ padding: "8px 0" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "600", color: "#37383A" }}>
                        <LuCloud size={14} style={{ opacity: 0.7 }} /> Weather Data
                      </span>
                      <label className="flat-switch">
                        <input type="checkbox" checked={!!ragToggles.weather} onChange={() => onToggleRag("weather")} />
                        <span className="flat-slider"></span>
                      </label>
                    </div>

                    {/* Sports Toggle */}
                    <div className="flat-toggle-wrapper" style={{ padding: "8px 0" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "600", color: "#37383A" }}>
                        <LuTrophy size={14} style={{ opacity: 0.7 }} /> Sports Standings
                      </span>
                      <label className="flat-switch">
                        <input type="checkbox" checked={!!ragToggles.sports} onChange={() => onToggleRag("sports")} />
                        <span className="flat-slider"></span>
                      </label>
                    </div>

                    {/* Web Scraper news Toggle */}
                    <div className="flat-toggle-wrapper" style={{ borderBottom: "none", padding: "8px 0" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "600", color: "#37383A" }}>
                        <LuGlobe size={14} style={{ opacity: 0.7 }} /> Live Web Scraper
                      </span>
                      <label className="flat-switch">
                        <input type="checkbox" checked={!!ragToggles.scraper} onChange={() => onToggleRag("scraper")} />
                        <span className="flat-slider"></span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Reset Parameter Sliders button */}
                <button 
                  type="button"
                  onClick={onResetSliders}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #37383A",
                    color: "#37383A",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    padding: "10px 16px",
                    borderRadius: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-sans)"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(55,56,58,0.1)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <LuRotateCcw size={14} /> Reset Parameters
                </button>
              </>
            )}

            {activeTab === "context" && profile && (
              <section style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(55, 56, 58, 0.15)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-sans)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#37383A", fontFamily: "var(--font-serif)" }}>Compute Telemetry</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600" }}>
                    <span>Token depletion:</span>
                    <strong>{profile.tokensUsed} / {profile.apiQuota}</strong>
                  </div>
                  <div style={{ background: "rgba(55,56,58,0.1)", height: "6px", width: "100%", position: "relative", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${percentageUsed}%`, background: "#CF5254", height: "100%" }}></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem", marginTop: "4px" }}>
                    <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid rgba(55,56,58,0.15)", borderRadius: "4px" }}>
                      <div>Queries Run</div>
                      <strong style={{ fontSize: "1rem", color: "#CF5254" }}>{profile.computeCallFrequency || 0}</strong>
                    </div>
                    <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid rgba(55,56,58,0.15)", borderRadius: "4px" }}>
                      <div>Remaining</div>
                      <strong style={{ fontSize: "1rem" }}>{remainingQuota}</strong>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "identity" && profile && (
              <section style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(55, 56, 58, 0.15)", borderRadius: "8px", padding: "16px", fontFamily: "var(--font-sans)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "12px", color: "#37383A", fontFamily: "var(--font-serif)" }}>Identity Profile</h4>
                
                {!editingProfile ? (
                  <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div><strong>Name:</strong> {profile.firstName || "Unset"}</div>
                    <div><strong>Alias:</strong> {profile.alias || "Unset"}</div>
                    <div><strong>Age:</strong> {profile.age || "Unset"} ({profile.gender || "Other"})</div>
                    <div style={{ 
                      maxHeight: "100px", 
                      overflowY: "auto", 
                      fontSize: "0.8rem", 
                      opacity: 0.9, 
                      background: "rgba(55,56,58,0.03)", 
                      padding: "10px", 
                      border: "1px solid rgba(55, 56, 58, 0.15)",
                      borderRadius: "4px"
                    }}>
                      <strong>Goal:</strong> {profile.basicInfo || "No declared background goals."}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setEditingProfile(true)} 
                      style={{
                        background: "transparent",
                        border: "1px solid #37383A",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        marginTop: "8px",
                        cursor: "pointer",
                        borderRadius: "20px"
                      }}
                    >
                      Edit Profile details
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onProfileSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input 
                      type="text" 
                      value={profileForm.firstName} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))} 
                      className="flat-input" 
                      style={{ padding: "8px 12px", fontSize: "0.8rem", fontWeight: "500" }} 
                      placeholder="First Name" 
                    />
                    <input 
                      type="text" 
                      value={profileForm.alias} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, alias: e.target.value }))} 
                      className="flat-input" 
                      style={{ padding: "8px 12px", fontSize: "0.8rem", fontWeight: "500" }} 
                      placeholder="Alias" 
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <input 
                        type="number" 
                        value={profileForm.age} 
                        onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))} 
                        className="flat-input" 
                        style={{ padding: "8px 12px", fontSize: "0.8rem", fontWeight: "500" }} 
                        placeholder="Age" 
                      />
                      <select 
                        value={profileForm.gender} 
                        onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))} 
                        className="flat-input" 
                        style={{ padding: "8px 12px", fontSize: "0.8rem", fontWeight: "500", height: "38px" }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <textarea 
                      value={profileForm.basicInfo} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, basicInfo: e.target.value }))} 
                      className="flat-input" 
                      style={{ padding: "8px 12px", fontSize: "0.8rem", fontWeight: "500", minHeight: "60px", resize: "vertical" }} 
                      placeholder="Research goals background" 
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <button 
                        type="submit" 
                        style={{ 
                          padding: "6px 14px", 
                          fontSize: "0.8rem", 
                          fontWeight: "600", 
                          background: "#CF5254", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "14px",
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingProfile(false)} 
                        style={{ 
                          padding: "6px 14px", 
                          fontSize: "0.8rem", 
                          fontWeight: "600", 
                          background: "transparent", 
                          border: "1px solid #37383A", 
                          color: "#37383A", 
                          borderRadius: "14px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

          </div>

        </div>
      )}
    </aside>
  );
}
