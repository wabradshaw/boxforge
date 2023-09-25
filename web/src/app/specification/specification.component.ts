import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BoxPlan } from 'src/app/boxplan';
import { WoodSelectorComponent } from './wood-selector/wood-selector.component';
import { LidSelectorComponent } from './lid-selector/lid-selector.component';


@Component({
  selector: 'app-specification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WoodSelectorComponent,
    LidSelectorComponent
  ],
  template: `
    <div class="specification">
      <div class="intro">
        First, we need to decide what type of box you want to make.
      </div>
      <div class="prompt inlinable">      
        <div>What should we call your box?</div>
        <input type="text" [(ngModel)]="boxName" maxlength="24" (input)="boxPlan.updateBoxName(boxName)" />
      </div>      
      <!-- TODO - box name -->
      <hr/>
      <app-wood-selector [boxPlan]="boxPlan"/>
      <hr/>
      <app-lid-selector [boxPlan]="boxPlan"/>
    </div>
  `,
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  @Input() boxPlan!: BoxPlan;
  
  boxName = "";

  ngOnInit(): void {
    this.boxName = this.boxPlan.getBoxName();
  }
}
