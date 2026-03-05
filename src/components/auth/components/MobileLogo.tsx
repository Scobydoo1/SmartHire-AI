/**
 * Mobile Logo Component
 * Displays logo on mobile devices
 * Optimized with React.memo
 */

import { memo } from 'react'
import { Link } from 'react-router-dom'

interface MobileLogoProps {
  appName?: string
  className?: string
}

export const MobileLogo = memo<MobileLogoProps>(({ appName = 'SmartHire AI', className = '' }) => {
  return (
    <Link
      to="/"
      className={`mb-8 flex flex-col items-center md:hidden ${className} group`}
      aria-label="SmartHire AI – go to home"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-zinc-950">
        SH
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 transition-colors group-hover:text-emerald-500 dark:text-zinc-100 dark:group-hover:text-emerald-400">
        {appName}
      </h1>
    </Link>
  )
})

MobileLogo.displayName = 'MobileLogo'
