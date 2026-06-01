export default function ChatInput({
  inputText,
  setInputText,
  sending,
  activeChar,
  handleSend
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    handleSend(e);
  };

  return (
    <div 
      style={{ 
        padding: "16px 40px 24px", 
        background: "var(--bg-paper)", 
        borderTop: "1px solid var(--border-charcoal)",
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0
      }}
    >
      <form 
        onSubmit={onSubmit} 
        style={{ 
          display: "flex", 
          gap: "12px", 
          width: "100%", 
          maxWidth: "800px", 
          margin: "0 auto" 
        }}
      >
        <input
          type="text"
          className="flat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          placeholder={`Instruct Mellow (${activeChar?.name || "AI"})...`}
          style={{ 
            flex: 1, 
            border: "1px solid var(--border-solid)", 
            padding: "14px 20px", 
            fontSize: "0.95rem",
            borderRadius: "24px",
            background: "var(--sand-light)",
            color: "var(--text-charcoal)"
          }}
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || sending} 
          className="flat-btn flat-btn-primary"
          style={{ 
            padding: "0 24px", 
            fontSize: "0.9rem",
            borderRadius: "24px",
            height: "48px",
            minWidth: "110px",
            fontWeight: "600"
          }}
        >
          {sending ? "✦" : "Transmit"}
        </button>
      </form>
    </div>
  );
}
