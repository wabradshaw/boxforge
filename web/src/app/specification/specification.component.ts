import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxPlan } from '../boxplan';
import { Wood, possibleWoods } from './wood';
import { Lid, possibleLids} from './lid';

import { padList } from 'src/_partials/_cardpad';

@Component({
  selector: 'app-specification',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="specification">
      <div class="intro">
        First, we need to decide what type of box you want to make.
      </div>
      <!-- TODO - box name -->
      <hr/>
      <div class="intro">
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
      <hr/>
      <div class="intro">
        What type of lid would you like for the box?
      </div>
      <div class="list-wrapper">
        <div class="grid-box grid-3"
        *ngFor="let lid of possibleLidsList" >
          <div *ngIf="isLid(lid)" (click)="updateLid(lid)" class="card lid-card" [ngClass]="{'selected': lid==boxPlan.getLid()}">
            <div class="image-wrapper" [ngClass]="lid.name + '-lid'" [innerHTML]="lid.imageHtml">
            </div>
            <div class="card-contents">
                <div class="card-title">{{lid.title}}</div>
                <div class="card-description" >{{lid.description}}{{lidChangeDescription(lid)}}</div>
            </div>
          </div>
          <div *ngIf="isLid(lid)==false"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  @Input() boxPlan!: BoxPlan;
  
  possibleWoodsList: any[] = padList(possibleWoods);
  possibleLidsList: any[] = padList(possibleLids);

  isWood(val: any): boolean { return typeof val !== 'string'; }
  isLid(val: any): boolean { return typeof val !== 'string'; }

  private listFormatter = new Intl.ListFormat('en');

  lidChangeDescription(lid: Lid){
    let woodWidth = this.boxPlan.getWood().size;
    let depthChange = lid.depthChange(woodWidth);
    let lengthChange = lid.lengthChange(woodWidth);
    let widthChange = lid.widthChange(woodWidth);

    if(depthChange == 0 && lengthChange == 0 && widthChange == 0){
      return "";
    } else { 
      
      let changes = [];    
      if (depthChange != 0){
        changes.push(`${depthChange}mm taller`);
      }
      if (lengthChange != 0){
        changes.push(`${lengthChange}mm longer`);
      }
      if (widthChange != 0){
        changes.push(`${widthChange}mm wider`);
      }

      return ` This makes it ${this.listFormatter.format(changes)}.`;
    }
  }

  updateWood(wood: Wood){
    this.boxPlan.updateWood(wood);
  }
  updateLid(lid: Lid){
    this.boxPlan.updateLid(lid);
  }
}
