import { useState, useEffect, useRef, useCallback } from "react";
import { CHAT_FLOWS, Message, ChatOption } from "@/lib/chat-data";

const WORD_DELAY = 30;

export function useChatEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      processStep("start");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentOptions]);

  const typeWords = useCallback((id: string, fullText: string): Promise<void> => {
    return new Promise((resolve) => {
      const words = fullText.split(" ");
      let current = 0;

      const interval = setInterval(() => {
        current++;
        const partial = words.slice(0, current).join(" ");
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: partial } : m))
        );
        if (current >= words.length) {
          clearInterval(interval);
          resolve();
        }
      }, WORD_DELAY);
    });
  }, []);

  const addMessageWithTyping = useCallback(async (content: string) => {
    const id = Math.random().toString(36).substring(7);
    const newMessage: Message = {
      id,
      timestamp: Date.now(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, newMessage]);
    await typeWords(id, content);
  }, [typeWords]);

  const processStep = async (stepId: string) => {
    const step = CHAT_FLOWS[stepId];
    if (!step) return;

    setCurrentOptions([]);
    setIsTyping(true);

    for (let i = 0; i < step.messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsTyping(false);
      await addMessageWithTyping(step.messages[i]);
      if (i < step.messages.length - 1) {
        setIsTyping(true);
      }
    }

    setIsTyping(false);

    if (step.options) {
      setCurrentOptions(step.options);
    } else if (step.next) {
      processStep(step.next);
    }
  };

  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      ...msg,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionSelect = (option: ChatOption) => {
    addMessage({ role: "user", content: option.label });
    setCurrentOptions([]);

    if (option.value === "open_calendar") {
      window.open("https://cal.com/tuttoone/15min", "_blank");
      setTimeout(() => processStep("start"), 2000);
      return;
    }

    processStep(option.value);
  };

  const handleTextInput = async (text: string) => {
    addMessage({ role: "user", content: text });
    setCurrentOptions([]);
    setIsTyping(true);

    try {
      const historyForApi = [
        ...messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setIsTyping(false);
      await addMessageWithTyping(data.reply);
    } catch {
      setIsTyping(false);
      await addMessageWithTyping(
        "Sorry, I'm having trouble connecting right now. You can book a call directly and we'll chat in person."
      );
    }

    setCurrentOptions([
      { label: "Book a call", value: "contact" },
      { label: "Back to start", value: "start" },
    ]);
  };

  return {
    messages,
    isTyping,
    currentOptions,
    handleOptionSelect,
    handleTextInput,
    messagesEndRef,
  };
}
