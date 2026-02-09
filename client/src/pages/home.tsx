import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MessageBubble, TypingIndicator } from "@/components/chat/MessageBubble";
import { InputBar } from "@/components/chat/InputBar";
import { useChatEngine } from "@/hooks/use-chat-engine";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { 
    messages, 
    isTyping, 
    currentOptions, 
    handleOptionSelect, 
    handleTextInput,
    messagesEndRef 
  } = useChatEngine();

  return (
    <Layout className="flex flex-col h-[calc(100vh-64px)]">
      {/* Hero Quote Section - Only visible at top/start usually, but sticky header might cover. 
          Let's put it at the top of the chat container or layout */}
      
      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col">
        {/* Why Statement */}
        <div className="text-center py-8 md:py-12 space-y-4">
            <h1 className="text-2xl md:text-3xl font-serif text-foreground leading-tight max-w-xl mx-auto">
              "Helping businesses become machine-readable in an AI-first economy."
            </h1>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Controls Area */}
          <div className="p-4 bg-gradient-to-t from-white via-white to-transparent pt-10">
            {/* Options Buttons */}
            {currentOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {currentOptions.map((opt) => (
                  <motion.div
                    key={opt.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleOptionSelect(opt)}
                      className="bg-white hover:bg-secondary/50 border-primary/20 text-primary hover:text-primary-dark rounded-xl px-5 py-5 h-auto text-sm font-medium shadow-sm"
                    >
                      {opt.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <InputBar onSend={handleTextInput} disabled={currentOptions.length > 0 && !isTyping} />
            
            <div className="text-center mt-3 text-xs text-muted-foreground/60">
                Powered by a simple state machine (and Tutto's logic)
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
