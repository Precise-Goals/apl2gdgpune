import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LuMenu, LuChevronLeft, LuChevronRight, LuSparkles, LuBell, LuSun, LuMoon } from "react-icons/lu";
import OnboardingForm from "../components/OnboardingForm";
import { Sidebar, TelemetryPanel } from "../components/agent/Sidebar";
import ChatFeed from "../components/agent/ChatFeed";
import ChatInput from "../components/agent/ChatInput";

export default function AgentDashboard({
  userId,
  profile,
  updateProfile,
  messages,
  chatLoading,
  loadingMore,
  hasMore,
  sending,
  fetchMoreMessages,
  sendMessage,
  ragToggles,
  onToggleRag,
  handleLogout
}) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bentoOpen, setBentoOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isNewChat, setIsNewChat] = useState(false);
  const [activeLogId, setActiveLogId] = useState(null);

  // Mobile layout state management
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Track window resizing for responsive layouts
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    firstName: profile?.firstName || "",
    alias: profile?.alias || "",
    age: profile?.age || "",
    gender: profile?.gender || "Other",
    phone: profile?.phone || "",
    basicInfo: profile?.basicInfo || ""
  });

  // Sync profileForm with incoming database updates
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || "",
        alias: profile.alias || "",
        age: profile.age || "",
        gender: profile.gender || "Other",
        phone: profile.phone || "",
        basicInfo: profile.basicInfo || ""
      });
    }
  }, [profile]);

  // Intercept unonboarded accounts
  const needsOnboarding = userId && !profile?.firstName;
  if (needsOnboarding) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: "60px 20px", background: "var(--bg-paper)", minHeight: "100vh" }}>
        <OnboardingForm 
          userId={userId} 
          userEmail={profile?.email} 
          onComplete={() => updateProfile({ onboardingComplete: true })} 
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
  const activeChar = characters[profile?.characterPreference] || characters.cyberpunk_hacker;

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const queryText = inputText;
    setInputText("");
    setIsNewChat(false); // Reset empty state upon sending a prompt

    // Dispatch directly to custom hook state manager!
    await sendMessage(queryText, emotionalAspects, ragToggles, isNewChat);
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

  const handleSliderChange = (aspect, val) => {
    setEmotionalAspects(prev => ({
      ...prev,
      [aspect]: parseFloat(val)
    }));
  };

  const handleResetSliders = () => {
    setEmotionalAspects({
      candor: 50,
      empathy: 50,
      humor: 50,
      formality: 50
    });
  };

  const handleSelectSuggestion = (text) => {
    setInputText(text);
  };

  const handleNewChatClick = () => {
    setIsNewChat(true);
    setActiveLogId(null);
  };

  const handleHistorySelection = (id) => {
    setIsNewChat(false);
    setActiveLogId(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden", background: "#E1DBD1" }}>
      
      {/* Mobile Top Bar */}
      {!isDesktop && (
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          height: "64px",
          background: "rgba(225, 219, 209, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(55, 56, 58, 0.15)",
          width: "100%",
          boxSizing: "border-box",
          flexShrink: 0,
          zIndex: 40
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#CF5254", fontSize: "1.2rem", display: "flex", fontWeight: "600" }}>✦</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: "600", color: "#37383A" }}>
              Mellow AI
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#37383A",
                padding: "8px"
              }}
            >
              {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
            </button>
            <button 
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#37383A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px"
              }}
            >
              <LuMenu size={24} />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar Overlay Drawer */}
      {!isDesktop && mobileSidebarOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(55, 56, 58, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 999
        }}>
          <div style={{
            width: "280px",
            height: "100%",
            background: "#37383A",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "10px 0 30px rgba(0, 0, 0, 0.3)",
            animation: "slideIn 0.3s ease-out"
          }}>
            {/* Close drawer trigger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "#E1DBD1",
                fontSize: "1.5rem",
                cursor: "pointer",
                zIndex: 20
              }}
            >
              ×
            </button>

            <Sidebar 
              messages={messages}
              onNewChat={() => {
                handleNewChatClick();
                setMobileSidebarOpen(false);
              }}
              onSelectHistory={(id) => {
                handleHistorySelection(id);
                setMobileSidebarOpen(false);
              }}
              activeLogId={activeLogId}
              isNewChat={isNewChat}
              sidebarOpen={true}
              profile={profile}
              handleLogout={handleLogout}
            />
          </div>
          {/* Close drawer when clicking outside the panel */}
          <div 
            style={{ position: "absolute", left: "280px", top: 0, right: 0, bottom: 0 }} 
            onClick={() => setMobileSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Main Immersive Frame */}
      <div style={{ display: "flex", flex: 1, width: "100vw", overflow: "hidden", position: "relative" }}>
        
        {/* Left Sidebar (Desktop Only) */}
        {isDesktop && (
          <Sidebar 
            messages={messages}
            onNewChat={handleNewChatClick}
            onSelectHistory={handleHistorySelection}
            activeLogId={activeLogId}
            isNewChat={isNewChat}
            sidebarOpen={sidebarOpen}
            profile={profile}
            handleLogout={handleLogout}
          />
        )}

        {/* Toggle Left Sidebar Button (Desktop Only) */}
        {isDesktop && (
          <button 
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "absolute",
              left: sidebarOpen ? "265px" : "10px",
              top: "16px",
              zIndex: 30,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
              border: "1px solid #37383A",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              color: "#37383A"
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = "#CF5254"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "#37383A"; }}
          >
            {sidebarOpen ? <LuChevronLeft size={16} /> : <LuChevronRight size={16} />}
          </button>
        )}

        {/* Center Panel (Chat Canvas) */}
        <div 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            background: "#E1DBD1", 
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box"
          }}
        >
          {/* Breadcrumb Global Workspace Header Navbar */}
          {isDesktop && (
            <header style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "0 40px", 
              height: "64px", 
              background: "rgba(225, 219, 209, 0.9)", 
              backdropFilter: "blur(8px)", 
              borderBottom: "1px solid rgba(55, 56, 58, 0.15)",
              flexShrink: 0,
              zIndex: 10
            }}>
              {/* Active Breadcrumbs */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(55,56,58,0.5)", fontFamily: "var(--font-sans)" }}>
                  Workspace Canvas
                </span>
                <span style={{ fontSize: "0.85rem", color: "rgba(55,56,58,0.3)" }}>/</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#CF5254", fontFamily: "var(--font-serif)" }}>
                  {isNewChat ? "New Discovery Node" : "Active Thread"}
                </span>
              </div>

              {/* Visually Distinct Top Navigation Links */}
              <nav style={{ display: "flex", gap: "28px", fontSize: "0.9rem", fontWeight: "600", fontFamily: "var(--font-sans)" }}>
                <Link to="/" style={{ color: "#37383A", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color="#CF5254"} onMouseOut={(e) => e.currentTarget.style.color="#37383A"}>Home</Link>
                <Link to="/docs" style={{ color: "#37383A", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color="#CF5254"} onMouseOut={(e) => e.currentTarget.style.color="#37383A"}>Docs</Link>
                <Link to="/about" style={{ color: "#37383A", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color="#CF5254"} onMouseOut={(e) => e.currentTarget.style.color="#37383A"}>About</Link>
              </nav>

              {/* Right Global Inspector Toggle, Mode switcher, and Notifications */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                
                {/* Light / Dark Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#37383A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    opacity: 0.8,
                    transition: "opacity 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
                >
                  {theme === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
                </button>

                <button 
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#37383A",
                    opacity: 0.6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
                >
                  <LuBell size={18} />
                </button>
                <button 
                  type="button"
                  onClick={() => setBentoOpen(!bentoOpen)}
                  style={{
                    background: "none",
                    border: "1px solid #37383A",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "#37383A",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-sans)"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#37383A"; e.currentTarget.style.color = "#E1DBD1"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#37383A"; }}
                >
                  {bentoOpen ? "Hide Inspector" : "Show Inspector"}
                </button>
              </div>
            </header>
          )}

          {/* Chat scrolling timeline */}
          <div style={{ flex: 1, position: "relative", width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <ChatFeed 
              messages={messages}
              chatLoading={chatLoading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              fetchMoreMessages={fetchMoreMessages}
              sending={sending}
              activeChar={activeChar}
              profile={profile}
              isNewChat={isNewChat}
              onSelectPromptSuggestion={handleSelectSuggestion}
            />
            {/* Height Spacer to prevent overlapping with floating execution bar */}
            <div style={{ height: "100px", flexShrink: 0 }} />
          </div>

          {/* Absolute floating inputs execution bar */}
          <ChatInput 
            inputText={inputText}
            setInputText={setInputText}
            sending={sending}
            activeChar={activeChar}
            handleSend={handleSend}
          />
        </div>

        {/* Toggle Right Properties Button (Desktop Only) */}
        {isDesktop && (
          <button 
            type="button"
            onClick={() => setBentoOpen(!bentoOpen)}
            style={{
              position: "absolute",
              right: bentoOpen ? "305px" : "10px",
              top: "16px",
              zIndex: 30,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
              border: "1px solid #37383A",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              color: "#37383A"
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = "#CF5254"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "#37383A"; }}
          >
            {bentoOpen ? <LuChevronRight size={16} /> : <LuChevronLeft size={16} />}
          </button>
        )}

        {/* Collapsible Figma-style Properties Panel (Desktop Only) */}
        {isDesktop && (
          <TelemetryPanel 
            profile={profile}
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            onProfileSave={handleProfileSave}
            ragToggles={ragToggles}
            onToggleRag={onToggleRag}
            emotionalAspects={emotionalAspects}
            onSliderChange={handleSliderChange}
            bentoOpen={bentoOpen}
            setBentoOpen={setBentoOpen}
            onResetSliders={handleResetSliders}
          />
        )}

      </div>
    </div>
  );
}
