'use client'
import { Progress } from '@/components/ui/progress'
import React from 'react'

type UsageMetric = {
  label: string,
  value: number,
  max: number
}
type Props = {
  metrics: UsageMetric[],
}
const UsageMetricsUI = ({
  metrics
}: Props) => { 
  const valueToPercentage = (val: number, max: number) => {
    return Math.floor((val / max) * 100)
  }
  return (

    <ul className="w-full flex flex-col gap-8">
      {
        metrics.map( (metric: UsageMetric) => (
          <div
            key={metric.label}
            className="flex flex-col gap-2"
          >
            {metric.label}: {metric.value} / {metric.max} 
            <Progress value={valueToPercentage(metric.value, metric.max)} className="w-[100%] lg:w-[50%]" />
          </div>
        ))
      }
    </ul>
  )
}

export default UsageMetricsUI