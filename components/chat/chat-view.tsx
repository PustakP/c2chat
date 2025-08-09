"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore, getChatDescription } from "@/store/chat-store";
import { SendHorizonal, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { MarkdownMessage } from "./markdown-message";

type Props = { slug: string };

// ui: main chat area
export function ChatView({ slug }: Props) {
  const {
    ensureChatBySlug,
    messages,
    sendMessage,
    input,
    setInput,
    isLoading,
  } = useChatStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUserScrolledUpRef = useRef(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    // ux: ensure chat exists and load messages
    ensureChatBySlug(slug);
  }, [slug, ensureChatBySlug]);

  // fx: improved autoscroll behavior
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ux: only autoscroll if user hasn't scrolled up manually
    if (!isUserScrolledUpRef.current) {
      // smooth scroll to bottom with slight delay for new messages
      setTimeout(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [messages.length]);

  // fx: detect user scrolling to prevent auto-scroll interruption
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      isUserScrolledUpRef.current = !isAtBottom;
      setShowScrollToBottom(!isAtBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(slug, input.trim());
    }
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
      isUserScrolledUpRef.current = false;
      setShowScrollToBottom(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* hdr: chat title + loading state - hidden on mobile (shown in layout) */}
      <header className="hidden md:flex px-4 lg:px-6 border-b h-14 items-center justify-between bg-background flex-shrink-0">
        <div className="font-accent text-lg lg:text-xl truncate">
          {(() => {
            const chat = useChatStore.getState().chats.find((c) => c.slug === slug);
            return chat ? getChatDescription(chat) : slug;
          })()}
        </div>
        {isLoading && (
          <div className="inline-flex items-center gap-2 text-xs opacity-70 animate-pulse">
            <Loader2 className="size-4 animate-spin" /> thinking
          </div>
        )}
      </header>
      
      {/* msgs: chat messages with working scrolling */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={containerRef}
          className="h-full overflow-y-auto p-4 md:p-6 lg:p-8"
        >
          <div className="space-y-4 md:space-y-6">
            {messages.map((m, idx) => (
              <div
                key={`${m.id}-${idx}`}
                className={cn(
                  "flex animate-in slide-in-from-bottom-4 duration-500",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%]",
                    "rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm",
                    "transform transition-all duration-200 hover:scale-[1.01] hover:shadow-md",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50"
                  )}
                >
                  {m.role === "assistant" ? (
                    <MarkdownMessage
                      content={m.content}
                      className="text-sm md:text-base leading-relaxed"
                    />
                  ) : (
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* btn: scroll to bottom indicator */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 md:right-6 lg:right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="scroll to bottom"
          >
            <ChevronDown className="size-4" />
          </button>
        )}
      </div>
      
      {/* input: full width message form */}
      <div className="border-t p-3 md:p-4 lg:p-6 bg-background flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) sendMessage(slug, input.trim());
          }}
        >
          <div className="flex gap-3 items-end w-full">
            <TextareaAutosize
              minRows={1}
              maxRows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="ask anything..."
              className="flex-1 bg-card border border-border rounded-xl px-4 py-3 outline-none resize-none text-sm md:text-base placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4 transition-transform duration-150" />
              )}
              <span className="hidden sm:inline">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


