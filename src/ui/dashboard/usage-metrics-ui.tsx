'use client';
import { Progress } from '@/components/ui/progress';
import { CircleAlert } from 'lucide-react';
import React from 'react';

type UsageMetric = {
  label: string;
  value: number;
  max: number;
};
type Props = {
  metrics: UsageMetric[];
};
const UsageMetricsUI = ({ metrics }: Props) => {
  const valueToPercentage = (val: number, max: number) => {
    return Math.floor((val / max) * 100);
  };
  return (
    <ul className='flex w-full flex-col gap-8'>
      {metrics.map((metric: UsageMetric) => (
        <div key={metric.label} className='flex flex-col gap-2'>
          <div className="flex gap-2">
            <span className="text-text">{metric.label}: {metric.value} / {metric.max}</span>
            {
              metric.value > metric.max && <CircleAlert className="size-4 text-error"/>
            }
          </div>
          <Progress
            value={valueToPercentage(metric.value, metric.max)}
            className='w-[100%] lg:w-[50%]'
          />
        </div>
      ))}
    </ul>
  );
};

export default UsageMetricsUI;
