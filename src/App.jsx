import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from "react-router-dom";
import { useWeb3Auth } from "./hooks/useWeb3Auth";
import { useBentoProfile } from "./hooks/useBentoProfile";
import { useMellowChat } from "./hooks/useMellowChat";
import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";

// Page Components
import Home from "./pages/Home";
import Agent from "./pages/Agent";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";

export default function App() {
  const { 
    account: web3Account, 
    loading: web3Loading, 
    error: web3Error, 
    connectWallet, 
    disconnectWallet 
  } = useWeb3Auth();

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAdminBypass, setIsAdminBypass] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication Popup Overlay States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState(null);

  // RAG Scraper State Toggles
  const [ragToggles, setRagToggles] = useState({
    weather: false,
    sports: false,
    scraper: false
  });

  useEffect(() => {
    const adminSession = localStorage.getItem("mellow_admin_session");
    if (adminSession === "true") {
      setIsAdminBypass(true);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute active user sessions
  let activeUid = null;
  let activeEmail = null;

  if (isAdminBypass) {
    activeUid = "admin_evaluator_bypass";
    activeEmail = "test@admin.com";
  } else if (firebaseUser) {
    activeUid = firebaseUser.uid;
    activeEmail = firebaseUser.email;
  } else if (web3Account) {
    activeUid = `web3_wallet_${web3Account.toLowerCase()}`;
    activeEmail = `${web3Account.substring(0, 6)}...${web3Account.substring(38)}@metamask.eth`;
  }

  // Bind Realtime DB profiles
  const { 
    profile, 
    loading: profileLoading, 
    updateProfileFields, 
    logComputeUsage 
  } = useBentoProfile(activeUid);

  // Bind Firestore Chat Logs
  const { 
    messages, 
    loading: chatLoading, 
    loadingMore, 
    hasMore, 
    fetchMoreMessages, 
    appendMessage 
  } = useMellowChat(activeUid);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (emailInput === "test@admin.com" && passwordInput === "testadmin") {
      localStorage.setItem("mellow_admin_session", "true");
      setIsAdminBypass(true);
      setShowAuthModal(false);
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      } else {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err.message.replace("Firebase:", ""));
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (err) {
      setAuthError("Google Login Interrupted.");
    }
  };

  const handleLogout = async () => {
    try {
      if (isAdminBypass) {
        localStorage.removeItem("mellow_admin_session");
        setIsAdminBypass(false);
      } else if (web3Account) {
        disconnectWallet();
      } else {
        await signOut(auth);
      }
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (role, content) => {
    const savedMsg = await appendMessage(role, content, profile.characterPreference);
    if (role === "user") {
      const tokensConsumpted = Math.floor(Math.random() * 45) + 30;
      await logComputeUsage(tokensConsumpted);
    }
    return savedMsg;
  };

  const handleToggleRag = (toggleKey) => {
    setRagToggles(prev => ({
      ...prev,
      [toggleKey]: !prev[toggleKey]
    }));
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#E1DBD1" }}>
        <div style={{ fontSize: "2rem", color: "#37383A", animation: "spin 2s linear infinite" }}>✦</div>
        <h2 style={{ marginTop: "15px", fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Synchronizing Portal Matrix...</h2>
      </div>
    );
  }

  // Authenticated State check helper
  const isAuthenticated = !!activeUid;

  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* Dynamic Claude-style header */}
        <header className="header-nav">
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            
            {/* Top-Left: Get Started link if logged out, Profile Icon if logged in */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!isAuthenticated ? (
                <button 
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setShowAuthModal(true);
                  }}
                  className="flat-btn"
                  style={{ border: "1px solid var(--accent-coral)", color: "var(--accent-coral)", padding: "6px 14px", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}
                >
                  Get Started ✦
                </button>
              ) : (
                <Link to="/agent" title={`Active Profile: ${profile.alias || 'Nomad'}`}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1px solid var(--text-charcoal)",
                    background: "var(--sand-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    cursor: "pointer"
                  }}>
                    {profile.characterPreference === "cyberpunk_hacker" ? "🤖" :
                     profile.characterPreference === "synthwave_samurai" ? "👺" :
                     profile.characterPreference === "solarpunk_mystic" ? "👽" :
                     profile.characterPreference === "retro_gamer" ? "👾" : "👤"}
                  </div>
                </Link>
              )}
            </div>

            {/* Logo Signature */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
              <span style={{ color: "var(--accent-coral)", fontSize: "1.4rem" }}>✦</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: "500", color: "var(--text-charcoal)", letterSpacing: "-0.02em" }}>Mellow</span>
            </Link>
          </div>

          {/* Clean Flat Navigation list */}
          <nav style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
            {isAuthenticated && (
              <NavLink to="/agent" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Agent workspace</NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
            <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Docs</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>
            
            {isAuthenticated && (
              <button 
                type="button"
                onClick={handleLogout} 
                className="flat-btn" 
                style={{ padding: "5px 12px", fontSize: "0.75rem", textTransform: "uppercase", marginLeft: "10px" }}
              >
                Sign Out
              </button>
            )}
          </nav>
        </header>

        {/* Unified SPA Page Routing Matrix */}
        <div className="main-routed-view">
          <Routes>
            <Route path="/" element={
              <Home 
                isAuthenticated={isAuthenticated} 
                onOpenAuth={() => setShowAuthModal(true)} 
              />
            } />
            <Route path="/agent" element={
              isAuthenticated ? (
                <Agent 
                  userId={activeUid}
                  profile={profile}
                  updateProfile={updateProfileFields}
                  messages={messages}
                  chatLoading={chatLoading}
                  loadingMore={loadingMore}
                  hasMore={hasMore}
                  fetchMoreMessages={fetchMoreMessages}
                  sendMessage={handleSendMessage}
                  ragToggles={ragToggles}
                  onToggleRag={handleToggleRag}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            <Route path="/about" element={<About />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Minimalist Footer */}
        <footer style={{ padding: "20px 40px", borderTop: "1px solid var(--border-charcoal)", background: "var(--bg-paper)", fontSize: "0.8rem", color: "var(--text-charcoal)", textAlign: "center", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span>© 2026 Mellow Conversational Engine. Made by Team Falcons May 2026.</span>
          <span style={{ opacity: 0.6 }}>High-Fidelity RAG-Optimized Research System</span>
        </footer>

        {/* =========================================================
           Unified Flat Authentication Popup (Claude Aesthetic modal)
           ========================================================= */}
        {showAuthModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(55, 56, 58, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}>
            <div className="flat-card" style={{ maxWidth: "420px", width: "100%", padding: "40px 30px", position: "relative" }}>
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setShowAuthModal(false)}
                style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-charcoal)" }}
              >
                ×
              </button>

              <div style={{ display: "flex", justifyContent: "center", gap: "6px", color: "var(--accent-coral)", fontSize: "1.5rem", marginBottom: "10px" }}>
                <span>✦</span>
              </div>
              <h2 style={{ fontSize: "2rem", marginBottom: "8px", textAlign: "center" }}>Join the Mellow Node</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-charcoal)", opacity: 0.8, marginBottom: "25px", textAlign: "center" }}>
                Select an authentication gateway to open your workspace.
              </p>

              {authError && (
                <div style={{ border: "1px solid var(--accent-coral)", padding: "10px", color: "var(--accent-coral)", fontSize: "0.8rem", marginBottom: "15px", borderRadius: "2px" }}>
                  {authError}
                </div>
              )}

              {web3Error && (
                <div style={{ border: "1px solid var(--accent-coral)", padding: "10px", color: "var(--accent-coral)", fontSize: "0.8rem", marginBottom: "15px", borderRadius: "2px" }}>
                  {web3Error}
                </div>
              )}

              {/* Web3 MetaMask connect */}
              <button 
                type="button"
                onClick={async () => {
                  try {
                    await connectWallet();
                    setShowAuthModal(false);
                  } catch {}
                }} 
                disabled={web3Loading}
                className="flat-btn flat-btn-primary" 
                style={{ width: "100%", justifyContent: "center", marginBottom: "12px", background: "#E89B4A", border: "1px solid #E89B4A" }}
              >
                {web3Loading ? "Executing Challenge..." : "Connect MetaMask Wallet 🦊"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "15px 0", color: "var(--text-charcoal)", opacity: 0.6, fontSize: "0.8rem" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border-charcoal)" }}></div>
                <span>OR</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-charcoal)" }}></div>
              </div>

              {/* Web2 Form access */}
              <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input 
                  type="email" 
                  className="flat-input" 
                  placeholder="Email account or test@admin.com" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  className="flat-input" 
                  placeholder="Password or testadmin" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required 
                />
                <button type="submit" className="flat-btn flat-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "5px" }}>
                  {isRegistering ? "Register Account" : "Access Workspace"}
                </button>
              </form>

              {/* Google popup auth */}
              <button 
                type="button"
                onClick={handleGoogleLogin} 
                className="flat-btn" 
                style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}
              >
                Sign in with Google 🌐
              </button>

              <div style={{ marginTop: "20px", fontSize: "0.8rem", textAlign: "center" }}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(!isRegistering);
                  }}
                  style={{ color: "var(--accent-coral)" }}
                >
                  {isRegistering ? "Already have an account? Sign In" : "Need Web2 credentials? Register here"}
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </BrowserRouter>
  );
}
