/**
 * Mobile Logo Component
 * Displays logo on mobile devices
 * Optimized with React.memo
 */

import { memo } from "react";

interface MobileLogoProps {
  appName?: string;
  className?: string;
}

export const MobileLogo = memo<MobileLogoProps>(
  ({ appName = "SmartHire AI", className = "" }) => {
    return (
      <div className={`flex flex-col items-center mb-8 md:hidden ${className}`}>
        <div className="w-10 h-10 mb-4 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold">
          SH
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">{appName}</h1>
      </div>
    );
  },
);

MobileLogo.displayName = "MobileLogo";
