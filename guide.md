# Mellow Integration & API Acquisition Guide

This guide details the procedure to acquire, secure, and register the third-party integrations, credentials, and API connections required to power Mellow in development and production.

---

## 1. Firebase Suite (Auth, Firestore, Realtime DB)

Mellow leverages Google Firebase to handle low-latency user metrics (Realtime DB), transactional conversational logs (Firestore), and session gates (Authentication/Analytics).

### Steps to Acquire Configuration:
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `mellow-ai` (or select an existing one).
3. Under project settings, register a new **Web App (`</>`)**.
4. Copy the generated `firebaseConfig` object and populate your `.env` variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_rtdb_url.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
5. **Enable Databases in the console:**
   * **Authentication**: Go to *Build > Authentication > Sign-in Method*. Enable **Email/Password** and **Google Sign-In**.
   * **Cloud Firestore**: Go to *Build > Firestore Database*. Click *Create Database*. Set location and configure initial test rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId}/chats/{document=**} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```
   * **Realtime Database**: Go to *Build > Realtime Database*. Click *Create Database*. Enable database rules:
     ```json
     {
       "rules": {
         "users": {
           "$uid": {
             ".read": "auth != null && auth.uid == $uid",
             ".write": "auth != null && auth.uid == $uid"
           }
         }
       }
     }
     ```

---

## 2. Sarvam AI Core (LLM Stream Engine)

Sarvam AI provides localized, ultra-fast language processing structures that power Mellow's dual LLM strategy.

### Steps to Acquire Credentials:
1. Visit the [Sarvam AI Developer Platform](https://www.sarvam.ai/).
2. Create an account or log in to the dashboard.
3. Generate a new API Access Token under the **API Keys** panel.
4. Copy this key immediately (it will only be shown once) and save it in `.env` under `SARVAM_AI_API_KEY`.
   * **CRITICAL SECURITY NOTE**: Never prefix this with `VITE_` or reference it directly in front-end React components. The Bun backend proxy server in `server/index.js` isolates this token server-side to prevent client-side credential extraction.

---

## 3. Web3 Cryptographic MetaMask Nonces

MetaMask Web3 authentication leverages Ethers.js to request users to sign a deterministic challenge rather than trust raw wallet strings.

### Integration Mechanism:
1. When a wallet connects, the backend generates a secure cryptographic challenge nonce (a high-entropy UUID coupled with a timestamp).
2. The user signs this string in MetaMask.
3. The server uses `ethers.verifyMessage()` to recover the exact public address that signed the challenge, verifying cryptographic ownership before allocating an auth session state.

---

## 4. Live Scrapers (Weather & Sports API Streams)

To ensure the **Zero Tolerance for Fake Data** directive is met, Mellow scrapes actual streams using secure backend requests:

### Live Weather Stream:
* **Default Feed**: Powered by open-source meteorological micro-services like [Open-Meteo](https://open-meteo.com/) or [OpenWeatherMap](https://openweathermap.org/api).
* Set your `WEATHER_DATA_STREAM_URL` inside `.env` to pull localized coordinates, e.g.:
  `WEATHER_DATA_STREAM_URL=https://api.open-meteo.com/v1/forecast`

### Live Sports Stream:
* **Default Feed**: Integrates live tournaments and match logs via premium services like [TheSportsDB](https://www.thesportsdb.com/api.php) or [RapidAPI Sports Streams](https://rapidapi.com/).
* Populate your `SPORTS_DATA_STREAM_URL` to route structured matches:
  `SPORTS_DATA_STREAM_URL=https://api.sportsprovider.io/v1/live`

---

## 5. Development Startup Routine

To launch client and server simultaneously in local development:

```bash
# Install all required bun dependencies
bun install

# Start Vite frontend (Vite listens on 5173, proxied by Vite configuration)
bun run dev

# Start secure Bun backend server (Listens on 8080)
bun run server
```
