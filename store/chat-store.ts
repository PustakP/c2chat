"use client";
import { create } from "zustand";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type Chat = {
  id: string;
  slug: string;
  title?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type State = {
  chats: Chat[];
  messages: Message[];
  input: string;
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  // actions
  setInput: (v: string) => void;
  setPage: (v: number) => void;
  setPageSize: (v: number) => Promise<void>;
  ensureChatBySlug: (slug: string) => Promise<void>;
  createChat: (slug: string) => Promise<void>;
  deleteChat: (id: string) => Promise<Chat | null>;
  renameChat: (id: string) => Promise<void>;
  sendMessage: (slug: string, content: string) => Promise<void>;
};

// u: id helper
const rid = () => Math.random().toString(36).slice(2);

// u: get chat description helper
const getChatDescription = (chat: Chat): string => {
  if (chat.title) return chat.title;
  if (chat.messages.length > 0) {
    const firstMsg = chat.messages[0].content;
    return firstMsg.length > 50 ? firstMsg.slice(0, 50) + "..." : firstMsg;
  }
  return "new chat";
};

export const useChatStore = create<State>((set, get) => ({
  chats: [],
  messages: [],
  input: "",
  isLoading: false,
  page: 1,
  pageSize: 20,
  total: 0,
  setInput: (v) => set({ input: v }),
  setPage: async (v) => {
    set({ page: v });
    try {
      const res = await fetch(`/api/chats?page=${v}&pageSize=${get().pageSize}`);
      const data = await res.json();
      set({
        chats: data.chats.map((d: any) => ({
          id: d._id,
          slug: d.slug,
          title: d.title,
          messages: d.messages ?? [],
          createdAt: Date.parse(d.createdAt),
          updatedAt: Date.parse(d.updatedAt),
        })),
        total: data.total,
      });
    } catch {}
  },
  setPageSize: async (v) => {
    // fx: update page size based on viewport + refetch if needed (NR)
    const total = get().total;
    if (v === get().pageSize) return; // sk: avoid noop fetch on identical value
    const maxPage = Math.max(1, Math.ceil((total || 0) / Math.max(1, v)));
    const current = Math.min(get().page || 1, maxPage);
    set({ pageSize: Math.max(1, v) });
    await get().setPage(current);
  },
  ensureChatBySlug: async (slug) => {
    const existing = get().chats.find((c) => c.slug === slug);
    if (!existing) {
      await get().createChat(slug);
    } else {
      set({ messages: existing.messages });
    }
    try {
      const res = await fetch(`/api/chats/by-slug/${slug}`);
      if (res.ok) {
        const d = await res.json();
        const full = {
          id: d._id,
          slug: d.slug,
          title: d.title,
          messages: d.messages ?? [],
          createdAt: Date.parse(d.createdAt),
          updatedAt: Date.parse(d.updatedAt),
        } as Chat;
        set((s) => ({
          chats: [full, ...s.chats.filter((c) => c.slug !== slug)],
          messages: full.messages as any,
        }));
      }
    } catch {}
  },
  createChat: async (slug) => {
    try {
      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      const now = Date.now();
      const chat: Chat = { id: data.id, slug, messages: [], createdAt: now, updatedAt: now };
      set((s) => ({ chats: [chat, ...s.chats], total: s.total + 1 }));
    } catch {}
  },
  deleteChat: async (id) => {
    let next: Chat | null = null;
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
      set((s) => {
        const idx = s.chats.findIndex((c) => c.id === id);
        const copy = s.chats.slice();
        if (idx !== -1) {
          copy.splice(idx, 1);
        }
        next = copy[0] ?? null;
        return { chats: copy, total: Math.max(0, s.total - 1) };
      });
    } catch {}
    return next;
  },
  renameChat: async (id) => {
    set({ isLoading: true });
    try {
      const msgs = get().chats.find((c) => c.id === id)?.messages ?? [];
      const res = await fetch(`/api/chats/${id}/name`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: msgs }) });
      const data = await res.json();
      set((s) => ({
        chats: s.chats.map((c) => (c.id === id ? { ...c, title: data.title, updatedAt: Date.now() } : c)),
      }));
    } catch {}
    finally {
      set({ isLoading: false });
    }
  },
  sendMessage: async (slug, content) => {
    const user: Message = { id: rid(), role: "user", content, createdAt: Date.now() };
    set((s) => ({ input: "", messages: [...s.messages, user] }));
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content }),
      });
      const data = await res.json();
      const bot: Message = { id: rid(), role: "assistant", content: data.reply, createdAt: Date.now() };
      set((s) => ({ messages: [...s.messages, bot] }));
      
      // sync to chat record
      const updatedMessages = [...get().messages, bot];
      set((s) => ({
        chats: s.chats.map((c) => (c.slug === slug ? { ...c, messages: updatedMessages, updatedAt: Date.now() } : c)),
      }));

      // auto: generate title if this is the first exchange and no title exists
      const currentChat = get().chats.find((c) => c.slug === slug);
      if (currentChat && !currentChat.title && updatedMessages.length === 2) {
        // delay slightly to ensure chat is saved
        setTimeout(() => {
          get().renameChat(currentChat.id);
        }, 500);
      }
    } catch (e) {
      const err: Message = { id: rid(), role: "assistant", content: "error: failed to reply", createdAt: Date.now() };
      set((s) => ({ messages: [...s.messages, err] }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

export type { Chat, Message };
export { getChatDescription };


