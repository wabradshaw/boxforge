import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompartmentDesignComponent } from './compartment-design/compartment-design.component';

import { BoxPlan } from '../boxplan';
import { Compartment } from './compartment';
import { ArrangementService } from '../arrangement/arrangement.service';

import {v4 as uuidv4} from 'uuid';


@Component({
  selector: 'app-design',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CompartmentDesignComponent
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
                [placeholder]="boxPlan.getTargetWorkableDepth()"
                prompt 
              /> mm 
            </div>
          </div>     
        </div>
        <button 
          class="arrange" 
          [ngClass]="compartments.length >= 21 ? 'disabled' : 'available'"
          (click)="addCompartment()"
        >Add</button>
      </div>
      <hr/>
      <div> Compartments: </div>
      <div class="list-wrapper">
        <div class="grid-box grid-4"
          *ngFor="let compartment of compartments">
          <app-compartment-design [compartment]="compartment" [boxPlan]="boxPlan" [allCompartments]="compartments"/>
        </div>
        <div class="grid-box grid-4"></div>
        <div class="grid-box grid-4"></div>
        <div class="grid-box grid-4"></div>
      </div>
      <hr/>
      <div class="prompt inlinable">      
        <div>Create padding compartments for spaces larger than:</div>
        <div>
          <input 
            type="number" 
            [(ngModel)]="minPadCompartmentSize" 
            step="1" 
            [min]="2*boxPlan.getWood().size"
            [max]="999"
            [placeholder]="boxPlan.getMinPaddedCompartmentSize()"
          /> mm 
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
    (window as any).t2 = (compartmentCount?: number, dupes?: number, maxSize?: number) => this.testSetup2(compartmentCount, dupes, maxSize);
    (window as any).problemCase = () => this.problemCase();
  }

  nextName = 1;
  newName = "1";
  newDepth?:number = undefined;
  newWidth?:number = undefined;
  newLength?:number = undefined;

  minPadCompartmentSize?:number = undefined;

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
    if(this.minPadCompartmentSize){
      this.boxPlan.updateMinPaddedCompartmentSize(this.minPadCompartmentSize);
    }
    this.boxPlan.updateCompartments(this.compartments);
    let arrangements =  this.arrangementService.planArrangements(this.boxPlan);
    this.boxPlan.updateArrangements(arrangements);
  }

  testSetup() {
    this.compartments = [
      { id: '1', name: 'Comp1', depth: 10, width: 50, length: 60 },
      { id: '2', name: 'Comp2', depth: 10, width: 50, length: 55},
      { id: '3', name: 'Comp3', depth: 5, width: 45, length: 15 },
      { id: '4', name: 'Short', depth: 3, width: 150, length: 34 },
      { id: '5', name: 'Longer Name', depth: 3, width: 150, length: 34},
      { id: '6', name: 'Long Name', depth: 3, width: 140, length: 5 }
    ];
  }
  testSetup2(compartmentCount = (1 + Math.random() * 18), dupes = 0.33, maxSize = 100){
    const comps:Compartment[] = [];

    let lastLength = 5 + (Math.random() * maxSize);
    let lastWidth = 5 + (Math.random() * maxSize);
    for (let i = 0; i < compartmentCount; i++){
      
      comps.push({
        id: i.toString(),
        name: i.toString(),
        depth: Math.ceil(Math.random() * this.boxPlan.getTargetWorkableDepth()!),
        width: Math.ceil(Math.random() > dupes ? 5 + (Math.random() * maxSize) : lastWidth),
        length: Math.ceil(Math.random() > dupes ? 5 + (Math.random() * maxSize) : lastLength)
      })
    }

    console.log(comps);
    this.compartments = comps;
  }
  problemCase() {
    this.compartments = [
      { id: '1', name: '1', depth: 10, width: 7, length: 61 },
      { id: '2', name: '2', depth: 10, width: 7, length: 61},
      { id: '3', name: '3', depth: 5, width: 20, length: 61 },
      { id: '4', name: '4', depth: 3, width: 45, length: 84 },
      { id: '5', name: '5', depth: 3, width: 94, length: 46}
    ];
  }
}
