import React, { useEffect, useRef, useState } from "react";
import { Mic, Loader2, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type AIState = "listening" | "thinking" | "speaking";

interface TranscriptMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export const LeftPanel: React.FC = () => {
  const [aiState, setAiState] = useState<AIState>("listening");
  const [transcript] = useState<TranscriptMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your SmartHire AI interviewer. Let's start with a coding problem.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Mocking AI state transitions for visual feedback testing
  useEffect(() => {
    const interval = setInterval(() => {
      setAiState((prev) => {
        if (prev === "listening") return "thinking";
        if (prev === "thinking") return "speaking";
        return "listening";
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4 border-r border-zinc-800 p-4 bg-zinc-950/50">
      {/* AI Presence & State */}
      <Card className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border-zinc-800 h-1/3">
        <div className="relative mb-4">
          {/* Avatar / Visual representation */}
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-800 relative z-10 overflow-hidden">
            {aiState === "listening" && (
              <Mic className="w-10 h-10 text-emerald-500 animate-pulse" />
            )}
            {aiState === "thinking" && (
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            )}
            {aiState === "speaking" && (
              <Volume2 className="w-10 h-10 text-teal-400" />
            )}
          </div>

          {/* Pulse Rings */}
          {aiState === "listening" && (
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
          )}
          {aiState === "speaking" && (
            <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-pulse scale-150" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center justify-center gap-2">
            SmartHire AI
          </h2>
          <p className="text-sm font-medium mt-1 uppercase tracking-wider">
            {aiState === "listening" && (
              <span className="text-emerald-500">Listening...</span>
            )}
            {aiState === "thinking" && (
              <span className="text-orange-500">Thinking...</span>
            )}
            {aiState === "speaking" && (
              <span className="text-teal-400">Speaking...</span>
            )}
          </p>
        </div>
      </Card>

      {/* Live Transcript */}
      <Card className="flex-1 flex flex-col bg-zinc-900/30 border-zinc-800 overflow-hidden">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Live Transcript
          </h3>
        </div>
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {transcript.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-semibold">
                  {msg.sender === "user" ? "You" : "AI"}
                </span>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[90%] text-sm ${
                    msg.sender === "user"
                      ? "bg-zinc-800 text-zinc-200 rounded-tr-sm"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
