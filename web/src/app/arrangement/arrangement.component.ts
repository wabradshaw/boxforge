import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxPlan } from '../boxplan';
import { ArrangedBoxComponent } from './arranged-box/arranged-box.component';

@Component({
  selector: 'app-arrangement',
  standalone: true,
  imports: [
    CommonModule,
    ArrangedBoxComponent
  ],
  template: `
    <div class="arrangment"> 
      <div class="list-wrapper">
        <app-arranged-box *ngFor="let arrangement of boxPlan.getArrangements()" [arrangement]="arrangement"/>
      </div>
    </div>
  `,
  styleUrls: ['./arrangement.component.scss']
})
export class ArrangementComponent {
  @Input() boxPlan!: BoxPlan;
}
