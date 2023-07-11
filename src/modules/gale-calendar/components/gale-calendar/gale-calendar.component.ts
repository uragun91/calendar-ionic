import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { addWeeks } from 'date-fns';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { generateWeekDays } from '../../utils';

@Component({
  selector: 'gale-calendar',
  templateUrl: './gale-calendar.component.html',
  styleUrls: ['./gale-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleCalendarComponent implements OnInit {
  @Input() startDate: Date = new Date();
  @Input() options?: Partial<GaleCalendarOptions> = {};

  calendarOptions: GaleCalendarOptions = {
    weekStart: 1,
  };

  config: SwiperOptions = {
    init: false,
    direction: 'horizontal',
    initialSlide: 1,
  };

  weekDays: string[] = [];

  // TODO: add this as input
  view: 'week' | 'month' = 'month';

  constructor() {}

  changeDate(): void {
    this.startDate = addWeeks(this.startDate, -2);
  }

  ngOnInit() {
    this.calendarOptions = { ...this.calendarOptions, ...this.options };
    this.weekDays = generateWeekDays(this.calendarOptions.weekStart);
  }

  changeView(): void {
    this.view = this.view === 'month' ? 'week' : 'month';
  }

  // TODO: unsubscribe from events
  // private initSwiperEvents(): void {
  //   this.swiper.on('slideChangeTransitionEnd', () => {
  //     if (this.swiper.isBeginning) {
  //       this.leftDiff -= 1;
  //       this.daysSlides.unshift(
  //         this.getWeeksForTheDate(addMonths(this.startDate, this.leftDiff))
  //       );
  //       this.swiper.slideTo(1, 0, false);
  //     } else if (this.swiper.isEnd) {
  //       this.rightDiff += 1;
  //       this.daysSlides.push(
  //         this.getWeeksForTheDate(addMonths(this.startDate, this.rightDiff))
  //       );
  //       this.swiper.slideTo(this.daysSlides.length - 2, 0, false);
  //     }

  //     this.cdr.detectChanges();
  //     this.swiper.update();
  //   });
  // }

  // private getWeeksForTheDate(date: Date): Date[][] {
  //   const start = startOfMonth(date);
  //   const end = endOfMonth(date);

  //   const weeksStartDates = eachWeekOfInterval(
  //     { start, end },
  //     { weekStartsOn: this.calendarOptions.weekStart }
  //   );

  //   return weeksStartDates.map((weekStart: Date) => {
  //     return this.weekDays.reduce((acc: Date[]) => {
  //       let date = weekStart;
  //       if (acc.length) {
  //         date = addDays(acc[acc.length - 1], 1);
  //       }
  //       acc.push(date);
  //       return acc;
  //     }, []);
  //   });
  // }
}
