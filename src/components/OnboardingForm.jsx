import { useState } from "react";
import { realtimeDb } from "../firebase";
import { ref, set } from "firebase/database";

export default function OnboardingForm({ userId, userEmail, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    alias: "",
    age: "",
    gender: "Other",
    phone: "",
    characterPreference: "cyberpunk_hacker"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const characters = [
    { id: "cyberpunk_hacker", name: "Cyberpunk Hacker", desc: "A neon-charged tech wizard specialized in cryptographic data nodes.", icon: "⚡" },
    { id: "synthwave_samurai", name: "Synthwave Samurai", desc: "A retro-futuristic warrior channeling nostalgic lo-fi harmonics.", icon: "🎸" },
    { id: "solarpunk_mystic", name: "Solarpunk Mystic", desc: "An ecological guide syncing organic networks with computing.", icon: "🌱" },
    { id: "retro_gamer", name: "Retro Gamer", desc: "An 8-bit companion bringing pixelated dynamic strategies.", icon: "🕹️" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.alias || !formData.age)) {
      setError("Please complete all profile details to ride the waves!");
      return;
    }
    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const profileRef = ref(realtimeDb, `users/${userId}/profile`);
      
      const payload = {
        ...formData,
        email: userEmail || "unregistered@web3.wallet",
        apiQuota: 1000,
        tokensUsed: 0,
        computeCallFrequency: 0,
        joinedAt: new Date().toISOString()
      };

      // Native Firebase Realtime Database save (ZERO mocked latency)
      await set(profileRef, payload);
      onComplete();
    } catch (err) {
      console.error("[Onboarding Submit Error]:", err);
      setError("System network interruption. Please verify database synchronization.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel asymmetric-tile" style={{ padding: "40px", maxWidth: "550px", width: "100%", boxSizing: "border-box" }}>
      <div className="skewed-tag" style={{ marginBottom: "20px" }}>
        MELLOW onboarding funnel
      </div>
      
      <h2>Step {step} of 2</h2>
      <p style={{ color: "var(--sand-dark)", marginBottom: "30px" }}>
        {step === 1 ? "Initialize your biometric and routing identity." : "Select your dynamic 3D RAG chat companion companion."}
      </p>

      {error && (
        <div style={{ background: "rgba(207, 82, 84, 0.15)", border: "1px solid var(--coral-crimson)", color: "var(--sand-light)", padding: "12px", borderRadius: "12px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="clay-input"
                placeholder="Neo"
                required
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>User Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                className="clay-input"
                placeholder="TheOne"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="clay-input"
                  placeholder="24"
                  min="1"
                  max="120"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="clay-input"
                  style={{ height: "46px" }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Contact Number (Global)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="clay-input"
                placeholder="+1 555-0199"
              />
            </div>

            <button type="button" onClick={handleNext} className="clay-pill" style={{ marginTop: "15px", alignSelf: "flex-end" }}>
              Next Vector ➡️
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => setFormData((prev) => ({ ...prev, characterPreference: char.id }))}
                  className="glass-panel"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "16px",
                    cursor: "pointer",
                    borderRadius: "16px",
                    border: formData.characterPreference === char.id ? "2px solid var(--coral-crimson)" : "1px solid rgba(225, 219, 209, 0.12)",
                    background: formData.characterPreference === char.id ? "rgba(207, 82, 84, 0.1)" : "rgba(38, 39, 40, 0.4)"
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>{char.icon}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <h3 style={{ fontSize: "1.1rem" }}>{char.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--sand-dark)" }}>{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button type="button" onClick={handleBack} className="clay-pill" style={{ background: "var(--slate-deep)", color: "var(--warm-sand)" }}>
                ⬅️ Back
              </button>
              <button type="submit" disabled={submitting} className="clay-pill">
                {submitting ? "Booting Companion..." : "Unlock Mellow Dashboard 🚀"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
