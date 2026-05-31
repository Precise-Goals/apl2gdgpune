export default function Docs() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px", display: "flex", gap: "40px", boxSizing: "border-box" }}>
      
      {/* Sidebar index */}
      <nav style={{ width: "200px", position: "sticky", top: "100px", height: "fit-content", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px", borderRight: "1px solid var(--border-charcoal)", paddingRight: "20px" }}>
        <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-coral)" }}>Documentation</h4>
        <a href="#env-setup" style={{ fontSize: "0.9rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.8 }}>1. Env Configurations</a>
        <a href="#web3-auth" style={{ fontSize: "0.9rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.8 }}>2. Web3 Nonce signed</a>
        <a href="#rag-scrapers" style={{ fontSize: "0.9rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.8 }}>3. RAG Proxy pipelines</a>
        <a href="#docker-verc" style={{ fontSize: "0.9rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.8 }}>4. Container build</a>
      </nav>

      {/* Docs Body */}
      <main style={{ flex: 1, textAlign: "left" }}>
        
        {/* Section 1 */}
        <section id="env-setup" style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "15px" }}>1. Environment Configuration</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.85, marginBottom: "20px" }}>
            Mellow splits variables strictly between server-side keys and client-side configurations. Create a secure `.env` file at the project root to feed the backend and Firebase instances.
          </p>
          <div style={{ border: "1px solid var(--border-solid)", background: "var(--sand-light)", padding: "20px", fontSize: "0.85rem", overflowX: "auto" }}>
            <pre style={{ margin: 0, fontFamily: "monospace" }}>
{`# Server-Side Private Secrets (Isolated from Client Bundle)
SARVAM_AI_API_KEY=your_sarvam_ai_api_key_here
PORT=8080

# Client-Side Firebase Configurations (Read via import.meta.env.VITE_)
VITE_FIREBASE_API_KEY=AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg
VITE_FIREBASE_AUTH_DOMAIN=mellow-373c8.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mellow-373c8-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mellow-373c8`}
            </pre>
          </div>
        </section>

        {/* Section 2 */}
        <section id="web3-auth" style={{ marginBottom: "60px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "40px" }}>
          <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "15px" }}>2. Cryptographic Web3 Nonce Verification</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.85, marginBottom: "20px" }}>
            To protect access securely without trusting vulnerable local variables, Mellow uses a 3-step cryptographically signed nonce challenge using Ethers.js:
          </p>
          <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", lineHeight: "1.6", opacity: 0.9 }}>
            <li>
              <strong>Challenge Generation:</strong> The client sends the wallet address to `/api/auth/nonce`. The secure server responds with a unique, high-entropy UUID nonce challenge.
            </li>
            <li>
              <strong>Signature Request:</strong> The client triggers the MetaMask provider using `ethers.BrowserProvider`, asking the user to sign the specific nonce.
            </li>
            <li>
              <strong>Server-Side Verification:</strong> The signature is POSTed back to `/api/auth/verify`. The server runs `ethers.verifyMessage(nonce, signature)` to resolve the active wallet address. If verified successfully, access is granted.
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section id="rag-scrapers" style={{ marginBottom: "60px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "40px" }}>
          <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "15px" }}>3. RAG Proxy Scraper pipelines</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.85, marginBottom: "20px" }}>
            All scraping and chat transactions route through our native Bun proxy server, protecting external API endpoints from CORS restrictions and secret exposures.
          </p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", lineHeight: "1.6", opacity: 0.9 }}>
            <li>
              <strong>Live Weather:</strong> Directly requests live temperatures from the Open-Meteo coordinate stream using relative prompts.
            </li>
            <li>
              <strong>Sports Matches:</strong> Injects latest Bundesliga championship standings from OpenLigaDB.
            </li>
            <li>
              <strong>HN Web Scraper:</strong> Employs Algolia HN API indices to crawl related news updates in response to developer query cues.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="docker-verc" style={{ marginBottom: "40px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "40px" }}>
          <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "15px" }}>4. Containerized Deployments</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.85, marginBottom: "20px" }}>
            Deploy Mellow on Cloud Run or Vercel using minimal resources:
          </p>
          <div style={{ border: "1px solid var(--border-solid)", background: "var(--sand-light)", padding: "16px", fontSize: "0.85rem", overflowX: "auto" }}>
            <pre style={{ margin: 0, fontFamily: "monospace" }}>
{`# Build the multi-stage Bun container
docker build -t mellow-node .

# Spin up server context (Servicing on port 8080)
docker run -p 8080:8080 mellow-node`}
            </pre>
          </div>
        </section>

      </main>

    </div>
  );
}
