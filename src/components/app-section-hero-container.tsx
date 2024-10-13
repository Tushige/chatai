import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'
import GridPattern from './ui/grid-pattern'

export default function AppSectionHeroContainer({
  children,
  className
}:{
  children: ReactNode,
  className?: string
}) {
  return (
    <div className={cn("relative flex flex-col px-4 py-8 lg:px-8 bg-background-secondary", className)}>
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          '[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]'
        )}
      />
      {children}
    </div>
  )
}
