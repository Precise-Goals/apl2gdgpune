import { useRef, useEffect } from "react";

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
    { text: "Analyze real-time market data...", label: "📊 Market Scrape" },
    { text: "Draft an empathetic email regarding delay...", label: "✉️ Empathetic Mail" },
    { text: "Summarize today's tech news from HackerNews...", label: "🔍 News Insights" },
    { text: "Predict the upcoming weather trends...", label: "☁️ Weather Telemetry" }
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
      style={{ 
        flex: 1, 
        overflowY: "auto", 
        display: "flex", 
        flexDirection: "column", 
        padding: "30px 40px", 
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      {/* Infinite Scroll / Load Prior Discoveries */}
      {!showEmptyState && hasMore && (
        <button 
          type="button"
          onClick={fetchMoreMessages} 
          disabled={loadingMore}
          className="flat-btn"
          style={{ 
            fontSize: "0.8rem", 
            padding: "6px 16px", 
            alignSelf: "center", 
            marginBottom: "20px",
            borderRadius: "20px"
          }}
        >
          {loadingMore ? "Seeking older sessions..." : "Load Prior Discoveries ✦"}
        </button>
      )}

      {chatLoading ? (
        <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: 0.6 }}>
          <div style={{ fontSize: "1.8rem", animation: "spin 2s linear infinite" }}>✦</div>
          <div style={{ fontSize: "0.9rem" }}>Aligning RAG channels...</div>
        </div>
      ) : showEmptyState ? (
        /* Empty State with Suggestion Chips */
        <div style={{ margin: "auto", maxWidth: "680px", width: "100%", textAlign: "left", animation: "fadeIn 0.3s ease-out" }}>
          <h2 style={{ fontSize: "3.2rem", fontFamily: "var(--font-serif)", lineHeight: "1.15", marginBottom: "16px" }}>
            What shall we discover together, {profile?.alias || "Nomad"}?
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.6", opacity: 0.85, marginBottom: "35px" }}>
            Your research background **"{profile?.basicInfo || 'Technical goals'}"** is securely ground. 
            Toggle Meteorological, news or Athletic scraper widgets on the right, scale Mellow's aspects, and select a prompt suggestion chip or instruct the companion below.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "700", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Suggested Prompt Channels:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPromptSuggestion(s.text)}
                  style={{
                    background: "var(--sand-light)",
                    border: "1px solid var(--border-charcoal)",
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
                    e.currentTarget.style.borderColor = "var(--accent-coral)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-charcoal)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--accent-coral)", textTransform: "uppercase" }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-charcoal)", fontWeight: "500", lineHeight: "1.4" }}>
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Message Stream */
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
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
                  background: isUser ? "var(--accent-coral)" : "transparent",
                  borderRadius: isUser ? "16px" : "0px",
                  color: isUser ? "var(--sand-light)" : "var(--text-charcoal)"
                }}>
                  {/* Speaker Label */}
                  <div style={{ 
                    fontSize: "0.7rem", 
                    fontWeight: "700", 
                    color: isUser ? "rgba(255,255,255,0.85)" : "var(--accent-coral)", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.08em",
                    marginBottom: "6px" 
                  }}>
                    {isUser ? "You" : `Mellow (${activeChar.name})`}
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
                          style={{ textDecoration: "none" }}
                        >
                          <div style={{ fontWeight: "700", color: "var(--accent-coral)", marginBottom: "3px", fontSize: "0.75rem" }}>
                            ✦ {src.title}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-charcoal)", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {src.snippet}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Text Content */}
                  <div style={{ 
                    fontSize: "1rem", 
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

      {/* Generating/Scraping Telemetry Loader */}
      {sending && (
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", maxWidth: "800px", margin: "20px auto 0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-coral)", fontSize: "0.9rem", fontWeight: "600" }}>
            <span style={{ fontSize: "1.1rem", animation: "spin 2s linear infinite" }}>✦</span>
            <span>Performing Perplexity-style RAG scrapes...</span>
          </div>
        </div>
      )}

      {/* Auto-Scroll anchor */}
      <div ref={chatEndRef} style={{ height: "1px" }} />
    </div>
  );
}
