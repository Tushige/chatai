import React from 'react';

export const AppCtaButton = ({children}) => {
  return (
    <div className="text-sm lg:text-medium focus:ring-offset-3 relative inline-flex h-fit w-fit rounded-full border border-rose-100/20 bg-blue-200/10 px-4 py-2 text-rose-100 outline-none ring-rose-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-rose-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-rose-200/40 hover:text-rose-300 after:hover:bg-opacity-15 focus:ring-2">
      {children}
    </div>
  )
}