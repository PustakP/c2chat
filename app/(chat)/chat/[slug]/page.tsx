import { ChatView } from "@/components/chat/chat-view";
import { Suspense } from "react";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  // u: dynamic chat route (await params per next15)
  const { slug } = await params;
  return (
    <div className="min-w-0 h-full">
      <Suspense>
        <ChatView slug={slug} />
      </Suspense>
    </div>
  );
}


