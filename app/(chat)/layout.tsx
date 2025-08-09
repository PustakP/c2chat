"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { Menu, X } from "lucide-react";

// ui: responsive dashboard shell with mobile sidebar
export default function ChatShellLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* sidebar: responsive with mobile slide-in */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        w-80 md:w-72 lg:w-80 xl:w-96
        flex flex-col border-r bg-sidebar text-sidebar-foreground
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-xl md:shadow-none
        h-full
      `}>
        {/* hdr: branding + mobile close */}
        <div className="px-4 py-4 border-b flex items-center justify-between shrink-0">
          <div>
            <div className="font-accent text-xl">c2chat</div>
            <div className="text-xs opacity-70">minimal chat, warm sand</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-150"
            aria-label="close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>
        
        {/* content: sidebar items (no internal scroll) */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Sidebar />
        </div>
      </aside>
      
      {/* main: content area with mobile header */}
      <main className="flex-1 min-w-0 flex flex-col h-full">
        {/* mobile header with menu btn */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-all duration-150 hover:scale-105"
            aria-label="open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div className="font-accent text-lg">c2chat</div>
          <div className="w-9" /> {/* spacer for centering */}
        </div>
        
        {/* content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}


