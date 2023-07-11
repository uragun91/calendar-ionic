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
} from '@angular/core';
import {
  addDays,
  addWeeks,
  eachWeekOfInterval,
  isSameDay,
  max,
  min,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper/types/swiper-class';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { mergeDates } from '../../utils';

@Component({
  selector: 'gale-weeks-slider',
  templateUrl: './weeks-slider.component.html',
  styleUrls: ['./weeks-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeksSliderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selectedDate!: Date;
  @Input() calendarOptions!: GaleCalendarOptions;

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
      this.weekStarts = mergeDates(
        weeksStartForViewDates,
        this.weekStarts,
        this.calendarOptions.weekStart
      );
    }

    this.weeksSlides = this.generateWeekSlidesFromWeekStarts(this.weekStarts);
    this.cdr.detectChanges();

    if (this.swiper) {
      this.swiper.update();
      this.swiper.slideTo(this.getWeekIndex(date), 0, false);
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
  }

  ngOnInit() {}

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

  private getWeekIndex(date: Date): number {
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
