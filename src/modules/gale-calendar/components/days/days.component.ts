import { Component, OnInit, Input } from '@angular/core';
import { getDate } from 'date-fns';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
})
export class DaysComponent implements OnInit {
  @Input() days!: Date[];

  getDate = getDate;

  constructor() {}

  ngOnInit() {}
}
