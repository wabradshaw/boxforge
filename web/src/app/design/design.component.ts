import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BoxPlan } from '../boxplan';
import { Compartment } from './compartment';
import { Arrangement } from '../arrangement/arrangement';
import { ArrangementService } from '../arrangement/arrangement.service';

import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-design',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="design">
      <div class="intro">
        Now you need to decide what you'll put in your box. Add the compartments you need, then press the arrange button.
      </div>
      <div class="new-compartment">
        <div class="new-compartment-inputs">
          <div class="prompt inlinable">      
            <div>Name:</div>
            <input type="text" [(ngModel)]="newName" maxlength="24"/>
          </div>     
          <div class="prompt inlinable">      
            <div>Dimensions:</div>
            <div>
                <input 
                type="number" 
                [(ngModel)]="newWidth" 
                step="1" 
                [min]="2*boxPlan.getWood().size" 
                max="200" 
                prompt 
              /> mm 
            </div>     
            <div>x</div>
            <div>
                <input 
                type="number" 
                [(ngModel)]="newLength" 
                step="1" 
                [min]="2*boxPlan.getWood().size" 
                max="200" 
                prompt 
              /> mm 
            </div>
          </div>     
          <div class="prompt inlinable">      
            <div>Depth:</div>
            <div>
              <input 
                type="number" 
                [(ngModel)]="newDepth" 
                step="1" 
                [min]="boxPlan.getWood().size" 
                [max]="boxPlan.getTargetWorkableDepth() || 100" 
                prompt 
              /> mm 
            </div>
          </div>     
        </div>
        <button 
          class="available" 
          class="arrange" 
          [ngClass]="compartments.length >= 20 ? 'disabled' : 'available'"
          (click)="addCompartment()"
        >Add</button>
      </div>
      <div class="list-wrapper">
        <div class="grid-box grid-4"
          *ngFor="let compartment of compartments">
          <div class="card">
            <div class="card-contents"> 
              <div>{{compartment.name}}</div>
              <div>{{compartment.width}} mm x {{compartment.length}} mm</div>
              <div>{{compartment.depth}} mm deep</div>
            </div>
          </div>
        </div>
      </div>
      <button *ngIf="hasCompartments()" (click)="generateArrangement()">Arrange</button>      
    </div>
  `,
  styleUrls: ['./design.component.scss']
})
export class DesignComponent {
  @Input() boxPlan!: BoxPlan;

  constructor(private arrangementService: ArrangementService) {
    (window as any).test = () => this.testSetup();
  }

  nextName = 1;
  newName = "1";
  newDepth?:number = undefined;
  newWidth?:number = undefined;
  newLength?:number = undefined;

  compartments:Compartment[] = [];

  hasCompartments(): boolean {
    return this.compartments.length > 0;
  }

  addCompartment(){
    if (this.newWidth && this.newLength && this.boxPlan.getTargetWorkableDepth()){
      if (!this.newDepth) {
        this.newDepth = this.boxPlan.getTargetWorkableDepth()
      }
      let newCompartment:Compartment = {
        "id" : uuidv4(),
        "name" : this.newName,
        "depth" : this.newDepth || 1,
        "length" : this.newLength,
        "width" : this.newWidth,
      }
      this.compartments.push(newCompartment);
      
      this.newDepth = this.boxPlan.getTargetWorkableDepth();
      this.newWidth = undefined;
      this.newLength = undefined;
      this.newName = this.findNextName();
    } else {
      alert("No");
    }
  }

  findNextName(): string {
    while(this.compartments.map(x => x.name).indexOf(this.nextName.toString()) > -1){
      this.nextName = (this.nextName + 1) % 30;  
    }
    return this.nextName.toString();
  }

  generateArrangement(): void {
    console.log("generating arrangement");
    this.arrangementService.planArrangements(this.boxPlan);
  }

  testSetup() {
    this.compartments = [
      { id: '1', name: 'Comp1', depth: 10, width: 50, length: 60 },
      { id: '2', name: 'Comp2', depth: 10, width: 50, length: 55},
      { id: '3', name: 'Comp3', depth: 5, width: 45, length: 15 },
      { id: '4', name: 'Nigel', depth: 3, width: 150, length: 34 },
      { id: '5', name: 'Nigella', depth: 3, width: 150, length: 34},
      { id: '6', name: 'Nigella', depth: 3, width: 140, length: 5 }
    ];
  }
}
