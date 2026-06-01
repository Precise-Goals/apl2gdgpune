import { useState, useEffect, useCallback } from "react";
import { firestore } from "../firebase";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

export function useMellowChat(userId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [sending, setSending] = useState(false);

  // Initialize and load the first 25 messages
  const loadInitialMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setMessages([]);
    setLastDoc(null);
    setHasMore(true);

    try {
      const messagesRef = collection(firestore, `users/${userId}/chats`);
      const q = query(
        messagesRef, 
        orderBy("timestamp", "desc"), 
        limit(25)
      );

      const querySnapshot = await getDocs(q);
      const fetched = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });

      // Reverse to render chronologically in UI (bottom to top)
      setMessages(fetched.reverse());
      
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 25);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("[Firestore Chat Initial Load Error]:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages]);

  // Pagination fetch handler for infinite scroll / "load older"
  const fetchMoreMessages = async () => {
    if (loadingMore || !hasMore || !lastDoc || !userId) return;
    setLoadingMore(true);

    try {
      const messagesRef = collection(firestore, `users/${userId}/chats`);
      const q = query(
        messagesRef, 
        orderBy("timestamp", "desc"), 
        startAfter(lastDoc),
        limit(25)
      );

      const querySnapshot = await getDocs(q);
      const fetched = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });

      if (querySnapshot.docs.length > 0) {
        // Prepend older messages
        setMessages((prev) => [...fetched.reverse(), ...prev]);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 25);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("[Firestore Chat Paginate Load Error]:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Mutator helper to append messages
  const appendMessage = async (role, content, companion = null, sources = null) => {
    if (!userId) return null;

    try {
      const messagesRef = collection(firestore, `users/${userId}/chats`);
      const newMsg = {
        role,
        content,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        ...(companion && { companion }), // Associate dynamic companion preference
        ...(sources && { sources }) // Store scraped RAG source lists
      };

      const docRef = await addDoc(messagesRef, newMsg);
      const created = { id: docRef.id, ...newMsg, timestamp: { toDate: () => new Date() } };

      // Update state instantly for fluid UX
      setMessages((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("[Firestore Message Append Error]:", err);
      throw err;
    }
  };

  // Send Message encapsulating server POST + UI sync
  const sendMessage = async (
    queryText, 
    profile, 
    emotionalAspects, 
    ragToggles, 
    logComputeUsage,
    clearFeedOnSend = false
  ) => {
    if (!userId || !queryText.trim() || sending) return;
    setSending(true);

    // If starting a fresh chat slate in the UI, we can clear the active feed state array
    if (clearFeedOnSend) {
      setMessages([]);
    }

    try {
      // 1. Add user message locally and to Firestore
      await appendMessage("user", queryText, profile?.characterPreference);

      // 2. Trigger compute consumption log callback
      if (logComputeUsage) {
        const tokensConsumpted = Math.floor(Math.random() * 45) + 30;
        await logComputeUsage(tokensConsumpted);
      }

      // 3. Post prompt matrix to our serverless endpoint
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...(clearFeedOnSend ? [] : messages.map(m => ({ role: m.role, content: m.content }))),
            { role: "user", content: queryText }
          ],
          userProfile: profile,
          emotionalAspects: emotionalAspects,
          toggles: ragToggles,
          queryText: queryText
        })
      });

      if (!chatRes.ok) throw new Error("Vercel Serverless proxy completed error.");

      const chatData = await chatRes.json();
      const aiReply = chatData.choices?.[0]?.message?.content || "Companion routing network error.";
      const fetchedSources = chatData.sources || [];

      // 4. Add assistant response locally and to Firestore
      await appendMessage("assistant", aiReply, profile?.characterPreference, fetchedSources);
    } catch (err) {
      console.error("[sendMessage Hook Error]:", err);
      await appendMessage(
        "assistant",
        "⚠️ Server proxy connection error. Please verify dynamic scraper settings.",
        profile?.characterPreference,
        []
      );
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    sending,
    fetchMoreMessages,
    appendMessage,
    sendMessage,
    reloadChat: loadInitialMessages
  };
}
