# <p align="center">✦ M E L L O W ✦</p>

<p align="center">
  <strong>Perplexity Meets Emotional Intelligence.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Bun-1.1-orange?style=flat&logo=bun" alt="Bun Badge">
  <img src="https://img.shields.io/badge/Vite-8.0-blue?style=flat&logo=vite" alt="Vite Badge">
  <img src="https://img.shields.io/badge/React-SPA-61dafb?style=flat&logo=react" alt="React Badge">
  <img src="https://img.shields.io/badge/Vercel-Serverless-black?style=flat&logo=vercel" alt="Vercel Badge">
  <img src="https://img.shields.io/badge/Firebase-RTDB%20%26%20Auth-ffca28?style=flat&logo=firebase" alt="Firebase Badge">
  <img src="https://img.shields.io/badge/Web3-MetaMask%20Ethers-f6851b?style=flat&logo=metamask" alt="Web3 Badge">
</p>

---

![alt text](image-1.png)

## 🌟 1. Project Overview

**Mellow** represents the next generation of conversational search. While traditional search engines like Perplexity are highly structured but emotionally static, and typical LLM chatbots are warm but prone to hallucinations, Mellow introduces a unified solution: **A Hybrid RAG Conversational Discovery Engine with an Adjustable Emotional Matrix.**

Engineered for the **May 2026 RAG Discovery Hackathon** by **Team Falcons**, Mellow leverages a premium, typography-driven sand-paper interface, integrating real-time weather streams, soccer league standings, and HN news scrapers, cryptographically protected under Web3 signature protocols.

---
![alt text](image.png)

## 💡 2. The Vision: Emotional RAG Ingestion

Traditional search canvases treat query context as a flat line. Mellow introduces the **Cognitive & Emotional Discovery Paradigm**:

| Traditional AI Engines | Mellow Discovery Engine |
| :--- | :--- |
| **Emotionally Deaf:** Standard analytical answers that do not scale to user anxiety, stress, or technical background. | **Adjustable Emotional Matrix:** Dynamic Candor, Empathy, Humor, and Formality sliders directly customize the voice, structure, and persona. |
| **Out-of-Date:** Rely on static model knowledge baselines. | **Unified RAG Pipelines:** Toggled Meteorological (Open-Meteo), Athletic (OpenLigaDB), and news stories scrapers. |
| **Vulnerable Sessions:** Vulnerable browser state tokens easily prone to client-side spoofing. | **Web3 Wallet Verification:** Uses MetaMask private keys to cryptographically sign serverless nonces. |
| **Heavy Cramped UI:** Dark, rounded claymorphic grids with complex elements that distract from reading. | **Claude Design System:** Spacious warm sand backdrops, sharp 1px borders, and gorgeous serif-sans font stacks. |

---

## 🚀 3. Core Innovations (Quantified)

* **🎭 Dynamic Emotional Aspect Weights:** Using 4-axis range parameters (0-100), Mellow rewrites prompt instruction matrices on Vercel Serverless gateways to scale active vocabulary structures, sentence sizes, and character response parameters dynamically.
* **🔍 Perplexity-Style Bento Visualizers:** When scraper flags are toggled, the application retrieves genuine, non-mocked data fragments, maps them into structural references, stores them in Firestore chat logs, and renders source cards *above* synthesized AI replies.
* **📝 Onboarding Background Telemetry:** Captures user research goals, technical preferences, and credentials inside the Firebase Realtime Database. The proxy automatically prepends this profile to focus the LLM context window.
* **🔑 Web3 Cryptographic Security:** Moving beyond simple `window.ethereum` checks, Mellow runs `ethers.verifyMessage()` on serverless Node.js endpoints to recover MetaMask signer addresses from high-entropy UUID nonces, securing sessions.
* **⚡ High-Velocity Infrastructure:** Built upon **Bun** and **Vite** for 400ms local HMR, with secure serverless proxies isolating key credentials (`SARVAM_AI_API_KEY`) from the client bundle.

---

## 🏗️ 4. System Architecture

```
                    +------------------------------------------+
                    |               Web Browser                |
                    |    (React.js / Vite Spacious Canvas)     |
                    +-----+------------------+-----------+-----+
                          |                  |           |
             Web3 Nonce   |   Firestore      |           | Rest Prompts /
             Auth Gateway |   Chat Logs      |           | Scraper Toggles
                          v                  |           v
            +-------------+-------+          |    +------+------------------+
            | MetaMask Wallet     |          |    | Vercel Serverless API    |
            | (Ethers.js Signed)  |          |    | '/api/chat' Proxy Gateway|
            +-------------+-------+          |    +------+----------+-------+
                          |                  |           |          |
              Nonce Sign  |                  |           |          | Ingest Context
              Validation  v                  v           |          v
            +-------------+-------+      +---+---+       |    +-----+-----------+
            | Vercel Serverless   |      | Cloud |       |    | Live Data APIs  |
            | '/api/auth/verify'  |      | Fire  |       |    | - Open-Meteo    |
            +---------------------+      | store |       |    | - OpenLigaDB    |
                                         +-------+       |    | - HackerNews    |
                                                         v    +-----------------+
                                                +--------+-------+
                                                |  Sarvam AI Core|
                                                |  Gemini Backup |
                                                +----------------+
```

---

## 🛠️ 5. Local Installation & Setup

Mellow is fully optimized to run natively using `bun` or `npm`.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/team-falcons/mellow.git
cd mellow
bun install
```

### 2. Configure Environment Secrets
Create a `.env` file at the root directory of the project:
```ini
# Serverless Node.js Private Secrets (Isolated from client bundle)
SARVAM_AI_API_KEY=your_sarvam_ai_api_key_here
PORT=8080

# Client-Side Firebase Telemetries (Prefixed with VITE_)
VITE_FIREBASE_API_KEY=AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg
VITE_FIREBASE_AUTH_DOMAIN=mellow-373c8.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mellow-373c8-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mellow-373c8
```

### 3. Launch Development Workspace
```bash
# Boot the local API proxy server
bun run server

# Spin up Vite local client HMR
bun run dev
```

---

## 🎨 6. The UI/UX Philosophy

Mellow rejects traditional "dark mode/clay" aesthetics in favor of inclusive, legible, typography-focused design:
* **The Legibility Stack:** Uses a clean, non-condensed typography stack (`'Inter'`, sans-serif) with standard tracking and open line-heights (`1.65`) to prevent reader fatigue.
* **The Claude Color Canvas:** Styled using **Warm Sand** (`#E1DBD1`) paper backdrops, structural **Charcoal** (`#37383A`) flat borders, and minimalist **Coral Crimson** (`#CF5254`) highlights.
* **Accessibility-First:** Clean contrast ratios and responsive grids ensure that researchers have a spacious, distraction-free environment to discover new insights.

---

## 👥 7. Meet Team Falcons

Mellow was conceptualized, designed, and engineered by **Team Falcons** in May 2026. We are a community of passionate builders committed to high-stakes AI architectures, cryptography integrations, and accessible interface designs:

* **Sarthak Tulsidas Patil** — Lead Systems & Web3 Security Engineer
* **Utkarsh Vidwat** — Lead UI/UX & Responsive Web Engineer
* **Gaurav Chaudhari** — Core Full-Stack & RAG Pipeline Developer
* **Prathamesh Kolhe** — Backend Proxy & Telemetry Analytics Engineer
* **Satyam Singh** — Firebase Database Architect & Rule Specialist
* **Dhiraj Takale** — Docker Container & Devops Deployment Specialist

---
<p align="center">
  ✦ Made with pride by Team Falcons May 2026 ✦
</p>