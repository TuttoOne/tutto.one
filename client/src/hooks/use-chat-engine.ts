import { useState, useEffect, useRef } from "react";
import { CHAT_FLOWS, Message, ChatOption } from "@/lib/chat-data";

export function useChatEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    // Only start if empty
    if (messages.length === 0) {
      processStep("start");
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentOptions]);

  const processStep = async (stepId: string) => {
    const step = CHAT_FLOWS[stepId];
    if (!step) return;

    setCurrentOptions([]); // Hide options while typing
    setIsTyping(true);

    // Sequence messages with delays
    for (let i = 0; i < step.messages.length; i++) {
        // Variable delay based on text length for realism
        const delay = 400 + (step.messages[i].length * 15); 
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        addMessage({
            role: "assistant",
            content: step.messages[i]
        });
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
    // Add user selection as message
    addMessage({ role: "user", content: option.label });
    setCurrentOptions([]); // Clear options

    // Special handlers
    if (option.value === "open_calendar") {
        window.open("https://cal.com/tuttoone/15min", "_blank");
        // Loop back or end
        setTimeout(() => processStep("start"), 2000);
        return;
    }

    // Continue flow
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
        addMessage({ role: "assistant", content: data.reply });
      } catch {
        setIsTyping(false);
        addMessage({
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. You can book a call directly and we'll chat in person.",
        });
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
    messagesEndRef
  };
}
