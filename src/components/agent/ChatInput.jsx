import { useRef, useEffect } from "react";
import { LuPaperclip, LuArrowUp } from "react-icons/lu";

export default function ChatInput({
  inputText,
  setInputText,
  sending,
  activeChar,
  handleSend
}) {
  const textareaRef = useRef(null);

  // Dynamic textarea height auto-resizer
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(150, scrollHeight)}px`;
      if (scrollHeight > 150) {
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [inputText]);

  const onSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;
    handleSend(e);
  };

  const handleKeyDown = (e) => {
    // Submit on Enter without shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div 
      style={{ 
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "24px 40px 16px", 
        background: "linear-gradient(to top, #E1DBD1 60%, rgba(225, 219, 209, 0) 100%)", 
        pointerEvents: "none",
        boxSizing: "border-box",
        flexShrink: 0,
        zIndex: 5
      }}
    >
      <div 
        style={{ 
          maxWidth: "800px", 
          margin: "0 auto",
          pointerEvents: "auto"
        }}
      >
        <form 
          onSubmit={onSubmit} 
          style={{ 
            position: "relative",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid #37383A",
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "flex-end",
            padding: "8px",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            boxSizing: "border-box",
            width: "100%"
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#CF5254";
            e.currentTarget.style.boxShadow = "0 0 0 1px #CF5254";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "#37383A";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* File attachment icon */}
          <button 
            type="button"
            style={{
              padding: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#37383A",
              opacity: 0.6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "opacity 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "0.6"}
          >
            <LuPaperclip size={18} />
          </button>

          {/* Dynamic Editorial Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder={`Instruct Mellow (${activeChar?.name || "AI"})...`}
            style={{ 
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              fontWeight: "500", // Enforce crisp medium weight
              padding: "8px 10px",
              color: "#37383A",
              maxHeight: "150px",
              lineHeight: "1.5",
              boxSizing: "border-box"
            }}
          />

          {/* Transmit action button */}
          <button 
            type="submit" 
            disabled={!inputText.trim() || sending} 
            style={{ 
              padding: "10px",
              borderRadius: "50%",
              height: "36px",
              width: "36px",
              background: (!inputText.trim() || sending) ? "rgba(55, 56, 58, 0.15)" : "#CF5254",
              color: "#ffffff",
              border: "none",
              cursor: (!inputText.trim() || sending) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: "8px",
              transition: "background-color 0.2s ease"
            }}
          >
            <LuArrowUp size={18} />
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: "8px",
          fontSize: "0.75rem",
          fontWeight: "600", // Enforce robust weight for legal disclaimer
          color: "rgba(55, 56, 58, 0.5)",
          fontFamily: "var(--font-sans)"
        }}>
          Mellow AI can make mistakes. Consider verifying critical information.
        </div>
      </div>
    </div>
  );
}
