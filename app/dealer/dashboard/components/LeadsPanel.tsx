import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Chat {
  id: string;
  buyer_name: string;
  car_title: string;
  last_message: string;
  last_time: string;
}

interface Message {
  id: string;
  sender: string;
  message: string;
  created_at: string;
}

export default function LeadsPanel({ dealerId }: { dealerId: string }) {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user info (simulate or replace with actual auth logic)
    async function fetchUser() {
      // Replace with actual user fetch if needed
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);
  useEffect(() => {
    async function fetchChats() {
      setLoadingChats(true);
      const supabase = (await import("@/lib/supabase/client")).createClient();
      if (!user) return;
      const { data: chats, error } = await supabase
        .from("chats")
        .select(`
          id,
          created_at,
          car:car_id ( id, title ),
          buyer:buyer_id ( id, email )
        `)
        .eq("dealer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        setChats([]);
      } else {
        setChats(chats || []);
      }
      setLoadingChats(false);
    }
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedChat) return;
      setLoadingMessages(true);
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", selectedChat.id)
        .order("created_at", { ascending: true });
      if (!error && messages) setMessages(messages);
      else setMessages([]);
      setLoadingMessages(false);
    }
    fetchMessages();
    // Realtime subscription
    if (!selectedChat) return;
    let channel: any;
    (async () => {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${selectedChat.id}`
          },
          payload => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();
    })();
    return () => {
      if (channel) {
        (async () => {
          const supabase = (await import("@/lib/supabase/client")).createClient();
          supabase.removeChannel(channel);
        })();
      }
    };
  }, [selectedChat]);

  async function sendMessage() {
    if (!input.trim() || !selectedChat || !user) return;
    setSending(true);
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.from("messages").insert({
      chat_id: selectedChat.id,
      sender_id: user.id,
      message: input.trim(),
    });
    setInput("");
    setSending(false);
    // Refetch messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", selectedChat.id)
      .order("created_at", { ascending: true });
    setMessages(messages || []);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Chat List */}
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Leads Inbox</h2>
        <div className="space-y-2">
          {loadingChats ? (
            <div className="text-muted-foreground text-sm">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-muted-foreground text-sm bg-card border border-border rounded-xl p-6 text-center">
              No leads yet. You’ll see buyer inquiries here.
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`bg-card border border-border rounded-xl p-4 hover:bg-muted/50 transition cursor-pointer ${selectedChat?.id === chat.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="font-medium text-base mb-1">{chat.buyer_name}</div>
                <div className="text-sm text-muted-foreground mb-1">{chat.car_title}</div>
                <div className="text-xs text-muted-foreground truncate">{chat.last_message}</div>
                <div className="text-xs text-muted-foreground text-right mt-1">{new Date(chat.last_time).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Chat Window */}
      <div className="md:col-span-2">
        {selectedChat ? (
          <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col" style={{ minHeight: 400 }}>
            <div className="mb-4">
              <div className="text-lg font-semibold">{selectedChat.buyer_name}</div>
              <div className="text-sm text-muted-foreground">{selectedChat.car_title}</div>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {loadingMessages ? (
                <div className="text-muted-foreground text-sm">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-muted-foreground text-sm">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg px-3 py-2 max-w-xs ${msg.sender === "dealer" ? "bg-primary/10 ml-auto text-right" : "bg-muted/40"}`}
                  >
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-background"
                placeholder="Type your reply..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              />
              <Button onClick={sendMessage} disabled={sending || !input.trim()}>
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 h-full flex items-center justify-center text-muted-foreground text-sm" style={{ minHeight: 400 }}>
            Select a lead to view messages.
          </div>
        )}
      </div>
    </div>
  );
}
