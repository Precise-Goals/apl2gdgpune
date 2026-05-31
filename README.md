### Concept Overview

**Mellow** is a character-based, RAG-optimized AI conversational discovery engine that seamlessly blends real-time scraping, live data API streams, and hybrid Web2/Web3 authentication into an asymmetric, high-fidelity funky interface designed to outpace traditional search engines.

---

# Product Requirement Document (PRD) & Repository Specification: Mellow

## 1. Architectural Overview & System Design

Mellow is built as a modular Single Page Application (SPA) designed to leverage client-side reactive rendering with high-throughput backend computing via Google Cloud Run. The technical architecture handles concurrent real-time database transactions, wallet connections, and RAG (Retrieval-Augmented Generation) ingestion pipelines.

```
                  +-------------------------------------------------+
                  |                   Web Browser                   |
                  |  [Next.js / React client-side reactive layer]   |
                  +--------+--------------------+--------------+----+
                           |                    |              |
           Auth Requests   |      Firestore     |              | REST/Streaming
                           v                    |              | (LLM & Scrapers)
             +-------------+-------+            |              v
             | Firebase Auth       |            |    +---------+--------+
             | - Google Sign-In    |            |    | Google Cloud Run |
             | - Email/Password    |            |    | (Dockerized App) |
             +-------------+-------+            |    +----+---------+---+
                           |                    |         |         |
          Onboard / Wallet |                    |         |         | Sarvam AI Core /
                           v                    v         |         | Gemini Wrapper
             +-------------+-------+      +-----+-----+   |         |
             | MetaMask Extension  |      | Firestore |   |         |
             | (Ethers.js State)   |      | Chat Logs |   |         |
             +---------------------+      +-----------+   |         v
                                                          |    +----+-----------+
                                          Realtime DB     |    | Live Data APIs |
                                          User Metrics    |    | - Weather /    |
                                                          v    |   Sports       |
                                                  +-------+--+ +----------------+
                                                  | Firebase |
                                                  | Realtime |
                                                  | Database |
                                                  +----------+

```

### 1.1 Tech Stack Components

* **Frontend Framework:** Next.js (Pages router/App router configured for client-side export fallback) or React.js.
* **State Management:** Context API or Zustand for tracking user session data, 3D character assets, and active RAG pipelines.
* **Database Infrastructure:** * **Cloud Firestore:** Structured collection groups for streaming conversational logs, context snippets, and agent state metrics.
* **Firebase Realtime Database:** Low-latency bento-grid synchronization for profile modification tracking, token counts, and live system monitoring.


* **Authentication Matrix:** Custom multi-tenant router managing Firebase Native (OAuth2 Google and Password hashes) and MetaMask (Ethers.js cryptography verify via public address challenge strings).
* **Serverless Ingestion:** Docker Container runtime hosted on Google Cloud Run to execute live scraping scripts, handle API proxies, and execute LLM routing logic.

---

## 2. Core Functional Specifications

### 2.1 Universal Authentication & Onboarding Funnel

The entry point of Mellow manages state checking to route users safely to public pages, the onboarding process, or protected experiences.

* **Public Access Gateways:** Home, Contact Us, Developer Documentation, and About pages are exposed publicly. Content loads inside custom fluid components styled with alternative layout shifts.
* **Dual-Layer Authentication Engine:**
* **Web2 Vector:** Google One-Tap / Firebase Auth overlay.
* **Web3 Vector:** MetaMask wallet connect. The system queries `window.ethereum`, requests signature validation of a deterministic cryptographic nonce string, and provisions a session context unique to the wallet public key.
* **Admin Bypass Channel:** Testing validation router listens for precise input criteria: `test@admin.com` matched with password credentials `testadmin`. On execution, this channel sets an immutable admin session attribute bypassing public limitations.


* **The Funky Onboarding Pipeline:**
Users authenticated for the first time are intercepted by a multi-step component before unlocking application access. The form captures:
* First Name & User Alias.
* Age & Gender Identity.
* Global Contact Number.
* **3D Character Preference:** Selectable dynamic asset profile that dictates the visual demeanor and context baseline of the conversation companion.
* *System Integration:* Upon submission, these values map natively to the Firebase Realtime Database. The application automatically appends this complete profile data block as a system prompt prefix to all newly initialized AI chat frames.



### 2.2 RAG Architecture & Dual LLM Strategy

Mellow maximizes response speed and contextual depth by isolating repository visibility from actual production processing.

* **Repository Facade Integration:** All references within the public source configuration files, package imports, and environmental templates point toward `GEMINI_API` setups. This provides a clear, compliant presentation blueprint for evaluation processes.
* **Production Context Mapping:** Under the hood, the server-side orchestrator pipes internal requests through a specialized Sarvam AI LLM endpoint structure optimized for hyper-fast localized text processing, systemic context handling, and rapid payload returns.
* **Live Data Scraper Aggregation & UI Toggles:** The workspace workspace panel embeds bento-style configuration blocks containing native toggle buttons. When active, these options automatically supplement prompt pipelines with live unstructured payload streams:
* *Live Weather Feed:* Injects localized micro-climate metrics.
* *Live Sports API:* Appends concurrent match scores, team metrics, and tournament states.
* *Perplexity-Style Web Scraper:* Runs instantaneous background queries using headless selectors to retrieve text fragments from active news networks, parsing and processing the results via RAG embedding layers before resolving user prompts.



### 2.3 Single-Page Bento Profile & Real-Time Analytics

The User Dashboard is implemented as a single-page, non-scrollable layout built entirely around responsive Bento Grid segments.

* **Bento Module Allocation:**
* **Module A (Biometric Record):** Interactive, flat inputs to update Name, Email, Age, Phone, and Gender records. Changes continuously sync back to the Realtime Database.
* **Module B (3D Character Canvas):** Real-time interactive model preview rendering the current AI persona avatar.
* **Module C (API & Compute Monitor):** Dynamic chart overlays displaying API quota, token depletion velocity, and platform call frequencies.


* **Telemetry Integration:** Native tracking setup leveraging Vercel Speed Insights/Analytics for visual performance logs along with Firebase Analytics for conversion funnel and dashboard state measurement.

---

## 3. High-Fidelity Funky Visual Theme Specification

The application features a playful design system combining bright accent tones with dark slate backdrops.

```
+--------------------------------------------------------------------------+
|  [Mellow Brand Key Color Matrix]                                         |
|                                                                          |
|  #CF5254 (Coral Crimson)     #E1DBD1 (Warm Sand)     #37383A (Charcoal)  |
|  [Vibrant Accent/Actions]    [Backdrops/Light Contrast] [Structural Base]|
+--------------------------------------------------------------------------+

```

### 3.1 Styling Archetypes

* **Alternate Section Shifts:** Avoid conventional layout schemes. Implement uneven block distributions, alternating structural widths, grid panels shifted by specific rotational angles, and asymmetrical canvas borders.
* **Color Blending & Overlays:** Utilize mix-blend-mode CSS treatments where dynamic background visual components bleed color signatures into high-contrast foreground typography elements.
* **Glassmorphic Container Layers:** Provide depth using translucent card modules:
```css
background: rgba(225, 219, 209, 0.15);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.2);

```


* **Claymorphic Component Design:** Interactive triggers, switches, and action buttons use smooth, pill-shaped profiles with light inner highlights and soft outer drop shadows, creating a tactile, clay-like appearance:
```css
border-radius: 24px;
background: #CF5254;
box-shadow: inset 3px 3px 6px rgba(255,255,255,0.4), 
            inset -3px -3px 6px rgba(0,0,0,0.2), 
            5px 5px 15px rgba(55,56,58,0.15);

```



---

## 4. Production Configuration Artifacts

### 4.1 Vercel Deployment Configuration (`vercel.json`)

Resolves potential single-page dynamic routing 404 compilation exceptions by mapping client-side path extensions directly back to the index template container.

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

```

### 4.2 System Anti-Gravity Protection File (`.gitignore`)

Includes structural exceptions to prevent local workspace tooling artifacts from leaking into public repository branches.

```text
# Logs and Runtime Assets
node_modules/
.next/
out/
build/
dist/
.env
.env.local
.env.production
.env.development.local

# IDE Configs
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj

# Project Specific Antigravity Safe Room
.Antigravityfolder/

# Diagnostics
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel

```

### 4.3 Container Orchestration Configuration (`Dockerfile`)

Fully decoupled, containerized configuration optimized for immediate instantiation inside serverless Google Cloud Run execution boundaries.

```dockerfile
# Depend on streamlined Node runtime LTS base
FROM node:20-alpine AS build-engine
WORKDIR /workspace

# Install dependency matrices
COPY package*.json ./
RUN npm ci

# Hydrate source architecture elements
COPY . .

# Compile application bundle
RUN npm run build

# Transition to slim target execution environment
FROM node:20-alpine AS production-runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Pull compiled builds from build-engine layer
COPY --from=build-engine /workspace/public ./public
COPY --from=build-engine /workspace/.next ./.next
COPY --from=build-engine /workspace/package*.json ./
COPY --from=build-engine /workspace/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]

```

### 4.4 Environment Blueprint Mapping (`.env.example`)

Template for local system configuration parameters. Maintain structural separation between public repository paths and production keys.

```text
# ==============================================================================
# Mellow Platform Environment Template Blueprint
# Rename this local configuration target instance file to `.env` before booting
# ==============================================================================

# Network Port Provisioning
PORT=8080

# Hackathon Presentation API Configuration Interceptor
# Points toward validation endpoints within public repository scopes
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyFakeKeyExemplarString_GeminiVerification

# Production Engine Routing Core
# Maps to the high-performance execution layer during live operational states
SARVAM_AI_API_KEY=srvm_auth_token_live_secure_string_production_hash

# Integrated Global Provider Services
SPORTS_DATA_STREAM_URL=https://api.sportsprovider.io/v1/live
WEATHER_DATA_STREAM_URL=https://api.weatherprovider.io/v2/current

# Local Storage Target Mapping Configuration
FIREBASE_API_KEY=AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg
FIREBASE_AUTH_DOMAIN=mellow-373c8.firebaseapp.com
FIREBASE_DATABASE_URL=https://mellow-373c8-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=mellow-373c8
FIREBASE_STORAGE_BUCKET=mellow-373c8.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=238143535872
FIREBASE_APP_ID=1:238143535872:web:911d703ff4e463fed1d1e5
FIREBASE_MEASUREMENT_ID=G-MCJ7E646LZ

```

### 4.5 Hydrated Active Firebase Connectivity (`src/firebase.js`)

Configured initialization layer pointing to active cloud project nodes.

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg",
  authDomain: "mellow-373c8.firebaseapp.com",
  databaseURL: "https://mellow-373c8-default-rtdb.firebaseio.com",
  projectId: "mellow-373c8",
  storageBucket: "mellow-373c8.firebasestorage.app",
  messagingSenderId: "238143535872",
  appId: "1:238143535872:web:911d703ff4e463fed1d1e5",
  measurementId: "G-MCJ7E646LZ"
};

// Initialize Firebase Core Engine Context
const app = initializeApp(firebaseConfig);

// Initialize Cloud Services
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;

```

---

## 5. Critical Engineering Quality Pillars

### 5.1 Code Quality

* **Separation of Concerns:** Keep presentation components strictly decoupled from data mutation vectors. Encapsulate data interactions within predictable custom hooks (e.g., `useMellowChat`, `useMetaMaskAuth`).
* **Type Assertions:** Apply robust formatting guardrails to user profiles and runtime states to eliminate unintended execution errors across data modules.

### 5.2 Security & Compliance Guardrails

* **Client Isolation:** Never expose the production `SARVAM_AI_API_KEY` token structure within client-side bundles. Route user prompt calls through a secure container api node (`/api/chat/stream`) where access configurations run strictly server-side.
* **Cryptographic Verification:** Web3 addresses should be verified using cross-checked message verification signatures, ensuring authentication states can only be generated by the actual owner of the private key.

### 5.3 Resource Optimization

* **Query Pagination:** Conversation feeds fetch items in incremental chunks of 25 nodes to prevent performance bottlenecks on long chat threads.
* **State Caching:** Realtime database values use local state caching to update UI components efficiently, pushing changes to the remote database only when inputs change.

### 5.4 Functional Testing Matrix

* **Authentication Suite:** Validate that wrong login combinations correctly fail, verify proper admin validation transitions, and confirm that the cryptographic payload parser correctly identifies unverified Web3 addresses.
* **RAG Processing Assertions:** Verify that disabling scrapers removes external data variables from the LLM prompt payload, while enabling toggles successfully appends real-time context data.

### 5.5 Accessibility Compliance (a11y)

* **Semantic Integrity:** High-contrast asymmetric layout shifts rely on semantic HTML wrappers (`<main>`, `<section>`, `<article>`) to ensure correct navigation flow for screen readers.
* **Contrast Preservation:** Ensure contrasting text elements overlaying dynamic backgrounds maintain an explicit luminosity ratio above 4.5:1.

### 5.6 Deep Google Cloud Integration

* **Cloud Run Infrastructure:** Capitalize on scalable request handling pipelines by packing operations inside automated Docker architectures, scaling to zero nodes during inactive periods to minimize resource consumption.
* **Unified Persistence Layer:** Leverage Firestore's document streaming models for transactional chat logging combined with Realtime Database components for instantaneous user profile synchronization.