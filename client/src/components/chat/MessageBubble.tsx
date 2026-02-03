import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/chat-data";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[75%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {!isUser && (
          <Avatar className="w-8 h-8 mt-1 mr-3 border border-border/50 shadow-sm">
            <AvatarImage src="/images/daniel-avatar.png" alt="Daniel" />
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
        )}
        
        <div
          className={cn(
            "px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "bg-secondary text-secondary-foreground rounded-tr-sm"
              : "bg-white border border-border/40 text-foreground rounded-tl-sm"
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex w-full mb-4 justify-start"
    >
      <div className="flex items-center">
        <Avatar className="w-8 h-8 mr-3 opacity-80">
           <AvatarImage src="/images/daniel-avatar.png" alt="Daniel" />
           <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <div className="bg-white border border-border/40 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
          <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
