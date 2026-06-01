import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ isAuthenticated, profile, handleLogout, onOpenAuth }) {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Avatar selector mapping
  const getAvatar = () => {
    if (!profile) return "👤";
    switch (profile.characterPreference) {
      case "cyberpunk_hacker":
        return "🤖";
      case "synthwave_samurai":
        return "👺";
      case "solarpunk_mystic":
        return "👽";
      case "retro_gamer":
        return "👾";
      default:
        return "👤";
    }
  };

  const getCharacterName = () => {
    if (!profile) return "Default Node";
    switch (profile.characterPreference) {
      case "cyberpunk_hacker":
        return "Cyberpunk Hacker";
      case "synthwave_samurai":
        return "Synthwave Samurai";
      case "solarpunk_mystic":
        return "Solarpunk Mystic";
      case "retro_gamer":
        return "Retro Gamer";
      default:
        return "Mellow Companion";
    }
  };

  return (
    <header className="header-nav" style={{ position: "relative", zIndex: 100 }}>
      {/* Left: Brand & Auth Trigger */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        
        {/* Profile Avatar / Trigger or Get Started Link */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!isAuthenticated ? (
            <button 
              type="button"
              onClick={onOpenAuth}
              className="flat-btn"
              style={{ 
                border: "1px solid var(--accent-coral)", 
                color: "var(--accent-coral)", 
                padding: "6px 14px", 
                fontSize: "0.8rem", 
                textTransform: "uppercase", 
                fontWeight: "600",
                borderRadius: "24px"
              }}
            >
              Get Started ✦
            </button>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Active Profile Circle */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={`Active Profile: ${profile?.alias || "Nomad"}`}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid var(--border-solid)",
                  background: "var(--sand-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: 0,
                  outline: "none",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {getAvatar()}
              </button>

              {/* Polished Dropdown Avatar Menu */}
              {dropdownOpen && (
                <>
                  {/* Invisible overlay to close on click outside */}
                  <div 
                    style={{ position: "fixed", inset: 0, zIndex: 998 }} 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div 
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "42px",
                      width: "260px",
                      background: "var(--sand-light)",
                      border: "1px solid var(--border-solid)",
                      boxShadow: "0 10px 30px var(--shadow-color)",
                      zIndex: 999,
                      padding: "16px",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      animation: "fadeIn 0.15s ease-out"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-coral)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Active Profile
                      </div>
                      <div style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)", fontWeight: "600", color: "var(--text-charcoal)" }}>
                        {profile?.firstName || "Nomad"} {profile?.alias ? `"${profile.alias}"` : ""}
                      </div>
                      {profile?.email && (
                        <div style={{ fontSize: "0.75rem", opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {profile.email}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-charcoal)", paddingTop: "10px" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", opacity: 0.6, marginBottom: "4px" }}>
                        Companion Route
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{getAvatar()}</span>
                        <span>{getCharacterName()}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-charcoal)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link 
                        to="/agent" 
                        onClick={() => setDropdownOpen(false)}
                        className="flat-btn" 
                        style={{ padding: "6px 12px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box", justifyContent: "center" }}
                      >
                        Enter Workspace
                      </Link>
                      <button 
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }} 
                        className="flat-btn flat-btn-primary" 
                        style={{ padding: "6px 12px", fontSize: "0.8rem", width: "100%", justifyContent: "center" }}
                      >
                        Sign Out ✦
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Brand Logo Link */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
          <span style={{ color: "var(--accent-coral)", fontSize: "1.4rem" }}>✦</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: "500", color: "var(--text-charcoal)" }}>Mellow</span>
        </Link>
      </div>

      {/* Right: Navigation & Theme Toggle */}
      <nav style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
        {isAuthenticated && (
          <NavLink to="/agent" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Agent workspace</NavLink>
        )}
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
        <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Docs</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>

        {/* Premium Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "light" ? "Activate Dark System" : "Activate Sand System"}
          style={{
            background: "none",
            border: "1px solid var(--border-charcoal)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "var(--text-charcoal)",
            marginLeft: "5px",
            outline: "none",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-coral)";
            e.currentTarget.style.color = "var(--accent-coral)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border-charcoal)";
            e.currentTarget.style.color = "var(--text-charcoal)";
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>
    </header>
  );
}
