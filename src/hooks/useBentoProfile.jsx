import { useState, useEffect, useCallback } from "react";
import { realtimeDb } from "../firebase";
import { ref, onValue, set, update } from "firebase/database";

export function useBentoProfile(userId) {
  const [profile, setProfile] = useState({
    firstName: "",
    alias: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    characterPreference: "mellow_companion_default",
    // Telemetry and compute monitoring logs
    apiQuota: 1000,
    tokensUsed: 0,
    computeCallFrequency: 0
  });
  const [loading, setLoading] = useState(true);

  // Read data in real-time from the Firebase Realtime Database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const profileRef = ref(realtimeDb, `users/${userId}/profile`);
    setLoading(true);

    const unsubscribe = onValue(profileRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setProfile((prev) => ({ ...prev, ...val }));
      } else {
        // Hydrate default bento analytics fields if account is uninitialized
        const initialProfile = {
          firstName: "",
          alias: "",
          age: "",
          gender: "",
          phone: "",
          email: "",
          characterPreference: "cyberpunk_hacker",
          apiQuota: 1000,
          tokensUsed: 120,
          computeCallFrequency: 8
        };
        set(profileRef, initialProfile);
        setProfile(initialProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("[Realtime DB Subscription Error]:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Mutation handler to push fields to remote db (with localized layout caching)
  const updateProfileFields = useCallback(async (fieldsToUpdate) => {
    if (!userId) return;

    // Eagerly update local React state for instantaneous UI response
    setProfile((prev) => ({ ...prev, ...fieldsToUpdate }));

    try {
      const profileRef = ref(realtimeDb, `users/${userId}/profile`);
      await update(profileRef, fieldsToUpdate);
    } catch (err) {
      console.error("[Realtime DB Update Error]:", err);
      throw err;
    }
  }, [userId]);

  // Telemetry logger to record token usage and API calls
  const logComputeUsage = useCallback(async (tokensConsumpted) => {
    if (!userId) return;

    try {
      const profileRef = ref(realtimeDb, `users/${userId}/profile`);
      const newTokensUsed = profile.tokensUsed + tokensConsumpted;
      const newFrequency = profile.computeCallFrequency + 1;
      
      const telemetryUpdates = {
        tokensUsed: newTokensUsed,
        computeCallFrequency: newFrequency
      };

      setProfile((prev) => ({ ...prev, ...telemetryUpdates }));
      await update(profileRef, telemetryUpdates);
    } catch (err) {
      console.error("[Realtime DB Telemetry Log Exception]:", err);
    }
  }, [userId, profile.tokensUsed, profile.computeCallFrequency]);

  return {
    profile,
    loading,
    updateProfileFields,
    logComputeUsage
  };
}
