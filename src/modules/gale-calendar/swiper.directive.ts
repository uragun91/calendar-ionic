import { Directive, Input, AfterViewInit, ElementRef } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Directive({
  selector: '[gale-swiper]',
})
export class SwiperDirective implements AfterViewInit {
  swiperElement: SwiperContainer;

  @Input('config') config?: SwiperOptions;

  constructor(private el: ElementRef<SwiperContainer>) {
    this.swiperElement = el.nativeElement;
  }

  ngAfterViewInit(): void {
    Object.assign(this.el.nativeElement, this.config);
    this.swiperElement.initialize();
  }
}
