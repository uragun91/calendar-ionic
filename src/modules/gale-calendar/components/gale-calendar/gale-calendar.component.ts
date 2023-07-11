import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import Swiper from 'swiper/types/swiper-class';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { generateWeekDays, getMonthNameOFDate } from '../../utils';
import { MonthsSliderComponent } from '../months-slider/months-slider.component';
import { WeeksSliderComponent } from '../weeks-slider/weeks-slider.component';

@Component({
  selector: 'gale-calendar',
  templateUrl: './gale-calendar.component.html',
  styleUrls: ['./gale-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleCalendarComponent implements OnInit {
  @Input() startDate: Date = new Date();
  @Input() options?: Partial<GaleCalendarOptions> = {};

  @ViewChild(WeeksSliderComponent) weeksSlider!: WeeksSliderComponent;
  @ViewChild(MonthsSliderComponent) monthsSlider!: MonthsSliderComponent;

  calendarOptions: GaleCalendarOptions = {
    weekStart: 1,
  };

  weekDays: string[] = [];
  view: 'week' | 'month' = 'month';
  currentMonth = '';

  ngOnInit() {
    this.calendarOptions = { ...this.calendarOptions, ...this.options };
    this.weekDays = generateWeekDays(this.calendarOptions.weekStart);

    this.currentMonth = getMonthNameOFDate(this.startDate);
  }

  switchView(): void {
    this.view = this.view === 'month' ? 'week' : 'month';
  }

  onMonthViewDateChange(viewDate: Date): void {
    this.weeksSlider.viewDate = viewDate;
    this.currentMonth = getMonthNameOFDate(viewDate);
  }

  onWeekViewDateChange({
    viewDate,
    direction,
  }: {
    viewDate: Date;
    direction: Swiper['swipeDirection'];
  }): void {
    this.monthsSlider.setViewDate(viewDate, direction);
    this.currentMonth = getMonthNameOFDate(viewDate);
  }

  slideNext(): void {
    if (this.view === 'month') {
      this.monthsSlider.slideNext();
    } else {
      this.weeksSlider.slideNext();
    }
  }

  slidePrev(): void {
    if (this.view === 'month') {
      this.monthsSlider.slidePrev();
    } else {
      this.weeksSlider.slidePrev();
    }
  }
}
