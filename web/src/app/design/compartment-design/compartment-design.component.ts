import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Compartment } from '../compartment';
import { BoxPlan } from 'src/app/boxplan';
import { FormsModule } from '@angular/forms';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-compartment-design',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="card">
      <div class="card-contents"> 
        <div class="card-title"> <input type="text" [(ngModel)]="compartment.name" maxlength="24"/></div>
        <div>
          <input 
            type="number" 
            [(ngModel)]="compartment.width" 
            step="1" 
            [min]="2*boxPlan.getWood().size" 
            max="200" 
            prompt 
          /> mm x 
          <input 
            type="number" 
            [(ngModel)]="compartment.length" 
            step="1" 
            [min]="2*boxPlan.getWood().size" 
            max="200" 
            prompt 
          /> mm 
        </div>
        <div>
          <input 
            type="number" 
            [(ngModel)]="compartment.depth" 
            step="1" 
            [min]="boxPlan.getWood().size" 
            [max]="boxPlan.getTargetWorkableDepth() || 100" 
            prompt 
          /> mm deep</div>              
      </div>
      <div class="card-actions">
        <button [ngClass]="allCompartments.length >= 21 ? 'disabled' : 'available'" (click)="clone()">Clone</button>
        <button class="available" (click)="delete()">Delete</button>
      </div>
    </div>
  `,
  styleUrls: ['./compartment-design.component.scss']
})
export class CompartmentDesignComponent {
  @Input() compartment!: Compartment;
  @Input() boxPlan!: BoxPlan;
  @Input() allCompartments!: Compartment[];

  clone():void{
    if(this.allCompartments.length < 21){
      const newCompartment = {
        "id" : uuidv4(),
        "name" : this.compartment.name,
        "depth" : this.compartment.depth,
        "length" : this.compartment.length,
        "width" : this.compartment.width
      }
      this.allCompartments.push(newCompartment);    
    }
  }

  delete():void{
    const idToRemove = this.allCompartments.findIndex(c => c.id === this.compartment.id);
    if (idToRemove > 0){
      this.allCompartments.splice(idToRemove, 1);    
    }
  }
}


