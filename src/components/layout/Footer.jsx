export default function Footer() {
  return (
    <footer 
      style={{ 
        padding: "20px 40px", 
        borderTop: "1px solid var(--border-charcoal)", 
        background: "var(--bg-paper)", 
        fontSize: "0.8rem", 
        color: "var(--text-charcoal)", 
        textAlign: "center", 
        display: "flex", 
        justifyContent: "space-between", 
        flexWrap: "wrap", 
        gap: "10px" 
      }}
    >
      <span>© 2026 Mellow Conversational Engine. Made by Team Falcons May 2026.</span>
      <span style={{ opacity: 0.6 }}>High-Fidelity RAG-Optimized Research System</span>
    </footer>
  );
}
