import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import Swiper from 'swiper/types/swiper-class';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { generateWeekDays } from '../../utils';
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

  ngOnInit() {
    this.calendarOptions = { ...this.calendarOptions, ...this.options };
    this.weekDays = generateWeekDays(this.calendarOptions.weekStart);
  }

  changeView(): void {
    this.view = this.view === 'month' ? 'week' : 'month';
  }

  onMonthViewDateChange(viewDate: Date): void {
    this.weeksSlider.viewDate = viewDate;
  }

  onWeekViewDateChange({
    viewDate,
    direction,
  }: {
    viewDate: Date;
    direction: Swiper['swipeDirection'];
  }): void {
    this.monthsSlider.setViewDate(viewDate, direction);
    console.log(viewDate);
  }

  slideNext(): void {
    this.monthsSlider.slideNext();
  }

  slidePrev(): void {
    this.monthsSlider.slidePrev();
  }
}
