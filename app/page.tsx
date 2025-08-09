"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chat-store";
import { generateReadableId } from "@/lib/utils";
import { SendHorizonal, Loader2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createChat, sendMessage } = useChatStore();

  const handleFirstMessage = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // gen: create new chat with readable id
      const slug = generateReadableId();
      await createChat(slug);
      
      // nav: redirect to new chat and send first message
      router.push(`/chat/${slug}`);
      
      // msg: send the initial message after navigation
      setTimeout(() => {
        sendMessage(slug, input.trim());
      }, 100);
    } catch (error) {
      console.error("failed to create chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFirstMessage(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl lg:max-w-3xl mx-auto animate-in fade-in duration-700">
        {/* hero: main heading with animations */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-accent text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-4 animate-in slide-in-from-bottom duration-500">
            c2chat
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 animate-in slide-in-from-bottom duration-700 delay-150">
            c2: clean and concise
          </p>
          <p className="text-xl md:text-2xl mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
            What would you like to know today?
          </p>
        </div>

        {/* form: responsive input with enhanced styling */}
        <form onSubmit={handleFirstMessage} className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom duration-700 delay-500">
          <div className="glass rounded-xl p-4 md:p-6 border hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
            <TextareaAutosize
              minRows={3}
              maxRows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="ask anything..."
              className="w-full bg-transparent outline-none resize-none text-lg md:text-xl placeholder:text-muted-foreground/60 focus-ring"
              autoFocus
            />
          </div>
          
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 touch-target"
            >
              {isLoading ? (
                <Loader2 className="size-4 md:size-5 animate-spin" />
              ) : (
                <SendHorizonal className="size-4 md:size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              )}
              <span className="text-sm md:text-base font-medium">start chatting</span>
            </button>
          </div>
        </form>

        {/* tip: keyboard shortcuts */}
        <p className="text-center text-sm md:text-base text-muted-foreground mt-8 animate-in fade-in duration-700 delay-700">
          press <kbd className="px-2 py-1 bg-muted rounded text-xs">enter</kbd> to send, <kbd className="px-2 py-1 bg-muted rounded text-xs">shift+enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
