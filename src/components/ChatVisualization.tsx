import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw, Radio, Server, MessageSquare, Terminal } from "lucide-react";
import { Message } from "../types";

const SUGGESTED_PROMPTS = [
  "Tower 2 safety checklist status?",
  "Biometric attendance telemetry?",
  "Suggest a contingency for rain delays.",
  "Razorpay ledger audit ledger keys?"
];

export default function ChatVisualization() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "model",
      text: "ProSite360 Core Operating System Assistant initialized. Connected to site telemetry logs and Gemini Project Intelligence API. Ask me anything about site DPR, logistics, workforce attendance, or Razorpay transactional clearance logs.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setErrorString(null);

    try {
      // Build conversation array for Express backend format
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: "model",
            text: data.text,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed key telemetry parsing.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorString("System communication error. Verify server state.");
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: "model",
          text: "⚠️ System offline or backend credentials not detected. Proceeding in localized demo environment. Telemetry details suggests: 'Check if GEMINI_API_KEY is configured in your Secrets panel.' Only simulated reports can be generated.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[520px]">
      {/* Visual Header */}
      <div className="p-4 bg-slate-950/90 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse z-10" />
            <span className="absolute w-3.5 h-3.5 bg-cyan-400/20 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-display font-semibold text-slate-100 leading-none">ProSite360 System Assistant</h4>
              <span className="font-mono text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-1.5 py-0.5 rounded uppercase">LIVE INTELLIGENCE</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">SYS_CORE_V1 // MODEL @google/gemini-3.5-flash</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-white/5">
          <Server className="w-3.5 h-3.5 text-zinc-500" />
          <span>PORT: 3000</span>
        </div>
      </div>

      {/* Messages Feed Area */}
      <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/40 bg-dot-matrix flex flex-col">
        {messages.map((m) => {
          const isModel = m.role === "model";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isModel ? "self-start" : "self-end flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isModel
                    ? "bg-purple-950/50 border-purple-800/30 text-purple-400"
                    : "bg-blue-950/50 border-blue-800/30 text-blue-400"
                }`}
              >
                {isModel ? <Terminal className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  isModel
                    ? "bg-zinc-900/90 border-white/5 text-zinc-300"
                    : "bg-indigo-950/70 border-indigo-900/40 text-slate-100"
                }`}
              >
                {/* Custom formatted markdown text splits built directly with whitespace preservation */}
                <p className="whitespace-pre-line">{m.text}</p>
                <span className="block mt-1.5 text-[9px] text-zinc-500 font-mono text-right">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 self-start max-w-[80%]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-950/50 border border-purple-800/30 text-purple-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-900/90 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="font-mono text-[11px] text-zinc-400">Processing live telemetry matrices via Gemini...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Deck */}
      <div className="p-3 bg-slate-950/20 border-t border-white/5">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSendMessage(p)}
              className="glass-btn font-mono text-[10px] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-zinc-950 border-t border-white/5 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type telemetry query or ask for construction advisory status..."
          className="flex-1 bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="glass-btn-primary disabled:opacity-40 text-slate-100 rounded-xl px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-indigo-900/10"
        >
          <span>TRANSMIT</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
