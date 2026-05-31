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
    basicInfo: "", // Detailed research profile
    characterPreference: "cyberpunk_hacker"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const characters = [
    { id: "cyberpunk_hacker", name: "Cyberpunk Hacker", desc: "A neon-charged tech wizard specialized in cryptographic data nodes.", icon: "⚡" },
    { id: "synthwave_samurai", name: "Synthwave Samurai", desc: "A retro-futuristic warrior channeling nostalgic lo-fi harmonics.", icon: "👺" },
    { id: "solarpunk_mystic", name: "Solarpunk Mystic", desc: "An ecological guide syncing organic networks with computing.", icon: "👽" },
    { id: "retro_gamer", name: "Retro Gamer", desc: "An 8-bit companion bringing pixelated dynamic strategies.", icon: "👾" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.alias || !formData.age || !formData.basicInfo)) {
      setError("Please complete all profile details and write your research background!");
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
    <div className="flat-card" style={{ maxWidth: "600px", width: "100%", padding: "40px", boxSizing: "border-box", textAlign: "left" }}>
      <div style={{ display: "inline-flex", color: "var(--accent-coral)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "15px" }}>
        ✦ MELLOW ONBOARDING PORTAL
      </div>
      
      <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "10px" }}>Step {step} of 2</h2>
      <p style={{ fontSize: "0.95rem", opacity: 0.8, marginBottom: "30px" }}>
        {step === 1 ? "Initialize your demographics and declare your research goals." : "Select your dynamic RAG companion persona."}
      </p>

      {error && (
        <div style={{ border: "1px solid var(--accent-coral)", color: "var(--accent-coral)", padding: "12px", fontSize: "0.85rem", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="flat-input"
                  placeholder="e.g. Neo"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>User Alias</label>
                <input
                  type="text"
                  name="alias"
                  value={formData.alias}
                  onChange={handleInputChange}
                  className="flat-input"
                  placeholder="e.g. TheOne"
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="flat-input"
                  placeholder="24"
                  min="1"
                  max="120"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="flat-input"
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
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>Contact Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flat-input"
                placeholder="+1 555-0199"
              />
            </div>

            {/* Massive Basic Information Area */}
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.85rem" }}>
                Basic Research Information & Background
              </label>
              <textarea
                name="basicInfo"
                value={formData.basicInfo}
                onChange={handleInputChange}
                className="flat-input"
                rows="4"
                style={{ resize: "vertical", minHeight: "100px" }}
                placeholder="Declare your background, research goals, and preferences to ground all AI prompts dynamically (e.g., 'I am a backend specialist studying real-time scraping architectures...')"
                required
              />
            </div>

            <button 
              type="button" 
              onClick={handleNext} 
              className="flat-btn flat-btn-primary" 
              style={{ marginTop: "10px", alignSelf: "flex-end" }}
            >
              Select Companion ➡️
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => setFormData((prev) => ({ ...prev, characterPreference: char.id }))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "16px",
                    cursor: "pointer",
                    border: "1px solid var(--text-charcoal)",
                    background: formData.characterPreference === char.id ? "rgba(207, 82, 84, 0.08)" : "var(--sand-light)",
                    opacity: formData.characterPreference === char.id ? 1 : 0.85,
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "2.4rem" }}>{char.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>{char.name}</h3>
                    <p style={{ fontSize: "0.8rem", margin: 0, opacity: 0.8 }}>{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button 
                type="button" 
                onClick={handleBack} 
                className="flat-btn"
              >
                ⬅️ Back
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="flat-btn flat-btn-primary"
              >
                {submitting ? "Synchronizing..." : "Access Workspace 🚀"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
