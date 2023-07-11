import { Component, OnInit } from '@angular/core';

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
