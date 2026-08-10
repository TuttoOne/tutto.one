import { useState } from "react";
import { copy, useT } from "@/lib/i18n";
import { Send, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const t = useT();
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mt-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder={t(copy.chat.placeholder)}
        className="w-full px-5 py-4 pr-12 rounded-full border border-border/60 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] placeholder:text-muted-foreground/60"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!text.trim() || disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    </form>
  );
}
