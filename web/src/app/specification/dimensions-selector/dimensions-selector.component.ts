import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BoxPlan } from 'src/app/boxplan';

@Component({
  selector: 'app-dimensions-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="prompt inlinable">      
      <div class="required">How tall should the compartments be?</div>
      <div>
        <input 
          type="number" 
          [(ngModel)]="height" 
          step="1" 
          [min]="2*boxPlan.getWood().size" 
          max="100" 
          (input)="updateHeight(height)"
          prompt 
        /> mm</div>      
    </div>    
    <div *ngIf="hasHeight()" class="dimension-prompt">The full box will be {{boxPlan.getTargetDepth()}}mm tall.</div>
    <div *ngIf="!hasHeight()" class="dimension-prompt">The full box will be {{boxPlan.getTargetDepthDifference()}}mm taller than this.</div>
  `,
  styleUrls: ['./dimensions-selector.component.scss']
})
export class DimensionsSelectorComponent {
  @Input() boxPlan!: BoxPlan;

  height?: number;

  updateHeight(height: number | undefined) {
    if(height) {
      this.boxPlan.updateTargetWorkableDepth(height)
    }
  }

  hasHeight(): boolean {
    if (this.height) {
      return true;
    } else {
      return false;
    }
  }
}
