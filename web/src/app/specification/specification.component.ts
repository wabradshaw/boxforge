import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxPlan } from '../boxplan';
import { Wood, possibleWoods } from './wood' ;
import { TelescopeLidComponent } from './lids/telescope-lid/telescope-lid.component';
import { SlabLidComponent } from './lids/slab-lid/slab-lid.component';
import { ClipLidComponent } from './lids/clip-lid/clip-lid.component';
import { OpenBoxComponent } from './lids/open-box/open-box.component';
import { padList } from 'src/_partials/_cardpad';

@Component({
  selector: 'app-specification',
  standalone: true,
  imports: [
    CommonModule,
    TelescopeLidComponent,
    SlabLidComponent,
    ClipLidComponent,
    OpenBoxComponent
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
          <div class="card" *ngIf="isWood(wood)" (click)="updateWood(wood)">
              <div class="image-wrapper">
                  <img [src]="wood.picture" [alt]="wood.name"/>
              </div>
              <div class="card-contents">
                  <div class="card-title" [ngClass]="{'selected': wood==boxPlan.getWood()}">{{wood.size}}mm {{wood.name}}</div>
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
        <div class="grid-box grid-3">
          <app-open-box/>
        </div>
        <div class="grid-box grid-3">
          <app-clip-lid/>
        </div>
        <div class="grid-box grid-3">
          <app-slab-lid/>
        </div>
        <div class="grid-box grid-3">
          <app-telescope-lid/>
        </div>
        <!-- Two spacer divs for alignment -->        
        <div class="grid-box grid-3"></div>
        <div class="grid-box grid-3"></div>
      </div>
    </div>
  `,
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  @Input() boxPlan!: BoxPlan;
  
  possibleWoodsList: any[] = padList(possibleWoods);

  isWood(val: any): boolean { return typeof val !== 'string'; }

  updateWood(wood: Wood){
    this.boxPlan.updateWood(wood);
  }
}
