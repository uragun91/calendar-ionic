import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
import Swiper from 'swiper/types/swiper-class';
import { GaleCalendarOptions } from '../../models/calendar-options.model';
import { generateWeekDays, getMonthNameOFDate } from '../../utils';
import { MonthsSliderComponent } from '../months-slider/months-slider.component';
import { WeeksSliderComponent } from '../weeks-slider/weeks-slider.component';

const ANIMATION_DURATION = 2000;

@Component({
  selector: 'gale-calendar',
  templateUrl: './gale-calendar.component.html',
  styleUrls: ['./gale-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleCalendarComponent implements OnInit, AfterViewInit {
  @Input() startDate: Date = new Date();
  @Input() options?: Partial<GaleCalendarOptions> = {};

  @ViewChild(WeeksSliderComponent) weeksSlider!: WeeksSliderComponent;
  @ViewChild(MonthsSliderComponent) monthsSlider!: MonthsSliderComponent;
  @ViewChild(MonthsSliderComponent, { read: ElementRef })
  monthsSliderElementRef!: ElementRef;

  monthSliderAnimation!: Animation;

  calendarOptions: GaleCalendarOptions = {
    weekStart: 1,
  };

  weekDays: string[] = [];
  view: 'week' | 'month' = 'month';
  currentMonth = '';

  showMonthSlider = true;
  showWeekSlider = false;

  constructor(
    private animationController: AnimationController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.calendarOptions = { ...this.calendarOptions, ...this.options };
    this.weekDays = generateWeekDays(this.calendarOptions.weekStart);

    this.currentMonth = getMonthNameOFDate(this.startDate);
  }

  ngAfterViewInit(): void {
    console.log(this.monthsSliderElementRef);
    this.initAnimation();
  }

  switchView(): void {
    this.view = this.view === 'month' ? 'week' : 'month';
    this.playAnimation();
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

  private playAnimation(): void {
    this.monthSliderAnimation.play();
  }

  private initAnimation(): void {
    const { nativeElement: monthsSliderElement } = this.monthsSliderElementRef;

    this.monthSliderAnimation = this.animationController
      .create()
      .addElement(monthsSliderElement)
      .duration(ANIMATION_DURATION)
      .fromTo('marginBottom', '0px', '-150px')
      .fromTo('marginTop', '0px', '-100px')
      .onFinish(() => {
        this.showMonthSlider = false;
        this.showWeekSlider = true;
        this.cdr.detectChanges();
      });
  }
}
