/**
 * Mobile Logo Component
 * Displays logo on mobile devices
 * Optimized with React.memo
 */

import { memo } from "react";
import { Link } from "react-router-dom";

interface MobileLogoProps {
  appName?: string;
  className?: string;
}

export const MobileLogo = memo<MobileLogoProps>(
  ({ appName = "SmartHire AI", className = "" }) => {
    return (
      <Link
        to="/"
        className={`flex flex-col items-center mb-8 md:hidden ${className} group`}
        aria-label="SmartHire AI – go to home"
      >
        <div className="w-10 h-10 mb-4 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold">
          SH
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
          {appName}
        </h1>
      </Link>
    );
  },
);

MobileLogo.displayName = "MobileLogo";
