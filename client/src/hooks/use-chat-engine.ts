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

  const handleTextInput = (text: string) => {
      // Simple fallback for open text input - in a real app this would go to LLM
      // For this mockup, we'll just acknowledge and redirect to start or specific flows
      addMessage({ role: "user", content: text });
      
      setIsTyping(true);
      setTimeout(() => {
          setIsTyping(false);
          addMessage({ 
              role: "assistant", 
              content: "That's an interesting point. While I'm just a scripted demo right now, I'd love to discuss this in person." 
          });
          setCurrentOptions([
              { label: "Book a chat", value: "contact" },
              { label: "Back to start", value: "start" }
          ]);
      }, 1000);
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
