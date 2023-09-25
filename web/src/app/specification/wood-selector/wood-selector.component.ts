import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxPlan } from '../../boxplan';
import { Wood, possibleWoods } from '../wood';

import { padList } from 'src/_partials/_cardpad';

@Component({
  selector: 'app-wood-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="prompt">
      What wood do you want the box to be made from?
    </div>
    <div class="list-wrapper">
      <div class="grid-box grid-4"
        *ngFor="let wood of possibleWoodsList">
        <div *ngIf="isWood(wood)" class="card" [ngClass]="{'selected': wood==boxPlan.getWood()}" (click)="updateWood(wood)">
            <div class="image-wrapper">
                <img [src]="wood.picture" [alt]="wood.name"/>
            </div>
            <div class="card-contents">
                <div class="card-title">{{wood.size}}mm {{wood.name}}</div>
                <div class="card-description">{{wood.description}}</div>
                <div class="card-warning"
                  *ngIf="wood.size!=boxPlan.getWood().size"
                >This is a different size, so it will change your design</div>
            </div>
        </div>
        <div *ngIf="isWood(wood)==false"></div>
      </div>
    </div>
    `,
  styleUrls: ['./wood-selector.component.scss']
})
export class WoodSelectorComponent {
  @Input() boxPlan!: BoxPlan;

  possibleWoodsList: any[] = padList(possibleWoods);
  
  isWood(val: any): boolean { return typeof val !== 'string'; }
  
  updateWood(wood: Wood){
    this.boxPlan.updateWood(wood);
  }
}
