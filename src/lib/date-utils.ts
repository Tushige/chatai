import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const diffForHumans = (t) => {
  return dayjs(t).fromNow();
};
export const humanFriendlyDate = (t) => {
  return dayjs(t).format('LLLL');
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