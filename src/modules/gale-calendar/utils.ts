import {
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  max,
  min,
} from 'date-fns';
import { GaleCalendarOptions } from './models/calendar-options.model';

export function mergeWeekStartDates(
  date1: Date[],
  date2: Date[],
  weekStartsOn: GaleCalendarOptions['weekStart']
): Date[] {
  return eachWeekOfInterval(
    {
      start: min([...date1, ...date2]),
      end: max([...date1, ...date2]),
    },
    {
      weekStartsOn,
    }
  );
}

export function mergeMonthsStartDates(date1: Date[], date2: Date[]): Date[] {
  return eachMonthOfInterval({
    start: min([...date1, ...date2]),
    end: max([...date1, ...date2]),
  });
}

export function generateWeekDays(weekStart: number = 0): string[] {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const adjustedWeekdays = [
    ...weekdays.slice(weekStart),
    ...weekdays.slice(0, weekStart),
  ];
  return adjustedWeekdays;
}

export function getMonthNameOFDate(date: Date): string {
  return format(date, 'LLLL');
}
