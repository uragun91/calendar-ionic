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
} from '@angular/core';
import { addDays, addWeeks, eachWeekOfInterval, max, min } from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import { GaleCalendarOptions } from '../gale-calendar/gale-calendar.component';

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
      this.weekStarts = this.mergeDates(
        weeksStartForViewDates,
        this.weekStarts
      );
    }

    this.weeksSlides = this.generateWeekSlidesFromWeekStarts(this.weekStarts);
  }

  public weeksSlides: Date[][] = [];
  private weekStarts: Date[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate.currentValue) {
      this.viewDate = this.selectedDate;
    }
  }

  ngAfterViewInit(): void {
    this.swiperContainerRef.nativeElement.initialize();
  }

  ngOnInit() {}

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
}
