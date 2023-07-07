import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleCalendarComponent } from './components/gale-calendar/gale-calendar.component';
import { DatesComponent } from './components/dates/dates.component';
import { SwiperDirective } from './swiper.directive';

@NgModule({
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [GaleCalendarComponent, DatesComponent, SwiperDirective],
  exports: [GaleCalendarComponent],
})
export class GaleCalendarModule {}
