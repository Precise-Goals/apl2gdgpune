import { useRef, useEffect } from "react";
import { 
  LuGlobe, 
  LuCpu, 
  LuSlidersHorizontal, 
  LuCloud, 
  LuTrophy, 
  LuUser,
  LuSparkles
} from "react-icons/lu";

export default function ChatFeed({
  messages,
  chatLoading,
  loadingMore,
  hasMore,
  fetchMoreMessages,
  sending,
  activeChar,
  profile,
  isNewChat,
  onSelectPromptSuggestion
}) {
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  // Suggested Prompts to show in empty state
  const suggestions = [
    { text: "Analyze real-time market data...", label: "Market Scrape", icon: <LuCpu size={14} /> },
    { text: "Draft an analytical summary of global SaaS patterns...", label: "SaaS Trends", icon: <LuSlidersHorizontal size={14} /> },
    { text: "Summarize today's climate-tech VC funding stabilization...", label: "VC Insights", icon: <LuGlobe size={14} /> },
    { text: "Deconstruct subsidized semiconductor facility trends in Germany...", label: "Hardware Fab", icon: <LuSparkles size={14} /> }
  ];

  // Auto-scroll chat feed container to the bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, isNewChat]);

  // Determine if we should render empty state suggestion chips
  const showEmptyState = isNewChat || messages.length === 0;
  const chatMessages = showEmptyState ? [] : messages;

  return (
    <div 
      ref={containerRef}
      className="chat-scroll"
      style={{ 
        flex: 1, 
        overflowY: "auto", 
        display: "flex", 
        flexDirection: "column", 
        padding: "30px 40px", 
        boxSizing: "border-box",
        width: "100%",
        height: "100%"
      }}
    >
      {/* Infinite Scroll / Load Prior Discoveries */}
      {!showEmptyState && hasMore && (
        <button 
          type="button"
          onClick={fetchMoreMessages} 
          disabled={loadingMore}
          style={{ 
            fontSize: "0.8rem", 
            padding: "8px 16px", 
            alignSelf: "center", 
            marginBottom: "20px",
            borderRadius: "20px",
            border: "1px solid #37383A",
            background: "transparent",
            color: "#37383A",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {loadingMore ? "Seeking older sessions..." : "Load Prior Discoveries ✦"}
        </button>
      )}

      {chatLoading ? (
        <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: 0.6 }}>
          <div style={{ fontSize: "1.8rem", animation: "spin 2s linear infinite", color: "#CF5254" }}>✦</div>
          <div style={{ fontSize: "1rem", fontWeight: "600" }}>Aligning RAG channels...</div>
        </div>
      ) : showEmptyState ? (
        /* Empty State with Centered Suggestion Chips */
        <div style={{ margin: "auto", maxWidth: "680px", width: "100%", textAlign: "left", animation: "fadeIn 0.3s ease-out" }}>
          <h2 style={{ 
            fontSize: "3rem", 
            fontFamily: "var(--font-serif)", 
            lineHeight: "1.2", 
            marginBottom: "16px",
            color: "#37383A"
          }}>
            What shall we discover together, {profile?.alias || "Nomad"}?
          </h2>
          <p style={{ 
            fontSize: "1.1rem", 
            lineHeight: "1.6", 
            color: "#37383A",
            opacity: 0.9, 
            marginBottom: "35px" 
          }}>
            Your research parameters are grounded. 
            Toggle active RAG scraper nodes on the right, customize emotional sliders, or launch an analytical prompt below.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ 
              fontSize: "0.75rem", 
              fontWeight: "700", 
              opacity: 0.5, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em" 
            }}>
              Suggested Prompt Channels
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPromptSuggestion(s.text)}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(55, 56, 58, 0.15)",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    outline: "none"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#CF5254";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(55, 56, 58, 0.15)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <span style={{ 
                    fontSize: "0.7rem", 
                    fontWeight: "700", 
                    color: "#CF5254", 
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#37383A", fontWeight: "500", lineHeight: "1.4" }}>
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Message Stream */
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          {chatMessages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  width: "100%",
                  animation: "fadeIn 0.25s ease-out"
                }}
              >
                <div style={{
                  maxWidth: "85%",
                  textAlign: "left",
                  padding: isUser ? "14px 20px" : "0px",
                  background: isUser ? "#CF5254" : "transparent",
                  borderRadius: isUser ? "16px 16px 0 16px" : "0px",
                  color: isUser ? "#ffffff" : "#37383A"
                }}>
                  {/* Speaker Label with Icon */}
                  <div style={{ 
                    fontSize: "0.7rem", 
                    fontWeight: "700", 
                    color: isUser ? "rgba(255,255,255,0.85)" : "#CF5254", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    {isUser ? <LuUser size={12} /> : <LuSparkles size={12} />}
                    {isUser ? "You" : `Mellow (${activeChar?.name || "Companion"})`}
                  </div>

                  {/* Perplexity RAG Sources */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="perplexity-sources-grid">
                      {msg.sources.map((src, sIdx) => (
                        <a 
                          key={sIdx} 
                          href={src.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="perplexity-source-card"
                          style={{ textDecoration: "none", display: "block", borderRadius: "6px" }}
                        >
                          <div style={{ 
                            fontWeight: "700", 
                            color: "#CF5254", 
                            marginBottom: "4px", 
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <LuGlobe size={11} /> {src.title}
                          </div>
                          <div style={{ 
                            fontSize: "0.75rem", 
                            color: "#37383A", 
                            opacity: 0.8, 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            display: "-webkit-box", 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: "vertical",
                            lineHeight: "1.3"
                          }}>
                            {src.snippet}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Text Content in Editorial EB Garamond Style */}
                  <div style={{ 
                    fontSize: "1.05rem", 
                    lineHeight: "1.6", 
                    whiteSpace: "pre-wrap",
                    letterSpacing: "normal"
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generating Indicator (Synthesizing...) */}
      {sending && (
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", maxWidth: "800px", margin: "20px auto 0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#37383A", opacity: 0.7, fontSize: "0.9rem", fontWeight: "600" }}>
            <span style={{ fontSize: "1.1rem", animation: "spin 2s linear infinite", display: "inline-block", color: "#CF5254" }}>✦</span>
            <span style={{ fontStyle: "italic" }}>Synthesizing portal context...</span>
          </div>
        </div>
      )}

      {/* Auto-Scroll anchor */}
      <div ref={chatEndRef} style={{ height: "1px" }} />
    </div>
  );
}
