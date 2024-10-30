import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  diffForHumans,
  humanFriendlyDate,
  formattedTime,
  simpleDate
} from '@/lib/date-utils';

const REFRESH_PERIOD = 3000;

type Props = {
  timestamp: number;
  className?: string;
};

export const AppRelativeDate = ({ timestamp }: Props) => {
  const [dateValue, setDateValue] = useState(diffForHumans (timestamp))
  useEffect(() => {
    setInterval(() => {
      setDateValue(diffForHumans(timestamp));
    }, REFRESH_PERIOD);
  }, [timestamp]);
  return (
    <span title={humanFriendlyDate (timestamp)}>{dateValue}</span>
  );
};

export const AppTime = ({ timestamp, className }: Props) => {
  const [dateValue, setDateValue] = useState(formattedTime(timestamp))
  useEffect(() => {
    setInterval(() => {
      setDateValue(formattedTime(timestamp));
    }, REFRESH_PERIOD);
  }, [timestamp]);
  return <span className={cn(className)}>{dateValue}</span>;
};

export const AppDate = ({ timestamp, className }: Props) => {
  return <span className={cn(className)}>{simpleDate(timestamp)}</span>;
};