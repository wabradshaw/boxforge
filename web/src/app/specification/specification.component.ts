import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Specification } from './specification';
import { Wood, possibleWoods } from './wood' ;
import { padList } from 'src/_partials/_cardpad';

@Component({
  selector: 'app-specification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="specification">
      <div class="intro">
        First, we need to decide what type of box you want to make.
      </div>
      <!-- TODO - box name -->
      <div class="list-wrapper">
        <div class="grid-box grid-4"
          *ngFor="let wood of possibleWoodsList">
          <div class="card" *ngIf="isWood(wood)">
              <div class="image-wrapper">
                  <img [src]="wood.picture" [alt]="wood.name"/>
              </div>
              <div class="card-contents">
                  <div class="card-title">{{wood.size}}mm {{wood.name}}</div>
                  <div class="card-description">{{wood.description}}</div>
              </div>
          </div>
          <div *ngIf="isWood(wood)==false"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  @Input() specification!: Specification;

  possibleWoodsList: any[] = padList(possibleWoods);

  isWood(val: any): boolean { return typeof val !== 'string'; }
}
