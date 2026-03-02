import React, { useState } from "react";
import { ArrowRight, Video, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const GuestDashboard: React.FC = () => {
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      navigate(`/interview?code=${inviteCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <div className="w-16 h-16 mb-8 rounded-2xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          SH
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4">
          Welcome to your <span className="text-emerald-400">AI Interview</span>
        </h1>
        <p className="text-zinc-400 text-lg text-center max-w-2xl mb-12">
          Experience a fair, unbiased, and interactive technical interview
          driven by next-generation AI. Please enter your unique invitation code
          to begin.
        </p>

        {/* Join Form */}
        <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Invitation Code
              </label>
              <Input
                placeholder="e.g. INT-1234-ABCD"
                className="h-12 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 text-center tracking-widest uppercase"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-base transition-all group"
              disabled={!inviteCode.trim()}
            >
              Enter Waiting Room
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Video className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">
              Live AI Presence
            </h3>
            <p className="text-sm text-zinc-500">
              Interact naturally via voice and video with our responsive AI
              interviewer.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">
              Flexible Timing
            </h3>
            <p className="text-sm text-zinc-500">
              Take the interview on your own schedule. No timezone coordination
              needed.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">
              Unbiased Evaluation
            </h3>
            <p className="text-sm text-zinc-500">
              Standardized, objective scoring based entirely on your skills and
              responses.
            </p>
          </div>
        </div>

        {/* Recruiter Login Link */}
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500">
            Are you a recruiter?{" "}
            <a
              href="/login"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Sign in to your dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
