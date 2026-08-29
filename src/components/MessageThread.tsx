"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/marketplace-types";

const POLL_MS = 4000;

export function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function poll() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    }

    async function markRead() {
      const supabase = createClient();
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .is("read_at", null);
    }

    markRead();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [conversationId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const content = text.trim();
    if (!content) return;
    setSending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, content })
      .select()
      .single();
    setSending(false);
    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setText("");
    }
  }

  return (
    <div className="flex h-[60vh] flex-col rounded-sm border border-line bg-surface">
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-neutral-500">
            Say hello to start the conversation.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-sm px-4 py-2.5 text-sm ${
                  mine ? "bg-red text-white" : "bg-paper text-fg"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-line px-4 py-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Write a message..."
          className="flex-1 rounded-sm border border-line bg-surface px-4 py-2.5 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
