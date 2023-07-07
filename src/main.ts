import 'zone.js/dist/zone';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { GaleCalendarModule } from './modules/gale-calendar/gale-calendar.module';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'my-app',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, GaleCalendarModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>

    <gale-calendar [startDate]="startDate"></gale-calendar>
  `,
})
export class App implements OnInit {
  name = 'Angular';
  startDate = new Date();

  ngOnInit(): void {
    register();
  }
}

bootstrapApplication(App);
