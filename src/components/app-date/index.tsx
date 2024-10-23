import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { cn } from '@/lib/utils';

const REFRESH_PERIOD = 3000;

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const diffForHumans = (t) => {
  return dayjs(t).fromNow();
};
const humanFriendlyDate = (t) => {
  return dayjs(t).format('LLLL');
};

type Props = {
  timestamp: number;
  className?: string;
};

export const AppRelativeDate = ({ timestamp }: Props) => {
  const [dateValue, setDateValue] = useState(diffForHumans(timestamp))
  useEffect(() => {
    setInterval(() => {
      setDateValue(diffForHumans(timestamp));
    }, REFRESH_PERIOD);
  }, []);
  return (
    <span title={humanFriendlyDate(timestamp)}>{dateValue}</span>
  );
};

export const simpleDate = (t) => {
  return dayjs(t).format('MM/DD/YYYY');
};

export const dateWithTime = (date: string) => {
  return dayjs(date).format('dddd, MMMM D, YYYY h:mm A');
};

export const formattedTime = (timestamp: number) => {
  return dayjs(timestamp).format('LT');
}

export const timeFormat = (date: string, isTwentyFour?: boolean) => {
  if (isTwentyFour) {
    return dayjs(date).format('HH:mm');
  }
  return dayjs(date).format('h:mm A');
};

export const AppTime = ({ timestamp, className }: Props) => {
  const [dateValue, setDateValue] = useState(formattedTime(timestamp))
  useEffect(() => {
    setInterval(() => {
      setDateValue(formattedTime(timestamp));
    }, REFRESH_PERIOD);
  }, []);
  return <span className={cn(className)}>{dateValue}</span>;
};

export const AppDate = ({ timestamp, className }: Props) => {
  return <span className={cn(className)}>{simpleDate(timestamp)}</span>;
};