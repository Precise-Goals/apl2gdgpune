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

  // Emotional Aspect Parameters States (Default 50%)
  const [emotionalAspects, setEmotionalAspects] = useState({
    candor: 50,
    empathy: 50,
    humor: 50,
    formality: 50
  });
  
  // Profile local modification states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || "",
    alias: profile.alias || "",
    age: profile.age || "",
    gender: profile.gender || "Other",
    phone: profile.phone || "",
    basicInfo: profile.basicInfo || ""
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
      basicInfo: profile.basicInfo || ""
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

      // 2. Query our Vercel Serverless Function proxy, passing profile and emotional sliders
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })), 
            { role: "user", content: queryText }
          ],
          userProfile: profile, // Includes basicInfo background grounding
          emotionalAspects: emotionalAspects, // Live dynamic parameters
          toggles: ragToggles,
          queryText: queryText
        })
      });

      if (!chatRes.ok) throw new Error("Vercel Serverless routing returned error status.");
      
      const chatData = await chatRes.json();
      const aiReply = chatData.choices?.[0]?.message?.content || "Companion routing network error.";
      const fetchedSources = chatData.sources || [];

      // 3. Log agent reply in Firestore alongside real scraped sources (Perplexity-style!)
      await sendMessage("assistant", aiReply, fetchedSources);
    } catch (err) {
      console.error(err);
      await sendMessage("assistant", "⚠️ Server proxy connection error. Please verify dynamic scraper settings.", []);
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

  const handleSliderChange = (aspect, val) => {
    setEmotionalAspects(prev => ({
      ...prev,
      [aspect]: parseInt(val)
    }));
  };

  // 1. Intercept unonboarded accounts
  const needsOnboarding = userId && !profile.firstName;
  if (needsOnboarding) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
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
    cyberpunk_hacker: { name: "Cyberpunk Hacker", icon: "⚡", avatar: "🤖" },
    synthwave_samurai: { name: "Synthwave Samurai", icon: "🎸", avatar: "👺" },
    solarpunk_mystic: { name: "Solarpunk Mystic", icon: "🌱", avatar: "👽" },
    retro_gamer: { name: "Retro Gamer", icon: "🕹️", avatar: "👾" }
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
        width: sidebarOpen ? "260px" : "0px",
        borderRight: sidebarOpen ? "1px solid var(--border-charcoal)" : "none",
        background: "var(--sand-light)",
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Chat Logs</h4>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {messages.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-charcoal)", opacity: 0.6, padding: "10px" }}>
              No previous telemetry sessions logged.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.filter(m => m.role === "user").slice(-8).map((msg, i) => (
                <div 
                  key={msg.id || i}
                  style={{
                    padding: "12px 14px",
                    background: "rgba(55,56,58,0.03)",
                    border: "1px solid var(--border-charcoal)",
                    fontSize: "0.85rem",
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
        <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-charcoal)", fontSize: "0.85rem", color: "var(--text-charcoal)", opacity: 0.6 }}>
          Node Status: Operational
        </div>
      </aside>

      {/* Toggle Left Sidebar Button */}
      <button 
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute",
          left: sidebarOpen ? "265px" : "10px",
          top: "12px",
          zIndex: 10,
          background: "var(--sand-light)",
          border: "1px solid var(--text-charcoal)",
          borderRadius: "4px",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "0.9rem",
          transition: "left 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {/* =========================================================
         CENTER CANVAS: Claude-inspired spacious chat canvas
         ========================================================= */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "45px 50px 30px",
        boxSizing: "border-box",
        background: "var(--bg-paper)",
        overflow: "hidden",
        marginLeft: sidebarOpen ? "0px" : "40px",
        marginRight: bentoOpen ? "0px" : "40px"
      }}>
        
        {/* Chat Feed */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "30px", paddingRight: "15px", marginBottom: "25px" }}>
          
          {hasMore && (
            <button 
              type="button"
              onClick={fetchMoreMessages} 
              disabled={loadingMore}
              className="flat-btn"
              style={{ fontSize: "0.85rem", padding: "8px 18px", alignSelf: "center" }}
            >
              {loadingMore ? "Seeking older sessions..." : "Load Prior Discoveries"}
            </button>
          )}

          {chatLoading ? (
            <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: 0.6 }}>
              <div style={{ fontSize: "1.8rem" }}>✦</div>
              <div style={{ fontSize: "0.9rem" }}>Aligning RAG channels...</div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: "auto", maxWidth: "600px", textAlign: "left" }}>
              <h2 style={{ fontSize: "3.4rem", fontFamily: "var(--font-serif)", lineHeight: "1.15", marginBottom: "20px" }}>
                What shall we discover together today, {profile.alias || "Nomad"}?
              </h2>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.65", opacity: 0.85 }}>
                Your research background **"{profile.basicInfo || 'Technical goals'}"** is securely ground. Toggle Meteorological or Athletic scraper widgets on the right, scale the AI's Empathy or Candor aspect sliders, and let's synthesize insights!
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
                    maxWidth: "80%",
                    textAlign: "left",
                    padding: isUser ? "16px 24px" : "0px",
                    background: isUser ? "var(--accent-coral)" : "transparent",
                    borderRadius: isUser ? "18px" : "0px",
                    color: isUser ? "var(--sand-light)" : "var(--text-charcoal)"
                  }}>
                    {/* Role header */}
                    <div style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "700", 
                      color: isUser ? "rgba(255,255,255,0.85)" : "var(--accent-coral)", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.08em",
                      marginBottom: "8px" 
                    }}>
                      {isUser ? "You" : `Mellow (${activeChar.name})`}
                    </div>

                    {/* Perplexity-style dynamic RAG sources visualizer card grid */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="perplexity-sources-grid">
                        {msg.sources.map((src, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="perplexity-source-card"
                            style={{ textDecoration: "none" }}
                          >
                            <div style={{ fontWeight: "700", color: "var(--accent-coral)", marginBottom: "4px" }}>
                              ✦ {src.title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-charcoal)", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {src.snippet}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Chat Bubble Core Text Content */}
                    <div style={{ 
                      fontSize: "1.05rem", 
                      lineHeight: "1.65", 
                      whiteSpace: "pre-wrap",
                      letterSpacing: "0.01em"
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {sending && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-coral)", fontSize: "0.95rem", fontWeight: "600" }}>
                <span style={{ fontSize: "1.1rem" }}>✦</span>
                <span>Performing Perplexity-style RAG scrapes...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Flat Bottom Input Canvas */}
        <form onSubmit={handleSend} style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
          <input
            type="text"
            className="flat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            placeholder={`Instruct Mellow (${activeChar.name})...`}
            style={{ flex: 1, border: "1px solid var(--text-charcoal)", padding: "16px 22px", fontSize: "1rem" }}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || sending} 
            className="flat-btn flat-btn-primary"
            style={{ padding: "16px 28px", fontSize: "1rem" }}
          >
            {sending ? "✦" : "Transmit"}
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
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "0.9rem",
          transition: "right 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {bentoOpen ? "▶" : "◀"}
      </button>

      {/* =========================================================
         RIGHT PANEL: Realigned Typographic Bento Grid Control matrix
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
          <div style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Title Block */}
            <div style={{ textAlign: "left", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "14px" }}>
              <div style={{ background: "var(--accent-coral)", color: "white", display: "inline-block", padding: "3px 8px", fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                TELEMETRY COMMAND
              </div>
              <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)" }}>Compute & Sliders</h3>
            </div>

            {/* Bento Module: Emotional Aspect Sliders */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "20px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)", marginBottom: "14px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "8px" }}>
                Emotional Parameters
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                
                {/* Empathy */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>Empathy</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.empathy}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.empathy} 
                    onChange={(e) => handleSliderChange("empathy", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)" }}
                  />
                </div>

                {/* Candor */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>Candor (Directness)</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.candor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.candor} 
                    onChange={(e) => handleSliderChange("candor", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)" }}
                  />
                </div>

                {/* Humor */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>Humor</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.humor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.humor} 
                    onChange={(e) => handleSliderChange("humor", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)" }}
                  />
                </div>

                {/* Formality */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>Formality</span>
                    <span style={{ color: "var(--accent-coral)" }}>{emotionalAspects.formality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={emotionalAspects.formality} 
                    onChange={(e) => handleSliderChange("formality", e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent-coral)" }}
                  />
                </div>

              </div>
            </div>

            {/* Bento Module: User Biometric Profile (RTDB) */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "18px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)", marginBottom: "10px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Identity Profile
              </h4>
              
              {!editingProfile ? (
                <div style={{ fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div><strong>Name:</strong> {profile.firstName || "Unset"}</div>
                  <div><strong>Alias:</strong> {profile.alias || "Unset"}</div>
                  <div><strong>Age:</strong> {profile.age || "Unset"} ({profile.gender})</div>
                  <div style={{ maxHeight: "70px", overflowY: "auto", fontSize: "0.8rem", opacity: 0.8, background: "rgba(55,56,58,0.03)", padding: "6px", border: "1px solid var(--border-charcoal)" }}>
                    <strong>Goal:</strong> {profile.basicInfo || "No declared background goals."}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditingProfile(true)} 
                    className="flat-btn" 
                    style={{ width: "100%", padding: "8px 14px", fontSize: "0.8rem", marginTop: "8px" }}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="text" name="firstName" value={profileForm.firstName} onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))} className="flat-input" style={{ padding: "8px 12px", fontSize: "0.85rem" }} placeholder="First Name" />
                  <input type="text" name="alias" value={profileForm.alias} onChange={(e) => setProfileForm(prev => ({ ...prev, alias: e.target.value }))} className="flat-input" style={{ padding: "8px 12px", fontSize: "0.85rem" }} placeholder="Alias" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <input type="number" name="age" value={profileForm.age} onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))} className="flat-input" style={{ padding: "8px 12px", fontSize: "0.85rem" }} placeholder="Age" />
                    <select name="gender" value={profileForm.gender} onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))} className="flat-input" style={{ padding: "8px 12px", fontSize: "0.85rem", height: "34px" }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <textarea name="basicInfo" value={profileForm.basicInfo} onChange={(e) => setProfileForm(prev => ({ ...prev, basicInfo: e.target.value }))} className="flat-input" style={{ padding: "8px 12px", fontSize: "0.85rem", resize: "vertical" }} placeholder="Goals background" />
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <button type="submit" className="flat-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", background: "var(--accent-coral)", color: "white", border: "1px solid var(--accent-coral)" }}>Save</button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="flat-btn" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Bento Module: Compute Call Telemetry */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "18px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)", marginBottom: "10px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Compute Telemetry
              </h4>
              <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                <span>Token Depletion:</span>
                <strong>{profile.tokensUsed} / {profile.apiQuota}</strong>
              </div>
              <div style={{ background: "var(--sand-dark)", height: "6px", width: "100%", position: "relative", marginBottom: "14px" }}>
                <div style={{ width: `${percentageUsed}%`, background: "var(--accent-coral)", height: "100%", transition: "width 0.3s ease" }}></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem" }}>
                <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid var(--border-charcoal)" }}>
                  <div>Queries Run</div>
                  <strong style={{ fontSize: "1.1rem" }}>{profile.computeCallFrequency}</strong>
                </div>
                <div style={{ background: "rgba(55,56,58,0.03)", padding: "8px", border: "1px solid var(--border-charcoal)" }}>
                  <div>Remaining</div>
                  <strong style={{ fontSize: "1.1rem" }}>{remainingQuota}</strong>
                </div>
              </div>
            </div>

            {/* Bento Module: Scraper Filters */}
            <div style={{ border: "1px solid var(--border-solid)", padding: "18px", textAlign: "left" }}>
              <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)", marginBottom: "12px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "6px" }}>
                Scraper Filters
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                
                {/* Weather */}
                <div className="flat-toggle-wrapper">
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>☁️ Weather Stream</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.weather} onChange={() => onToggleRag("weather")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* Sports */}
                <div className="flat-toggle-wrapper">
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>🏆 Sports Standings</span>
                  <label className="flat-switch">
                    <input type="checkbox" checked={!!ragToggles.sports} onChange={() => onToggleRag("sports")} />
                    <span className="flat-slider"></span>
                  </label>
                </div>

                {/* News Web Scraper */}
                <div className="flat-toggle-wrapper" style={{ borderBottom: "none" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>🔍 Web News Scraper</span>
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
