import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arrangement } from '../arrangement';
import { PlannedCompartment } from '../planned-compartment';

@Component({
  selector: 'app-arranged-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-box grid-2">
      <div class="card box-design">
        <svg [attr.viewBox]="'0 0 ' + arrangement.width + ' ' + arrangement.length"> 
          <rect [attr.x]="0"
                [attr.y]="0"
                [attr.width]="arrangement.width"
                [attr.height]="arrangement.length"
                fill="black">
          </rect>
          <ng-container *ngFor="let compartment of arrangement.compartments">
            <rect [attr.x]="compartment.x"
                  [attr.y]="compartment.y"
                  [attr.width]="compartment.width"
                  [attr.height]="compartment.length"
                  fill="lightGray">
            </rect>
            <rect [attr.x]="compartment.x"
                  [attr.y]="compartment.y"
                  [attr.width]="compartment.targetWidth"
                  [attr.height]="compartment.targetLength"
                  fill="white">
            </rect>
            <text *ngIf="compartment.flipped === false"
                  [attr.x]="compartment.x + compartment.width / 2"
                  [attr.y]="compartment.y + compartment.length / 2"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  [attr.font-size]="getFontSize(compartment)">{{ compartment.name }}</text>
            <text *ngIf="compartment.flipped"
                  [attr.x]="compartment.x + compartment.width / 2"
                  [attr.y]="compartment.y + compartment.length / 2"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  [attr.font-size]="getFontSize(compartment)"
                  [attr.transform]="'rotate(90,' + (compartment.x + compartment.width / 2) + ',' + (compartment.y + compartment.length / 2) + ')'">{{ compartment.name }}</text>
          </ng-container>
        </svg>
        <div class="card-contents">
          <div class="card-title">{{arrangement.width}} mm x {{arrangement.length}} mm</div>
          <div class="card-description">
            <div>Box Area: {{arrangement.width * arrangement.length / 100}} cm²</div>
            <div>Usable Space: {{arrangement.area / 100}} cm²</div>
            <div>Padding: {{arrangement.wastedArea / 100}} cm²</div>
            <div class="algo">{{arrangement.algorithm}}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./arranged-box.component.scss']
})
export class ArrangedBoxComponent {
  @Input() arrangement!: Arrangement;

  getFontSize(compartment: PlannedCompartment): number {
    if(compartment.flipped){
      return Math.min(compartment.width / 2, compartment.length / compartment.name.length);
    } else {
      return Math.min(compartment.length / 2, compartment.width / compartment.name.length);
    }
  }
}