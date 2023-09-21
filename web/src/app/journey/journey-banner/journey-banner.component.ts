import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Journey } from '../journey';

@Component({
  selector: 'app-journey-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class='journey-banner'>
      <div *ngFor="let stage of journey.list()" [ngClass]="stage.state">{{ stage.name }}</div>
    </div>
  `,
  styleUrls: ['./journey-banner.component.scss']
})
export class JourneyBannerComponent {
  @Input() journey!: Journey;
}
