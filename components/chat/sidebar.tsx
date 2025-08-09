"use client";
import { useChatStore, getChatDescription } from "@/store/chat-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, generateReadableId } from "@/lib/utils";
import { Plus, Trash2, PencilLine, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// ui: sidebar with list + pagination
export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    chats,
    createChat,
    deleteChat,
    renameChat,
    isLoading,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
  } = useChatStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);

  const currentSlug = pathname?.split("/").pop();

  useEffect(() => {
    // fx: compute page size based on viewport and static chrome
    const compute = () => {
      // est: heights for header (top), list padding, and paginator (bottom)
      const headerHeight = 64; // px, approx
      const footerHeight = 64; // px, approx
      const perItem = 60; // px per row incl. margins
      const available = Math.max(0, window.innerHeight - headerHeight - footerHeight);
      const fit = Math.max(1, Math.floor(available / perItem));
      setPageSize(fit);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [setPageSize]);

  // no extra fetch here; pageSize setter already refetches appropriately (NR)

  return (
    <div className="flex flex-col h-full">
      {/* hdr: new chat btn + loading state */}
      <div className="p-4 border-b flex items-center gap-2">
        <button
          aria-label="new chat"
          onClick={async () => {
            const s = generateReadableId();
            await createChat(s);
            router.push(`/chat/${s}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="size-4" /> new
        </button>
        {isLoading && <Loader2 className="size-4 animate-spin ml-auto text-muted-foreground" />}
      </div>
      
      {/* list: chat items with proper spacing (no scroll) */}
      <div className="flex-1 overflow-y-hidden px-3 py-2 space-y-1">
        {chats.map((c) => (
          <div
            key={c.slug}
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-all duration-200 hover:translate-x-1",
              currentSlug === c.slug && "bg-accent shadow-sm"
            )}
          >
            <Link href={`/chat/${c.slug}`} className="flex-1 truncate min-w-0">
              <div className="text-sm font-medium truncate">
                {getChatDescription(c)}
              </div>
              <div className="text-xs opacity-60 truncate mt-1">
                {c.messages.length > 0 ? `${c.messages.length} messages` : "empty"} • {c.updatedAt && new Date(c.updatedAt).toLocaleDateString()}
              </div>
            </Link>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                aria-label="rename"
                onClick={async () => {
                  setRenamingId(c.id);
                  await renameChat(c.id);
                  setRenamingId(null);
                }}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors duration-150"
              >
                {renamingId === c.id ? <Loader2 className="size-4 animate-spin" /> : <PencilLine className="size-4" />}
              </button>
              <button
                aria-label="delete"
                onClick={async () => {
                  const next = await deleteChat(c.id);
                  if (currentSlug === c.slug && next) router.push(`/chat/${next.slug}`);
                }}
                className="p-1.5 rounded-md hover:bg-secondary hover:text-destructive transition-colors duration-150"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* pagination: bottom controls with proper spacing */}
      <div className="p-4 border-t flex items-center justify-between text-xs bg-sidebar/50">
        <button
          disabled={page === 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary disabled:opacity-50 transition-all duration-150 hover:scale-105 disabled:hover:scale-100"
        >
          <ChevronLeft className="size-3" /> prev
        </button>
        <div className="font-mono text-muted-foreground">
          {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </div>
        <button
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary disabled:opacity-50 transition-all duration-150 hover:scale-105 disabled:hover:scale-100"
        >
          next <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}


