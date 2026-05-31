import { useState, useRef, useEffect } from "react";
import OnboardingForm from "../components/OnboardingForm";

export default function Agent({
  userId,
  profile,
  updateProfile,
  messages,
  chatLoading,
  loadingMore,
  hasMore,
  fetchMoreMessages,
  sendMessage,
  ragToggles,
  onToggleRag
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bentoOpen, setBentoOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  
  // Profile local modification states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || "",
    alias: profile.alias || "",
    age: profile.age || "",
    gender: profile.gender || "Other",
    phone: profile.phone || "",
    email: profile.email || ""
  });

  const chatEndRef = useRef(null);

  // Sync profileForm with incoming database updates
  useEffect(() => {
    setProfileForm({
      firstName: profile.firstName || "",
      alias: profile.alias || "",
      age: profile.age || "",
      gender: profile.gender || "Other",
      phone: profile.phone || "",
      email: profile.email || ""
    });
  }, [profile]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const queryText = inputText;
    setInputText("");
    setSending(true);

    try {
      // 1. Log user prompt in Firestore
      await sendMessage("user", queryText);

      // 2. Query our secure Bun backend proxy (avoids client-side key exposure)
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: queryText }],
          toggles: ragToggles,
          queryText: queryText
        })
      });

      if (!chatRes.ok) throw new Error("Chat routing proxy returned error status.");
      
      const chatData = await chatRes.json();
      const aiReply = chatData.choices?.[0]?.message?.content || "Companion routing network error.";

      // 3. Log agent reply in Firestore
      await sendMessage("assistant", aiReply);
    } catch (err) {
      console.error(err);
      await sendMessage("assistant", "⚠️ Server proxy connection error. Please verify dynamic scraper settings.");
    } finally {
      setSending(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
    } catch {
      alert("Error saving profile details.");
    }
  };

  const handleOnboardingComplete = () => {
    updateProfile({ onboardingComplete: true });
  };

  // 1. Intercept unonboarded accounts
  const needsOnboarding = userId && !profile.firstName;
  if (needsOnboarding) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <OnboardingForm 
          userId={userId} 
          userEmail={profile.email} 
          onComplete={handleOnboardingComplete} 
        />
      </div>
    );
  }

  // AI Character Assets Mapping
  const characters = {
    cyberpunk_hacker: { name: "Cyberpunk Hacker", icon: "⚡", avatar: "🤖", color: "#CF5254" },
    synthwave_samurai: { name: "Synthwave Samurai", icon: "🎸", avatar: "👺", color: "#37383A" },
    solarpunk_mystic: { name: "Solarpunk Mystic", icon: "🌱", avatar: "👽", color: "#10b981" },
    retro_gamer: { name: "Retro Gamer", icon: "🕹️", avatar: "👾", color: "#f59e0b" }
  };
  const activeChar = characters[profile.characterPreference] || characters.cyberpunk_hacker;

  const percentageUsed = Math.min(100, Math.round((profile.tokensUsed / profile.apiQuota) * 100));
  const remainingQuota = Math.max(0, profile.apiQuota - profile.tokensUsed);

  return (
    <div style={{ display: "flex", flex: 1, height: "calc(100vh - 67px)", overflow: "hidden", position: "relative" }}>
      
      {/* =========================================================
         LEFT SIDEBAR: Chat History & Collapsible Trigger
         ========================================================= */}
      <aside style={{
        width: sidebarOpen ? "250px" : "0px",
        borderRight: sidebarOpen ? "1px solid var(--border-charcoal)" : "none",
        background: "var(--sand-light)",
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border-charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>Chat Log History</h4>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {messages.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--text-charcoal)", opacity: 0.6, padding: "10px" }}>
              No chat logs logged in this workspace coordinate.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {messages.filter(m => m.role === "user").slice(-6).map((msg, i) => (
                <div 
                  key={msg.id || i}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(55,56,58,0.04)",
                    border: "1px solid var(--border-charcoal)",
                    fontSize: "0.8rem",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer"
                  }}
                >
                  💬 {msg.content.replace(/\[RAG Ingestion:.*?\]\n/g, "")}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "20px", borderTop: "1px solid var(--border-charcoal)", fontSize: "0.8rem", color: "var(--text-charcoal)", opacity: 0.6 }}>
          Sync status: Active
        </div>
      </aside>

      {/* Toggle Left Sidebar Button */}
      <button 
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute",
          left: sidebarOpen ? "255px" : "10px",
          top: "12px",
          zIndex: 10,
          background: "var(--sand-light)",
          border: "1px solid var(--text-charcoal)",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "left 0.25s ease"
        }}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {/* =========================================================
         CENTER CANVAS: Claude Chat Room
         ========================================================= */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "40px 40px 20px",
        boxSizing: "border-box",
        background: "var(--bg-paper)",
        overflow: "hidden",
        marginLeft: sidebarOpen ? "0px" : "40px",
        marginRight: bentoOpen ? "0px" : "40px"
      }}>
        
        {/* Chat Feed */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "25px", paddingRight: "10px", marginBottom: "20px" }}>
          
          {hasMore && (
            <button 
              type="button"
              onClick={fetchMoreMessages} 
              disabled={loadingMore}
              className="flat-btn"
              style={{ fontSize: "0.8rem", padding: "6px 14px", alignSelf: "center" }}
            >
              {loadingMore ? "Searching older logs..." : "Load Older Logs"}
            </button>
          )}

          {chatLoading ? (
            <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.6 }}>
              <div style={{ fontSize: "1.5rem" }}>✦</div>
              <div style={{ fontSize: "0.85rem" }}>Syncing conversational feed...</div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: "auto", maxWidth: "500px", textAlign: "left" }}>
              <h2 style={{ fontSize: "3rem", fontFamily: "var(--font-serif)", lineHeight: "1.1", marginBottom: "15px" }}>
                How can I assist your discovery journey today?
              </h2>
              <p style={{ fontSize: "1rem", lineHeight: "1.5", opacity: 0.8 }}>
                Activate your Weather, Sports, or Web News scraper filters in the right dashboard panel to dynamically feed context layers directly into your prompt sequences.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    width: "100%"
                  }}
                >
                  <div style={{
                    maxWidth: "75%",
                    textAlign: "left",
                    padding: isUser ? "12px 20px" : "0px",
                    background: isUser ? "var(--accent-coral)" : "transparent",
                    border: "none",
                    borderRadius: isUser ? "20px" : "0px",
                    color: isUser ? "var(--sand-light)" : "var(--text-charcoal)"
                  }}>
                    {/* Role header */}
                    <div style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "700", 
                      color: isUser ? "rgba(255,255,255,0.8)" : "var(--accent-coral)", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em",
                      marginBottom: "6px" 
                    }}>
                      {isUser ? "You" : `Mellow (${activeChar.name})`}
                    </div>
                    {/* Body text */}
                    <div style={{ 
                      fontSize: "1rem", 
                      lineHeight: "1.6", 
                      whiteSpace: "pre-wrap"
                    }}>
                      {msg.content.replace(/\[RAG Ingestion:.*?\]\n/g, "")}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {sending && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-coral)", fontSize: "0.9rem", opacity: 0.8 }}>
                <span>✦</span>
                <span>Scraping real-time context nodes...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Flat Bottom Input Bar */}
        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <input
            type="text"
            className="flat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            placeholder={`Message Mellow (${activeChar.name})...`}
            style={{ flex: 1, border: "1px solid var(--text-charcoal)", padding: "14px 20px" }}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || sending} 
            className="flat-btn flat-btn-primary"
            style={{ padding: "14px 24px", fontSize: "0.95rem" }}
          >
            {sending ? "✦" : "Send"}
          </button>
        </form>

      </main>

      {/* Toggle Right Bento Dashboard Button */}
      <button 
        type="button"
        onClick={() => setBentoOpen(!bentoOpen)}
        style={{
          position: "absolute",
          right: bentoOpen ? "355px" : "10px",
          top: "12px",
          zIndex: 10,
          background: "var(--sand-light)",
          border: "1px solid var(--text-charcoal)",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "right 0.25s ease"
        }}
      >
        {bentoOpen ? "▶" : "◀"}
      </button>

      {/* =========================================================
         RIGHT PANEL: Typographic Bento Grid Dashboard (1px Flat borders)
         ========================================================= */}
      <aside style={{
        width: bentoOpen ? "350px" : "0px",
        borderLeft: bentoOpen ? "1px solid var(--border-charcoal)" : "none",
        background: "var(--sand-light)",
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        {bentoOpen && (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Title */}
            <div style={{ textAlign: "left", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "12px" }}>
              <div className="skewed-tag" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>CONTROL MATRIX</div>
              <h3 style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)" }}>Compute & Profile</h3>
            </div>

            {/* Bento Grid Module A: Biometric Profile Form */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "16px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)", marginBottom: "8px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Biometric Identity
              </h4>
              
              {!editingProfile ? (
                <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div><strong>Name:</strong> {profile.firstName || "Unset"}</div>
                  <div><strong>Alias:</strong> {profile.alias || "Unset"}</div>
                  <div><strong>Age:</strong> {profile.age || "Unset"} ({profile.gender})</div>
                  <div><strong>Phone:</strong> {profile.phone || "Unset"}</div>
                  <button 
                    type="button" 
                    onClick={() => setEditingProfile(true)} 
                    className="flat-btn" 
                    style={{ width: "100%", padding: "6px 12px", fontSize: "0.75rem", marginTop: "10px" }}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                  <input type="tel" name="phone" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="flat-input" style={{ padding: "6px 10px", fontSize: "0.8rem" }} placeholder="Phone" />
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <button type="submit" className="flat-btn" style={{ padding: "5px 10px", fontSize: "0.75rem", background: "var(--accent-coral)", color: "white", border: "1px solid var(--accent-coral)" }}>Save</button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="flat-btn" style={{ padding: "5px 10px", fontSize: "0.75rem" }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Bento Grid Module B: AI Companion Info */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--sand-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem"
              }}>
                {activeChar.avatar}
              </div>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)" }}>Active Companion</h4>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "2px" }}>{activeChar.name}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>RAG System Prefix Active</div>
              </div>
            </div>

            {/* Bento Grid Module C: Compute & API Quota Telemetry Monitor */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "16px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)", marginBottom: "8px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Compute Telemetry
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                <span>Token Depletion:</span>
                <strong>{profile.tokensUsed} / {profile.apiQuota}</strong>
              </div>
              <div style={{ background: "var(--sand-dark)", height: "6px", width: "100%", position: "relative", marginBottom: "12px" }}>
                <div style={{ width: `${percentageUsed}%`, background: "var(--accent-coral)", height: "100%", transition: "width 0.3s ease" }}></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem" }}>
                <div style={{ background: "rgba(55,56,58,0.05)", padding: "6px", border: "1px solid var(--border-charcoal)" }}>
                  <div>Queries Run</div>
                  <strong style={{ fontSize: "1rem" }}>{profile.computeCallFrequency}</strong>
                </div>
                <div style={{ background: "rgba(55,56,58,0.05)", padding: "6px", border: "1px solid var(--border-charcoal)" }}>
                  <div>Remaining</div>
                  <strong style={{ fontSize: "1rem" }}>{remainingQuota}</strong>
                </div>
              </div>
            </div>

            {/* RAG Scraper Filters */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "16px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)", marginBottom: "12px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Scraper Filters
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                
                {/* Weather */}
                <div className="flat-toggle-wrapper">
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>☁️ Weather Stream</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.weather} onChange={() => onToggleRag("weather")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* Sports */}
                <div className="flat-toggle-wrapper">
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>🏆 Sports Stands</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.sports} onChange={() => onToggleRag("sports")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* News Web Scraper */}
                <div className="flat-toggle-wrapper" style={{ borderBottom: "none" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>🔍 Web Scraper</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.scraper} onChange={() => onToggleRag("scraper")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

              </div>
            </div>

          </div>
        )}
      </aside>

    </div>
  );
}
