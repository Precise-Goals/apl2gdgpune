import { useState, useRef, useEffect } from "react";

export default function ChatInterface({ 
  messages, 
  loading, 
  loadingMore, 
  hasMore, 
  fetchMoreMessages, 
  onSendMessage, 
  ragToggles,
  profile
}) {
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat only when a new message arrives and user is not looking at history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const queryText = inputText;
    setInputText("");
    setSending(true);

    try {
      // 1. Send the user message (saves to Firestore natively)
      const userMsg = await onSendMessage("user", queryText);

      // 2. Fetch the AI response from our backend server (passes context flags)
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: queryText }],
          toggles: ragToggles,
          queryText: queryText
        })
      });

      if (!chatRes.ok) {
        throw new Error("Chat proxy node returned failure status.");
      }

      const chatData = await chatRes.json();
      const aiReply = chatData.choices?.[0]?.message?.content || "Companion core routing error.";

      // 3. Save the agent reply to Firestore
      await onSendMessage("assistant", aiReply);
    } catch (err) {
      console.error("[Chat Send Sequence Error]:", err);
      // Append robust error notification directly in flow
      await onSendMessage("assistant", "⚠️ Connection error. Please verify server proxy status.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-panel asymmetric-tile" style={{ display: "flex", flexDirection: "column", height: "550px", width: "100%", maxWidth: "1200px", margin: "20px auto 0", boxSizing: "border-box", overflow: "hidden" }}>
      
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", borderBottom: "1px solid rgba(225, 219, 209, 0.12)", background: "rgba(38, 39, 40, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>💬</span>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Conversational Discovery Engine</h3>
            <div style={{ fontSize: "0.75rem", color: "var(--sand-dark)" }}>
              RAG Optimization: {Object.keys(ragToggles).filter(k => ragToggles[k]).join(", ") || "None"}
            </div>
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--sand-dark)" }}>
          Session: <strong style={{ color: "var(--coral-crimson)" }}>{profile.alias || "Nomad"}</strong>
        </div>
      </div>

      {/* Message Feed Display */}
      <div 
        ref={scrollRef} 
        style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Load older button */}
        {hasMore && (
          <button 
            type="button"
            onClick={fetchMoreMessages} 
            disabled={loadingMore} 
            className="clay-pill" 
            style={{ padding: "6px 16px", fontSize: "0.8rem", margin: "0 auto 10px", display: "block", background: "var(--slate-deep)" }}
          >
            {loadingMore ? "Seeking history..." : "⏳ Load Older Queries"}
          </button>
        )}

        {loading ? (
          <div style={{ margin: "auto", color: "var(--sand-dark)", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <div className="floating-asset" style={{ fontSize: "2rem" }}>🌀</div>
            <div>Syncing chat coordinates...</div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ margin: "auto", color: "var(--sand-dark)", maxWidth: "400px" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>Interface Primed</p>
            <p style={{ fontSize: "0.85rem" }}>Tweak the RAG toggles in your Bento grid and query the agent to scrape real-time context feeds.</p>
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
                  padding: "12px 18px", 
                  borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: isUser ? "var(--coral-crimson)" : "rgba(38, 39, 40, 0.7)",
                  border: isUser ? "none" : "1px solid rgba(225, 219, 209, 0.08)",
                  color: "var(--sand-light)",
                  boxShadow: isUser 
                    ? "inset 1px 1px 2px rgba(255,255,255,0.3), 1px 2px 4px rgba(0,0,0,0.2)"
                    : "none"
                }}>
                  <div style={{ fontSize: "0.75rem", color: isUser ? "rgba(255,255,255,0.8)" : "var(--coral-crimson)", fontWeight: "800", marginBottom: "4px" }}>
                    {isUser ? "YOU" : "MELLOW"}
                  </div>
                  <div style={{ fontSize: "0.95rem", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic assistant typing state */}
        {sending && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div className="glass-panel" style={{ padding: "12px 18px", borderRadius: "20px 20px 20px 4px", color: "var(--sand-dark)", display: "flex", gap: "6px", alignItems: "center" }}>
              <div className="floating-asset" style={{ fontSize: "1.1rem" }}>⚡</div>
              <span style={{ fontSize: "0.9rem" }}>Analyzing scraping vectors...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input panel bar */}
      <form 
        onSubmit={handleSend} 
        style={{ display: "flex", gap: "10px", padding: "15px 20px", borderTop: "1px solid rgba(225, 219, 209, 0.12)", background: "rgba(26, 27, 28, 0.4)" }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          className="clay-input"
          placeholder="Query the discovery engine..."
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || sending} 
          className="clay-pill"
          style={{ padding: "10px 24px" }}
        >
          {sending ? "Scanning..." : "Search 🚀"}
        </button>
      </form>

    </div>
  );
}
