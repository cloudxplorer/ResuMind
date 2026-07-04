
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageSquare, Plus, Trash2, Sparkles, User, Bot } from "lucide-react";
import { useStore, uid } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Improve my projects section",
  "Rewrite my summary",
  "Why is my ATS score low?",
  "Tailor my resume for Google",
  "Generate a cover letter",
  "What skills am I missing for a Senior SWE role?",
];

export function ChatView() {
  const { activeResume, jobDescriptions, activeJobId, conversations, activeConversationId, setActiveConversation, createConversation, appendMessage, updateMessage, deleteConversation, log } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeConversationId) ?? conversations[0];

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, sending]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    let conv = active;
    if (!conv) {
      const id = createConversation();
      conv = useStore.getState().conversations.find((c) => c.id === id)!;
      setActiveConversation(id);
    }
    const userMsg: ChatMessage = { id: uid("msg"), role: "user", content, ts: Date.now() };
    const pendingMsg: ChatMessage = { id: uid("msg"), role: "assistant", content: "", ts: Date.now(), pending: true };
    appendMessage(conv.id, userMsg);
    appendMessage(conv.id, pendingMsg);
    setInput("");
    setSending(true);
    try {
      const history = [...(conv.messages ?? []), userMsg].map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "chat", payload: { messages: history, resumeData: resume.data, jobDescription: job?.content } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      updateMessage(conv.id, pendingMsg.id, { content: data.reply || "I couldn't process that.", pending: false });
      log("ai.chat", {});
    } catch (e) {
      updateMessage(conv.id, pendingMsg.id, { content: `Error: ${e instanceof Error ? e.message : "failed"}`, pending: false });
      toast.error("Chat failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto h-[calc(100vh-3.5rem-3rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Context-aware coach. Sees your resume {job ? `& ${job.title}` : ""}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { createConversation(); toast.success("New conversation"); }}><Plus className="h-4 w-4" /> New</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 flex-1 min-h-0">
        {}
        <Card className="h-full hidden lg:flex flex-col">
          <CardContent className="p-2 flex-1 overflow-y-auto scrollbar-thin">
            {conversations.length === 0 && <p className="text-xs text-muted-foreground p-2">No conversations.</p>}
            {conversations.map((c) => (
              <div key={c.id} className={cn("group flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm", c.id === active?.id ? "bg-accent" : "hover:bg-accent/60")} onClick={() => setActiveConversation(c.id)}>
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1">{c.title}</span>
                <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </CardContent>
        </Card>

        {}
        <Card className="flex flex-col h-full min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {(!active || active.messages.length === 0) && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-4"><Sparkles className="h-6 w-6" /></div>
                <p className="text-lg font-medium">Ask anything about your resume</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">I can rewrite sections, explain your score, tailor to a role, or draft a cover letter.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-lg w-full">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-left text-sm p-3 rounded-lg border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <AnimatePresence initial={false}>
              {active?.messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0"><Bot className="h-4 w-4" /></div>}
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    {m.pending ? <span className="flex items-center gap-1.5 text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…</span> : m.content}
                  </div>
                  {m.role === "user" && <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><User className="h-4 w-4" /></div>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="border-t border-border p-3 shrink-0">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Message your AI coach… (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="resize-none min-h-[44px] max-h-32"
              />
              <Button size="icon" className="h-10 w-10 shrink-0" onClick={() => send()} disabled={sending || !input.trim()}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
