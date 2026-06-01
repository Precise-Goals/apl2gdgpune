import PageLayout from "../components/layout/PageLayout";

export default function Docs({ isAuthenticated, onOpenAuth, profile, handleLogout }) {
  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      profile={profile}
      handleLogout={handleLogout}
      onOpenAuth={onOpenAuth}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 30px", display: "flex", gap: "60px", boxSizing: "border-box" }}>
        
        {/* Stripe-style Sticky Navigation Sidebar */}
        <nav style={{ width: "260px", position: "sticky", top: "100px", height: "fit-content", textAlign: "left", display: "flex", flexDirection: "column", gap: "16px", borderRight: "1px solid var(--border-charcoal)", paddingRight: "30px", flexShrink: 0 }}>
          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-coral)", fontWeight: "700" }}>System Specifications</h4>
          <a href="#firebase-setup" style={{ fontSize: "0.95rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.85, fontWeight: "500" }}>1. Firebase Credentials</a>
          <a href="#web3-spec" style={{ fontSize: "0.95rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.85, fontWeight: "500" }}>2. Cryptographic Web3</a>
          <a href="#master-prompt" style={{ fontSize: "0.95rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.85, fontWeight: "500" }}>3. Master System Prompt</a>
          <a href="#perplexity-rag" style={{ fontSize: "0.95rem", color: "var(--text-charcoal)", textDecoration: "none", opacity: 0.85, fontWeight: "500" }}>4. Perplexity RAG Pipelines</a>
        </nav>

        {/* Spacious Technical Content Canvas */}
        <main style={{ flex: 1, textAlign: "left" }}>
          
          {/* Section 1 */}
          <section id="firebase-setup" style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "2.8rem", fontFamily: "var(--font-serif)", marginBottom: "20px" }}>1. Firebase Realtime Database & Auth Configuration</h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", opacity: 0.85, marginBottom: "20px" }}>
              Mellow relies on **Firebase Realtime Database** to persist telemetry callers metric limits and **Firestore** to manage cursor-paginated chat logs histories. To configure credentials in local development, initialize your `.env` variables at the workspace root directory:
            </p>
            <div style={{ border: "1px solid var(--text-charcoal)", background: "var(--sand-light)", padding: "24px", fontSize: "0.9rem", overflowX: "auto", marginBottom: "25px" }}>
              <pre style={{ margin: 0, fontFamily: "monospace" }}>
{`# Client-Side Env variables (Prefix strictly with VITE_)
VITE_FIREBASE_API_KEY=AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg
VITE_FIREBASE_AUTH_DOMAIN=mellow-373c8.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mellow-373c8-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mellow-373c8
VITE_FIREBASE_STORAGE_BUCKET=mellow-373c8.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=9301290382
VITE_FIREBASE_APP_ID=1:9301290382:web:a2bc3d4e5f6g7h8i`}
              </pre>
            </div>
            <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)", marginBottom: "10px" }}>Securing Realtime Database Rules</h4>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>
              Ensure your Realtime Database rules protect user profiles while granting telemetry access to verified owners:
            </p>
            <div style={{ border: "1px solid var(--border-charcoal)", background: "var(--sand-light)", padding: "16px", fontSize: "0.85rem", overflowX: "auto" }}>
              <pre style={{ margin: 0, fontFamily: "monospace" }}>
{`{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}`}
              </pre>
            </div>
          </section>

          {/* Section 2 */}
          <section id="web3-spec" style={{ marginBottom: "80px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "50px" }}>
            <h2 style={{ fontSize: "2.8rem", fontFamily: "var(--font-serif)", marginBottom: "20px" }}>2. MetaMask Nonce Cryptographic Challenge</h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", opacity: 0.85, marginBottom: "20px" }}>
              Mellow employs MetaMask cryptographic challenge signing to confirm Web3 identities securely on Vercel Serverless gateways:
            </p>
            <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "15px", fontSize: "0.95rem", lineHeight: "1.7" }}>
              <li>
                <strong>Address Challenge:</strong> The frontend client triggers `fetch('/api/auth/nonce?address=' + walletAddress)`. The serverless function generates a UUID challenge nonce and stores it in the global lambda container memory map.
              </li>
              <li>
                <strong>Wallet Sign request:</strong> The client uses Ethers.js to request a signature:
                <div style={{ border: "1px solid var(--border-charcoal)", background: "var(--sand-light)", padding: "14px", fontSize: "0.85rem", margin: "10px 0", overflowX: "auto" }}>
                  <pre style={{ margin: 0, fontFamily: "monospace" }}>
{`const signature = await provider.getSigner().signMessage(challengeNonce);`}
                  </pre>
                </div>
              </li>
              <li>
                <strong>Cryptographic Verification:</strong> The signature is POSTed back to `/api/auth/verify`. The Vercel serverless lambda recovers the active signer using `ethers.verifyMessage(challenge, signature)` and compares it against the declared wallet.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section id="master-prompt" style={{ marginBottom: "80px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "50px" }}>
            <h2 style={{ fontSize: "2.8rem", fontFamily: "var(--font-serif)", marginBottom: "20px" }}>3. Master System Prompt Engineering</h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", opacity: 0.85, marginBottom: "20px" }}>
              Mellow compiles a massive system instruction payload on the backend during every conversational prompt query. It incorporates:
            </p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "15px", fontSize: "0.95rem", lineHeight: "1.7" }}>
              <li>
                <strong>Onboarding Background Context:</strong> The user's technical profile details (from Firebase RTDB) are dynamically prepended to focus conversations directly on the user's specific goals.
              </li>
              <li>
                <strong>Emotional Aspect Weights:</strong> Behavioral parameters (Candor, Empathy, Humor, Formality) dynamically scale the AI companion's vocabulary, sentence structures, and active responses.
              </li>
              <li>
                <strong>Live Injected RAG Context:</strong> Real meteorological streams and football tournament matches are formatted directly in system blocks to ground completions with verified, real-world data points.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="perplexity-rag" style={{ marginBottom: "40px", borderTop: "1px solid var(--border-charcoal)", paddingTop: "50px" }}>
            <h2 style={{ fontSize: "2.8rem", fontFamily: "var(--font-serif)", marginBottom: "20px" }}>4. Perplexity RAG Pipelines</h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", opacity: 0.85 }}>
              Our Perplexity-style engine automatically displays the raw, scraped data sources inside 1px solid bordered Bento-Cards *above* the AI's synthesized responses. When RAG filters are enabled, the client maps all returned telemetry source keys dynamically, giving users complete transparency over retrieved information.
            </p>
          </section>

        </main>

      </div>
    </PageLayout>
  );
}
