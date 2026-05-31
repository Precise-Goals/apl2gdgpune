export default function About() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 30px", boxSizing: "border-box" }}>
      
      {/* Editorial Title */}
      <header style={{ marginBottom: "60px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "30px" }}>
        <div style={{ color: "var(--accent-coral)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "15px" }}>
          THE FALCON CHRONICLES / EDITORIAL
        </div>
        <h1 style={{ fontSize: "4.2rem", fontFamily: "var(--font-serif)", lineHeight: "1.1", marginBottom: "10px" }}>
          The Philosophy Behind Mellow.
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
          Reimagining responsive web architectures and zero-mock context layers in May 2026.
        </p>
      </header>

      {/* Editorial Rich Body */}
      <article style={{ display: "flex", flexDirection: "column", gap: "40px", fontSize: "1.05rem", lineHeight: "1.8", color: "var(--text-charcoal)" }}>
        
        <div>
          <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)", marginBottom: "12px" }}>
            The Core Paradigm Shift
          </h3>
          <p>
            Traditional AI chatbots operate on a static timeline, locked within their initial pre-training data parameters. When a user requests real-time queries (e.g. "What is the weather in Delhi?", "How did Dortmund play today?"), typical models either hallucinate or default to generic placeholders. This is unacceptable for modern research tasks.
          </p>
          <p>
            Mellow was engineered by **Team Falcons** to bridge this gap. Our team recognized that context ingestion must be dynamic, non-mocked, and securely processed before any LLM instruction compilation is executed. By binding real meteorological streams, league tables, and HN web scrapers directly to a serverless API proxy, we ground conversations with 100% verified, real-world data points.
          </p>
        </div>

        <blockquote style={{
          fontSize: "1.5rem",
          fontFamily: "var(--font-serif)",
          lineHeight: "1.5",
          color: "var(--accent-coral)",
          borderLeft: "3px solid var(--accent-coral)",
          paddingLeft: "30px",
          margin: "40px 0",
          fontStyle: "italic"
        }}>
          "Information should read like a premium, crisp magazine. We abandoned dark, heavy claymorphism in favor of a clean, responsive sand paper system that values legible typography and extensive technical copy."
        </blockquote>

        <div>
          <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)", marginBottom: "12px" }}>
            Uncompromising Falcon Standards
          </h3>
          <p>
            Every software product crafted by the Falcons Tech Community must adhere strictly to three foundational architectural pillars:
          </p>
          <ol style={{ paddingLeft: "25px", display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
            <li>
              <strong>Total Cryptographic Session Autonomy:</strong> Traditional session management relies on vulnerable local storage values that can be easily manipulated. Mellow implements client-side MetaMask wallet verification using a secure serverless cryptographic signature protocol, preventing access spoofing.
            </li>
            <li>
              <strong>Real-Time Database Grounding:</strong> By capturing user basic goals inside a Realtime Database and prepending them to system prompts alongside RAG layers, we eliminate disjointed conversational flow. The AI companion remembers user technical profiles instantly.
            </li>
            <li>
              <strong>High-Fidelity UI Realignment:</strong> Mellow enforces a legible, non-condensed font stack (`'Inter'`, sans-serif), wide flex gaps, and elegant Perplexity-style bento cards, providing a spacious and visually stunning workspace canvas.
            </li>
          </ol>
        </div>

        <div>
          <h3 style={{ fontSize: "2.2rem", fontFamily: "var(--font-serif)", marginBottom: "12px" }}>
            The Claude Design Concept
          </h3>
          <p>
            Our interface is heavily inspired by the editorial design of Anthropic's Claude. We believe that an interactive workspace should feel clean and restful. By utilizing a warm sand paper color scheme (`#E1DBD1`), flat 1px solid borders, sharp corners, and generous whitespace, Mellow creates an immersive environment that is free from distractions, perfect for high-focus research.
          </p>
        </div>

      </article>

      {/* Signature */}
      <div style={{ borderTop: "1px solid var(--border-charcoal)", marginTop: "80px", paddingTop: "40px", display: "flex", justifySelf: "flex-start", gap: "25px", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: "600" }}>
          Team Falcons — May 2026
        </div>
        <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          Lead UI Architect • Senior Security Engineer • Lead Full-Stack Architect
        </div>
      </div>

    </div>
  );
}
