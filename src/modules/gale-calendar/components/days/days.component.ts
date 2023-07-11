import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { getDate } from 'date-fns';

@Component({
  selector: 'gale-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysComponent implements OnInit {
  @Input() days!: Date[];

  getDate = getDate;

  constructor() {}

  ngOnInit() {}
}
