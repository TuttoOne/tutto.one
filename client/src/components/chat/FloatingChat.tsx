import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatEngine } from "@/hooks/use-chat-engine";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { InputBar } from "./InputBar";
import { copy, useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { optionLabel } from "@/lib/chat-data";

export function FloatingChat() {
  const t = useT();
  const { locale } = usePreferences();
  const [open, setOpen] = useState(false);
  const messagesBottomRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isTyping,
    currentOptions,
    handleOptionSelect,
    handleTextInput,
  } = useChatEngine();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-[360px] max-w-[calc(100vw-3rem)] bg-background border border-border/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(520px, calc(100vh - 120px))" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-secondary/20 shrink-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{t(copy.chat.title)}</p>
                <p className="text-xs text-muted-foreground">{t(copy.chat.sub)}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={t(copy.chat.close)}
                data-testid="button-close-chat"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesBottomRef} />
            </div>

            <div className="p-3 border-t border-border/40 bg-background shrink-0">
              {currentOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(opt)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors font-medium"
                      data-testid={`button-chat-option-${opt.value}`}
                    >
                      {optionLabel(opt, locale)}
                    </button>
                  ))}
                </div>
              )}
              <InputBar onSend={handleTextInput} disabled={isTyping} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? t(copy.chat.close) : t(copy.chat.open)}
        data-testid="button-floating-chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
