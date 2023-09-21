import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JourneyBannerComponent } from './journey-banner/journey-banner.component';

import { Journey } from './journey';

/**
 * The main business journey for designing a box. This includes all of the steps in the journey:
 * 1. Specification - Choosing what the box will be made out of, and any constraints
 * 2. Compartments - Choose what will go in the box. 
 * 3. Arrange - Choose how the compartments should be arranged.
 * 4. Customise - Add notches and engravings.
 * 5. Download - Get the finished box.
 * In the future, steps for reviewing / purchasing etc could be added.
 */
@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule, JourneyBannerComponent],
  template: `
    <div>
      <app-journey-banner [journey]="journey"/>
    </div>
  `,
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent {
  readonly journey = new Journey();
}
