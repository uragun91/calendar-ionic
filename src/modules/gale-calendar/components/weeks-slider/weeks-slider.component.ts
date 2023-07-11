import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { addDays, eachWeekOfInterval, max, min } from 'date-fns';

@Component({
  selector: 'app-weeks-slider',
  templateUrl: './weeks-slider.component.html',
  styleUrls: ['./weeks-slider.component.scss'],
})
export class WeeksSliderComponent implements OnInit, OnChanges {
  @Input() selectedDate!: Date;

  set viewDate(date: Date) {
    const weeksStartForViewDates = eachWeekOfInterval({
      start: addDays(date, -1),
      end: addDays(date, 1),
    });

    if (!this.weekStarts.length) {
      this.weekStarts = weeksStartForViewDates;
    } else {
      this.weekStarts = this.mergeDates(
        weeksStartForViewDates,
        this.weekStarts
      );
    }
  }

  private weekStarts: Date[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate.currentValue) {
      this.viewDate = this.selectedDate;
    }
  }

  ngOnInit() {}

  private mergeDates(date1: Date[], date2: Date[]): Date[] {
    return eachWeekOfInterval({
      start: min([...date1, ...date2]),
      end: max([...date1, ...date2]),
    });
  }
}
