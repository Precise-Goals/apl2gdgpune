import { useState, useEffect } from "react";
import OnboardingForm from "../components/OnboardingForm";
import Navbar from "../components/layout/Navbar";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bentoOpen, setBentoOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isNewChat, setIsNewChat] = useState(false);
  const [activeLogId, setActiveLogId] = useState(null);

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
      [aspect]: parseInt(val)
    }));
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--bg-paper)" }}>
      {/* Top Navbar */}
      <Navbar 
        isAuthenticated={true} 
        profile={profile} 
        handleLogout={handleLogout} 
      />

      {/* Main Workspace Frame */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 67px)", overflow: "hidden", position: "relative" }}>
        
        {/* Left Sidebar */}
        <Sidebar 
          messages={messages}
          onNewChat={handleNewChatClick}
          onSelectHistory={handleHistorySelection}
          activeLogId={activeLogId}
          isNewChat={isNewChat}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          bentoOpen={bentoOpen}
          setBentoOpen={setBentoOpen}
        />

        {/* Toggle Left Sidebar Button */}
        <button 
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "absolute",
            left: sidebarOpen ? "285px" : "10px",
            top: "12px",
            zIndex: 90,
            background: "var(--sand-light)",
            border: "1px solid var(--border-solid)",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px var(--shadow-color)"
          }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* Center Panel (Chat Canvas) */}
        <div 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            background: "var(--bg-paper)", 
            overflow: "hidden",
            transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
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
          <ChatInput 
            inputText={inputText}
            setInputText={setInputText}
            sending={sending}
            activeChar={activeChar}
            handleSend={handleSend}
          />
        </div>

        {/* Toggle Right Properties Button */}
        <button 
          type="button"
          onClick={() => setBentoOpen(!bentoOpen)}
          style={{
            position: "absolute",
            right: bentoOpen ? "355px" : "10px",
            top: "12px",
            zIndex: 90,
            background: "var(--sand-light)",
            border: "1px solid var(--border-solid)",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px var(--shadow-color)"
          }}
        >
          {bentoOpen ? "▶" : "◀"}
        </button>

        {/* Collapsible Figma-style Properties Panel */}
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
        />

      </div>
    </div>
  );
}
