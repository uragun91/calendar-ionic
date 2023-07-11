import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleCalendarComponent } from './components/gale-calendar/gale-calendar.component';
import { DatesComponent } from './components/dates/dates.component';
import { SwiperDirective } from './swiper.directive';
import { WeeksSliderComponent } from './components/weeks-slider/weeks-slider.component';
import { DaysComponent } from './components/days/days.component';

@NgModule({
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    GaleCalendarComponent,
    DatesComponent,
    SwiperDirective,
    WeeksSliderComponent,
    DaysComponent,
  ],
  exports: [GaleCalendarComponent],
})
export class GaleCalendarModule {}
