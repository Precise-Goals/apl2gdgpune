export default function About() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 20px", textAlign: "left", boxSizing: "border-box" }}>
      
      {/* Page Title */}
      <header style={{ marginBottom: "50px", borderBottom: "1px solid var(--border-charcoal)", paddingBottom: "25px" }}>
        <div style={{ color: "var(--accent-coral)", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
          THE EDITORIAL ARCHIVES
        </div>
        <h1 style={{ fontSize: "3.5rem", fontFamily: "var(--font-serif)", lineHeight: "1.1" }}>
          The Philosophy Behind Mellow.
        </h1>
        <p style={{ fontSize: "1.15rem", opacity: 0.7, marginTop: "10px", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
          How Team Falcons reimagined real-time data discovery in May 2026.
        </p>
      </header>

      {/* Editorial Body */}
      <article style={{ display: "flex", flexDirection: "column", gap: "30px", fontSize: "1.05rem", lineHeight: "1.7", color: "var(--text-charcoal)" }}>
        
        <p>
          Information retrieval systems stand at a critical crossroads. While large language models display spectacular synthesis capabilities, they are inherently restricted by temporal training boundaries. Search boxes offer dynamic coverage but lack synthesis, drowning users in raw blue links.
        </p>

        <h3 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", marginTop: "20px" }}>
          Reimagining Context Ingestion
        </h3>
        
        <p>
          Mellow was conceived to bridge this gap. We believed that by combining the conversational intelligence of custom-tailored local character presets with automated, low-latency scraper feeds, we could build a discovery engine that feels alive and acts with precise, non-mocked data.
        </p>

        <blockquote>
          <p style={{
            fontSize: "1.4rem",
            fontFamily: "var(--font-serif)",
            lineHeight: "1.4",
            color: "var(--accent-coral)",
            borderLeft: "2px solid var(--accent-coral)",
            paddingLeft: "25px",
            margin: "30px 0",
            fontStyle: "italic"
          }}>
            "We didn't just want a chatbot that talks about the weather; we wanted a chatbot that queries local weather stations dynamically before writing its response."
          </p>
        </blockquote>

        <h3 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", marginTop: "20px" }}>
          Falcons Community Standards
        </h3>

        <p>
          At **Team Falcons**, we govern our project builds with three unyielding core engineering guidelines:
        </p>

        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", margin: "10px 0" }}>
          <li>
            <strong>100% Data Integrity:</strong> Absolute rejection of simulated or mocked JSON payloads for RAG feeds. Every weather degree, soccer result, and scraper log must route through secure native requests.
          </li>
          <li>
            <strong>Client-Side Cryptographic Autonomy:</strong> Strict protection of private credentials via Web3 nonce signature flows, verifying MetaMask wallets server-side using cryptographic math.
          </li>
          <li>
            <strong>Extreme Performance Footprint:</strong> Leveraging ultra-fast runtimes (Bun Native API Proxies) and static client delivery bundles for under 450ms compilation and rapid server wake-ups.
          </li>
        </ul>

        <h3 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", marginTop: "20px" }}>
          The Aesthetic Pivot
        </h3>

        <p>
          In our initial iterations, we fell into the standard hackathon trap of cramped dark layouts and heavy shadows. To honor the depth of our RAG pipelines, we executed a complete design pivot to mimic the typographic simplicity of Anthropic's Claude. Warm paper backdrops, 1px solid container grids, and generous whitespace ensure your search history reads like a premium, crisp editorial.
        </p>

      </article>

      {/* Footer Signature */}
      <div style={{ borderTop: "1px solid var(--border-charcoal)", marginTop: "60px", paddingTop: "30px", display: "flex", justifySelf: "flex-start", gap: "20px", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: "600" }}>
          Team Falcons — May 2026
        </div>
        <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
          Lead Architect • Senior Security Engineer • Lead UI Developer
        </div>
      </div>

    </div>
  );
}
