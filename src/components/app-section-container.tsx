import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

export default function AppSectionContainer({
  children,
  className
}:{
  children: ReactNode,
  className?: string
}) {
  return (
    <div className={cn("container flex flex-col px-4 py-4 lg:py-8 lg:px-8", className)}>
      {children}
    </div>
  )
}
