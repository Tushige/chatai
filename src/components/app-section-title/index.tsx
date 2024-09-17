import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
  title: string,
  description?: string,
  className?: string
}
const SectionTitle = ({
  title,
  description,
  className
}: Props) => {
  return (
    <div className={cn(className)}>
      <h2 className="font-medium text-2xl">{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default SectionTitle