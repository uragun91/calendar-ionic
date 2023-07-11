import { eachWeekOfInterval, max, min } from 'date-fns';
import { GaleCalendarOptions } from './models/calendar-options.model';

export function mergeDates(
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
