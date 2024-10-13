import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

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
};

export const AppRelativeDate = ({ timestamp }: Props) => {
  return (
    <span title={humanFriendlyDate(timestamp)}>{diffForHumans(timestamp)}</span>
  );
};

export const simpleDate = (t) => {
  return dayjs(t).format('MM/DD/YYYY');
};
export const dateWithTime = (date: string) => {
  return dayjs(date).format('dddd, MMMM D, YYYY h:mm A');
};
export const timeFormat = (date: string, isTwentyFour?: boolean) => {
  if (isTwentyFour) {
    return dayjs(date).format('HH:mm');
  }
  return dayjs(date).format('h:mm A');
};
export const AppDate = ({ timestamp }: Props) => {
  return <span>{simpleDate(timestamp)}</span>;
};
