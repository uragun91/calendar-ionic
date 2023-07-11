import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper/types/swiper-class';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { mergeWeekStartDates } from '../../utils';

@Component({
  selector: 'gale-weeks-slider',
  templateUrl: './weeks-slider.component.html',
  styleUrls: ['./weeks-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeksSliderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selectedDate!: Date;
  @Input() calendarOptions!: GaleCalendarOptions;

  @Output() viewDateChange = new EventEmitter<{
    viewDate: Date;
    direction: Swiper['swipeDirection'];
  }>();

  @ViewChild('swiper') swiperContainerRef!: ElementRef<SwiperContainer>;

  swiper!: Swiper;

  set viewDate(date: Date) {
    const weeksStartForViewDates = eachWeekOfInterval(
      {
        start: addWeeks(date, -1),
        end: addWeeks(date, 1),
      },
      {
        weekStartsOn: this.calendarOptions.weekStart,
      }
    );

    if (!this.weekStarts.length) {
      this.weekStarts = weeksStartForViewDates;
    } else {
      this.weekStarts = mergeWeekStartDates(
        weeksStartForViewDates,
        this.weekStarts,
        this.calendarOptions.weekStart
      );
    }

    this.weeksSlides = this.generateWeekSlidesFromWeekStarts(this.weekStarts);
    this.cdr.detectChanges();

    if (this.swiper) {
      this.swiper.update();
      this.swiper.slideTo(this.getWeekIndexByDate(date), 0, false);
    }
  }

  public weeksSlides: Date[][] = [];
  private weekStarts: Date[] = [];

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
      if (this.swiper.isBeginning) {
        this.weeksSlides.unshift(
          eachDayOfInterval({
            start: addWeeks(
              startOfWeek(this.weeksSlides[0][0], {
                weekStartsOn: this.calendarOptions.weekStart,
              }),
              -1
            ),
            end: addWeeks(
              endOfWeek(this.weeksSlides[0][0], {
                weekStartsOn: this.calendarOptions.weekStart,
              }),
              -1
            ),
          })
        );
        this.swiper.slideTo(1, 0, false);
      } else if (this.swiper.isEnd) {
        this.weeksSlides.push(
          eachDayOfInterval({
            start: addWeeks(
              startOfWeek(this.weeksSlides[this.weeksSlides.length - 1][0], {
                weekStartsOn: this.calendarOptions.weekStart,
              }),
              1
            ),
            end: addWeeks(
              endOfWeek(this.weeksSlides[this.weeksSlides.length - 1][0], {
                weekStartsOn: this.calendarOptions.weekStart,
              }),
              1
            ),
          })
        );
        this.swiper.slideTo(this.weeksSlides.length - 2, 0, false);
      }

      this.cdr.detectChanges();
      this.swiper.update();

      const currentWeek = this.weeksSlides[this.swiper.activeIndex];

      if (this.swiper.swipeDirection === 'next') {
        this.viewDateChange.emit({
          viewDate: currentWeek[0],
          direction: this.swiper.swipeDirection,
        });
      } else {
        this.viewDateChange.emit({
          viewDate: currentWeek[currentWeek.length - 1],
          direction: this.swiper.swipeDirection,
        });
      }
    });
  }

  private generateWeekSlidesFromWeekStarts(weekStarts: Date[]): Date[][] {
    return weekStarts.map((weekStart) => {
      return [1, 2, 3, 4, 5, 6].reduce(
        (acc) => {
          acc.push(addDays(acc[acc.length - 1], 1));
          return acc;
        },
        [weekStart]
      );
    });
  }

  private getWeekIndexByDate(date: Date): number {
    for (let i = 0; i < this.weeksSlides.length; i++) {
      const isInTheWeek = this.weeksSlides[i].some((day) =>
        isSameDay(date, day)
      );

      if (isInTheWeek) {
        return i;
      }
    }

    return -1;
  }
}
