import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { addWeeks } from 'date-fns';
import { SwiperOptions } from 'swiper/types/swiper-options';
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

  config: SwiperOptions = {
    init: false,
    direction: 'horizontal',
    initialSlide: 1,
  };

  weekDays: string[] = [];
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

  onMonthViewDateChange(viewDate: Date): void {
    console.log(viewDate);
    this.weeksSlider.viewDate = viewDate;
  }

  slideNext(): void {
    this.monthsSlider.slideNext();
  }

  slidePrev(): void {
    this.monthsSlider.slidePrev();
  }
}
