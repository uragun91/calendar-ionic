import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  addDays,
  addMonths,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  startOfMonth,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { mergeDates } from '../../utils';

@Component({
  selector: 'gale-months-slider',
  templateUrl: './months-slider.component.html',
  styleUrls: ['./months-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      this.monthStarts = mergeDates(
        monthStartForViewDate,
        this.monthStarts,
        this.calendarOptions.weekStart
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
    const sliderOptions: SwiperOptions = {
      initialSlide: 1,
    };
    Object.assign(this.swiperContainerRef.nativeElement, sliderOptions);
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
}
