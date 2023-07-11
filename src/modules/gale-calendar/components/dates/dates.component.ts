import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Animation, AnimationController } from '@ionic/angular';
import {
  getDate,
  getMonth,
  getWeekOfMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper/types/swiper-class';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { GaleCalendarOptions } from '../../models/calendar-options.model';

const ANIMATION_DURATION = 800;
// https://cubic-bezier.com/
const CUBIC_BEZIER = 'cubic-bezier(.22,1.09,.75,1)';
const MAX_WEEKS_IN_A_VIEW = 6;

@Component({
  selector: 'gale-dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatesComponent implements AfterViewInit {
  @Input() weekDays!: string[];
  @Input() weeksWithDays!: Date[][];
  @Input() selectedDate!: Date;
  @Input() view: 'week' | 'month' = 'month';
  @Input() options!: GaleCalendarOptions;

  @ViewChild('weeks') weeksElementRef!: ElementRef<HTMLDivElement>;
  @ViewChild('weeksWrapper')
  weeksWrapperElementRef!: ElementRef;
  @ViewChild('swiper')
  swiperElementRef!: ElementRef<SwiperContainer>;
  @ViewChildren('week') weeksList!: QueryList<ElementRef<HTMLDivElement>>;

  weeksSliderConfig: SwiperOptions = {
    nested: true,
    direction: 'horizontal',
    enabled: true,
    initialSlide: 0,
  };

  showWeeksSlider = false;
  heightInitialized = false;
  // TODO: add disable of button
  isChangingView = false;

  // TODO: make pipe;
  getDate = getDate;
  weekHeightInPixels = 0;
  monthHeightInPixels = 0;

  // the beggining of the week or the month or the start date.
  viewDate!: Date;

  private weeksAnimation: Animation | null = null;
  private weeksWrapperAnimation: Animation | null = null;
  private allInOneAnimation: Animation | null = null;
  private weeksSwiper!: Swiper;

  constructor(
    private animationCtrl: AnimationController,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const startOfTheMonthOfSelectedDate: Date = startOfMonth(this.selectedDate);
    const firstDayOfLastWeek: Date =
      this.weeksWithDays[this.weeksWithDays.length - 1][0];

    const startDateWeekOfTheMonthIndex: number =
      getWeekOfMonth(this.selectedDate, {
        weekStartsOn: this.options.weekStart,
      }) - 1;

    const firstDayOfLastWeekWeekOfTheMonthIndex: number =
      getWeekOfMonth(firstDayOfLastWeek, {
        weekStartsOn: this.options.weekStart,
      }) - 1;

    const monthOfSelectedDate = getMonth(startOfTheMonthOfSelectedDate);
    const monthOfFirstDayOfLastWeek = getMonth(
      firstDayOfLastWeekWeekOfTheMonthIndex
    );

    if (monthOfSelectedDate === monthOfFirstDayOfLastWeek) {
      this.weeksSliderConfig.initialSlide = startDateWeekOfTheMonthIndex;
      this.viewDate = startOfWeek(this.selectedDate, {
        weekStartsOn: this.options.weekStart,
      });
    } else if (monthOfSelectedDate > monthOfFirstDayOfLastWeek) {
      this.weeksSliderConfig.initialSlide =
        firstDayOfLastWeekWeekOfTheMonthIndex;
      this.viewDate = firstDayOfLastWeek;
    } else if (monthOfSelectedDate < monthOfFirstDayOfLastWeek) {
      this.weeksSliderConfig.initialSlide = 0;
      this.viewDate = startOfTheMonthOfSelectedDate;
    }

    Object.assign(this.swiperElementRef.nativeElement, this.weeksSliderConfig);
    this.swiperElementRef.nativeElement.initialize();
    this.weeksSwiper = this.swiperElementRef.nativeElement.swiper;

    this.weeksSwiper.on('slideChange', () => {
      this.viewDate = this.weeksWithDays[this.weeksSwiper.activeIndex][0];
      this.renderer.setStyle(
        this.weeksElementRef.nativeElement,
        'top',
        `-${this.weekHeightInPixels * this.weeksSwiper.activeIndex}px`
      );
    });

    setTimeout(() => {
      this.initHeight();
      this.heightInitialized = true;
      this.cdr.detectChanges();
    });
  }

  changeView(view: 'week' | 'month'): void {
    this.isChangingView = true;
    this.view = view;
    this.initAnimation(view);
    if (this.view === 'month') {
      this.showWeeksSlider = false;
    }
    this.cdr.detectChanges();

    this.allInOneAnimation!.play();
  }

  private initHeight(): void {
    console.log('init height');
    const weekRect = this.weeksList.first.nativeElement.getBoundingClientRect();
    this.weekHeightInPixels = weekRect.height;
    this.monthHeightInPixels = this.weekHeightInPixels * MAX_WEEKS_IN_A_VIEW;

    this.renderer.setStyle(
      this.weeksWrapperElementRef.nativeElement,
      'height',
      (this.view === 'month'
        ? this.monthHeightInPixels
        : this.weekHeightInPixels) + 'px'
    );

    this.renderer.setStyle(
      this.weeksWrapperElementRef.nativeElement,
      'display',
      'block'
    );
  }

  private initAnimation(view: 'week' | 'month') {
    this.initWeeksAnimation(view);
    this.initWeeksWrapperAnimation(view);

    this.allInOneAnimation = this.animationCtrl
      .create()
      .addAnimation([this.weeksAnimation!, this.weeksWrapperAnimation!])
      .onFinish(() => {
        this.allInOneAnimation!.childAnimations.forEach((anim) => {
          anim.destroy();
        });
        this.allInOneAnimation!.destroy();

        if (view === 'week') {
          this.showWeeksSlider = true;
        }
        this.isChangingView = false;
        this.cdr.detectChanges();
      });
  }

  private initWeeksAnimation(view: 'week' | 'month'): void {
    // TODO: to be defined based on selected date
    const weekIndex =
      getWeekOfMonth(this.viewDate, {
        weekStartsOn: this.options.weekStart,
      }) - 1;
    console.group('Another Data');
    console.log('this.viewDate', this.viewDate);
    console.log('weekIndex', weekIndex);
    console.groupEnd();

    const topValue =
      view === 'week' ? `-${this.weekHeightInPixels * weekIndex}px` : '0px';
    this.weeksAnimation = this.getWeekAnimation(topValue);
  }

  private initWeeksWrapperAnimation(view: 'week' | 'month'): void {
    const weeksWrapperElementRect =
      this.weeksWrapperElementRef.nativeElement.getBoundingClientRect();

    const initialHeight = weeksWrapperElementRect.height + 'px';
    const heightValue =
      (view === 'week' ? this.weekHeightInPixels : this.monthHeightInPixels) +
      'px';

    this.weeksWrapperAnimation = this.getWeekWrapperAnimation(
      heightValue,
      initialHeight
    );
  }

  private getWeekAnimation(to: string): Animation {
    return this.animationCtrl
      .create()
      .addElement(this.weeksElementRef.nativeElement)
      .duration(ANIMATION_DURATION)
      .afterStyles({ top: to })
      .easing(CUBIC_BEZIER)
      .to('top', to)
      .onFinish(() => {
        this.weeksAnimation!.destroy();
      });
  }

  private getWeekWrapperAnimation(
    to: string,
    initialHeight: string
  ): Animation {
    return this.animationCtrl
      .create()
      .addElement(this.weeksWrapperElementRef.nativeElement)
      .duration(ANIMATION_DURATION)
      .beforeStyles({ height: initialHeight })
      .afterStyles({ height: to })
      .easing(CUBIC_BEZIER)
      .to('height', to)
      .onFinish(() => {
        this.weeksWrapperAnimation!.destroy();
        this.weeksWrapperAnimation = null;
      });
  }
}
