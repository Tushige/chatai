import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
  title: string,
  description?: string,
  className?: string
}
const AppSectionTitle = ({
  title,
  description,
  className
}: Props) => {
  return (
    <div className={cn(className)}>
      <h2 className="font-medium text-2xl text-text-foreground">{title}</h2>
      <p className="mt-2 lg:mt-4 max-w-[42rem] text-sm text-secondary">{description}</p>
    </div>
  )
}

export default AppSectionTitle