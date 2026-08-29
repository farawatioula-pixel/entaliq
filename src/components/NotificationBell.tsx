"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import type { AppNotification } from "@/lib/marketplace-types";

const POLL_MS = 15000;

function describe(n: AppNotification): { text: string; href: string } {
  const payload = n.payload as Record<string, string>;
  switch (n.type) {
    case "new_order":
      return { text: "You received a new order", href: `/orders/${payload.order_id}` };
    case "order_status_changed":
      return {
        text: `Order status changed to ${String(payload.status).replace("_", " ")}`,
        href: `/orders/${payload.order_id}`,
      };
    case "new_message":
      return { text: "New message", href: `/messages/${payload.conversation_id}` };
    default:
      return { text: "Notification", href: "/orders" };
  }
}

export function NotificationBell() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function poll() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUserId(user?.id ?? null);
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(15);
      if (active && data) setNotifications(data as AppNotification[]);
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!userId) return null;

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function handleOpen() {
    setOpen((v) => !v);
    if (unreadCount === 0) return;
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-cyan-deep"
      >
        <span aria-hidden>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-sm border border-line bg-surface shadow-lg">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-600">No notifications yet.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-line overflow-y-auto">
              {notifications.map((n) => {
                const { text, href } = describe(n);
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(href);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-fg transition-colors hover:bg-paper"
                    >
                      {text}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
