import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxPlan } from 'src/app/boxplan';
import { Lid, possibleLids} from '../lid';

import { padList } from 'src/_partials/_cardpad';

@Component({
  selector: 'app-lid-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="prompt">
      What type of lid would you like for the box?
    </div>
    <div class="list-wrapper">
      <div class="grid-box grid-3"
      *ngFor="let lid of possibleLidsList" >
        <div *ngIf="isLid(lid)" (click)="updateLid(lid)" class="card lid-card selectable-card" [ngClass]="{'selected': lid==boxPlan.getLid()}">
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
  `,
  styleUrls: ['./lid-selector.component.scss']
})
export class LidSelectorComponent {
  @Input() boxPlan!: BoxPlan;

  possibleLidsList: any[] = padList(possibleLids);

  private listFormatter = new Intl.ListFormat('en');

  isLid(val: any): boolean { return typeof val !== 'string'; }

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

  updateLid(lid: Lid){
    this.boxPlan.updateLid(lid);
  }
}
