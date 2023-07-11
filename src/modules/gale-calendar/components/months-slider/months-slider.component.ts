import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  addDays,
  addMonths,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper/types/swiper-class';
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

  @Output() viewDateChange = new EventEmitter<Date>();

  @ViewChild('swiper') swiperContainerRef!: ElementRef<SwiperContainer>;
  swiper!: Swiper;

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
    this.cdr.detectChanges();

    if (this.swiper) {
      this.swiper.update();
      this.swiper.slideTo(this.getMonthIndexByDate(date), 0, false);
    }
  }

  public monthsSlides: Date[][][] = [];
  private monthStarts: Date[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.swiper = this.swiperContainerRef.nativeElement.swiper;
    this.initSwiperListeners();
  }

  ngOnInit() {}

  slideNext(): void {
    this.swiper.slideNext();
  }

  slidePrev(): void {
    this.swiper.slidePrev();
  }

  private initSwiperListeners(): void {
    this.swiper.on('slideChangeTransitionEnd', () => {
      let lastDayOfFirstWeekOfMonth = this.monthsSlides[0][0][6];
      let firstDayOfLastWeekOfMonth =
        this.monthsSlides[this.monthsSlides.length - 1][
          this.monthsSlides[this.monthsSlides.length - 1].length - 1
        ][0];

      if (this.swiper.isBeginning) {
        this.monthsSlides.unshift(
          this.getMonthWeeksForTheDate(addMonths(lastDayOfFirstWeekOfMonth, -1))
        );
        this.swiper.slideTo(1, 0, false);
      } else if (this.swiper.isEnd) {
        this.monthsSlides.push(
          this.getMonthWeeksForTheDate(addMonths(firstDayOfLastWeekOfMonth, 1))
        );
        this.swiper.slideTo(this.monthsSlides.length - 2, 0, false);
      }

      this.cdr.detectChanges();
      this.swiper.update();

      const lastDayOfFirstWeekOfCurrentMonth =
        this.monthsSlides[this.swiper.activeIndex][0][
          this.monthsSlides[this.swiper.activeIndex][0].length - 1
        ];

      this.viewDateChange.emit(startOfMonth(lastDayOfFirstWeekOfCurrentMonth));
    });
  }

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

  private getMonthIndexByDate(date: Date): number {
    for (let i = 0; i < this.monthsSlides.length; i++) {
      for (let j = 0; j < this.monthsSlides[i].length; j++) {
        const isInTheWeek = this.monthsSlides[i][j].some((day) =>
          isSameDay(date, day)
        );

        if (isInTheWeek) {
          return i;
        }
      }
    }

    return -1;
  }
}
