import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import {
  addDays,
  addMonths,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  max,
  min,
  startOfMonth,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import { GaleCalendarOptions } from '../gale-calendar/gale-calendar.component';

@Component({
  selector: 'gale-months-slider',
  templateUrl: './months-slider.component.html',
  styleUrls: ['./months-slider.component.scss'],
})
export class MonthsSliderComponent implements OnInit {
  @Input() selectedDate!: Date;
  @Input() calendarOptions!: GaleCalendarOptions;

  @ViewChild('swiper') swiperContainerRef!: ElementRef<SwiperContainer>;

  set viewDate(date: Date) {
    const monthStartForViewDate = eachMonthOfInterval({
      start: startOfMonth(addMonths(date, -1)),
      end: endOfMonth(addMonths(date, 1)),
    });

    if (!this.monthStarts.length) {
      this.monthStarts = monthStartForViewDate;
    } else {
      this.monthStarts = this.mergeDates(
        monthStartForViewDate,
        this.monthStarts
      );
    }

    this.monthsSlides = this.generateMonthSlidesFromMonthStarts(
      this.monthStarts
    );
  }

  public monthsSlides: Date[][][] = [];
  private monthStarts: Date[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate.currentValue) {
      this.viewDate = this.selectedDate;
    }
  }

  ngAfterViewInit(): void {
    this.swiperContainerRef.nativeElement.initialize();
  }

  ngOnInit() {}

  private generateMonthSlidesFromMonthStarts(monthStart: Date[]): Date[][][] {
    return monthStart.map((monthStart) => {
      return this.getMonthWeeksForTheDate(monthStart);
    });
  }

  private getMonthWeeksForTheDate(date: Date): Date[][] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const weeksStartDates = eachWeekOfInterval(
      { start, end },
      { weekStartsOn: this.calendarOptions.weekStart }
    );

    return weeksStartDates.map((weekStart: Date) => {
      return [1, 2, 3, 4, 5, 6].reduce(
        (acc: Date[]) => {
          acc.push(addDays(acc[acc.length - 1], 1));
          return acc;
        },
        [weekStart]
      );
    });
  }

  private mergeDates(date1: Date[], date2: Date[]): Date[] {
    return eachWeekOfInterval(
      {
        start: min([...date1, ...date2]),
        end: max([...date1, ...date2]),
      },
      {
        weekStartsOn: this.calendarOptions.weekStart,
      }
    );
  }
}
