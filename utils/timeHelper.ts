import { dayjs } from '@/utils/dayjs';
export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const parseSec = (seconds: number): FormattedRes => {
  const duration = dayjs.duration(seconds, 'seconds');
  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };
};

export const formatDateTime = (input: string): string =>
  dayjs(input).format('YYYY/MM/DD HH:mm:ss');
