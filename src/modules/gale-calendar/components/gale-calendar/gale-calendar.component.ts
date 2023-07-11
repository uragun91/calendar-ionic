import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  addWeeks,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper/types/swiper-class';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { DatesComponent } from '../dates/dates.component';

@Component({
  selector: 'gale-calendar',
  templateUrl: './gale-calendar.component.html',
  styleUrls: ['./gale-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleCalendarComponent implements OnInit, AfterViewInit {
  @Input() startDate: Date = new Date();
  @Input() options?: Partial<GaleCalendarOptions> = {};
  @ViewChildren(DatesComponent) galeDatesComponents!: QueryList<DatesComponent>;
  @ViewChild('swiper') swiperElementRef!: ElementRef<SwiperContainer>;

  calendarOptions: GaleCalendarOptions = {
    weekStart: 1,
  };

  daysSlides: Date[][][] = [];
  config: SwiperOptions = {
    init: false,
    direction: 'horizontal',
    initialSlide: 1,
  };

  // TODO: generate based on weekStart option
  weekDays = ['M', 'T', 'W', 'R', 'F', 'S', 'S'];

  // TODO: add this as input
  view: 'week' | 'month' = 'month';

  private swiper!: Swiper;
  private leftDiff = -1;
  private rightDiff = 1;

  constructor(private cdr: ChangeDetectorRef) {}

  changeDate(): void {
    this.startDate = addWeeks(this.startDate, -2);
  }

  ngOnInit() {
    this.calendarOptions = { ...this.calendarOptions, ...this.options };
    this.daysSlides = [
      this.getWeeksForTheDate(addMonths(this.startDate, this.leftDiff)),
      this.getWeeksForTheDate(this.startDate),
      this.getWeeksForTheDate(addMonths(this.startDate, this.rightDiff)),
    ];
  }

  ngAfterViewInit() {
    this.swiper = this.swiperElementRef.nativeElement.swiper;
    this.initSwiperEvents();
  }

  changeView(): void {
    this.view = this.view === 'month' ? 'week' : 'month';
    this.galeDatesComponents.forEach((c: DatesComponent) => {
      c.changeView(this.view);
    });
  }

  // TODO: unsubscribe from events
  private initSwiperEvents(): void {
    this.swiper.on('slideChangeTransitionEnd', () => {
      if (this.swiper.isBeginning) {
        this.leftDiff -= 1;
        this.daysSlides.unshift(
          this.getWeeksForTheDate(addMonths(this.startDate, this.leftDiff))
        );
        this.swiper.slideTo(1, 0, false);
      } else if (this.swiper.isEnd) {
        this.rightDiff += 1;
        this.daysSlides.push(
          this.getWeeksForTheDate(addMonths(this.startDate, this.rightDiff))
        );
        this.swiper.slideTo(this.daysSlides.length - 2, 0, false);
      }

      this.cdr.detectChanges();
      this.swiper.update();
    });
  }

  private getWeeksForTheDate(date: Date): Date[][] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const weeksStartDates = eachWeekOfInterval(
      { start, end },
      { weekStartsOn: this.calendarOptions.weekStart }
    );

    return weeksStartDates.map((weekStart: Date) => {
      return this.weekDays.reduce((acc: Date[]) => {
        let date = weekStart;
        if (acc.length) {
          date = addDays(acc[acc.length - 1], 1);
        }
        acc.push(date);
        return acc;
      }, []);
    });
  }
}
