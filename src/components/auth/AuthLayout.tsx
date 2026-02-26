import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 font-sans text-zinc-50 overflow-hidden">
      {/* 
        LEFT SIDE (Branding & Visuals)
        Hidden on mobile, takes 50% width on md+ screens
      */}
      <div className="hidden md:flex flex-col relative w-1/2 p-12 border-r border-zinc-900 justify-between items-start">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-sm">
            SH
          </div>
          <span className="font-bold text-2xl tracking-tight text-zinc-100">
            SmartHire AI
          </span>
        </div>

        {/* Abstract Graphic / Marketing Copy */}
        <div className="relative z-10 max-w-md mt-auto mb-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Recruitment, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              amplified by intelligence.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Create precise engineering interviews in seconds. Analyze thousands
            of candidates autonomously. Let AI handle the screening, so you can
            focus on building the team.
          </p>

          {/* Social Proof Elements */}
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i * 123}&backgroundColor=18181b`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-zinc-400">
              Join <span className="text-zinc-200">10,000+</span> elite
              engineering teams.
            </div>
          </div>
        </div>
      </div>

      {/* 
        RIGHT SIDE (Form Content) 
        Full width on mobile, 50% width on md+ screens
      */}
      <div className="flex flex-col flex-1 items-center justify-center p-8 relative">
        <div className="w-full max-w-[420px] flex flex-col items-stretch z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
