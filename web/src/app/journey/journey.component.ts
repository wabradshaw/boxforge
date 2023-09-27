import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JourneyBannerComponent } from './journey-banner/journey-banner.component';
import { SpecificationComponent } from '../specification/specification.component';
import { DesignComponent } from '../design/design.component';
import { ArrangementComponent } from '../arrangement/arrangement.component';
import { CustomisationComponent } from '../customisation/customisation.component';
import { ReviewComponent } from '../review/review.component';

import { Journey } from './journey';
import { BoxPlan } from 'src/app/boxplan';

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
  imports: [
    CommonModule, 
    JourneyBannerComponent, 
    SpecificationComponent,
    DesignComponent,
    ArrangementComponent,
    CustomisationComponent,
    ReviewComponent
  ],
  template: `
    <div class="journey">
      <app-journey-banner [journey]="journey"/>
      <div class="journey-wrapper">
        <div class="journey-stage-banner" [ngClass]="journey.specification.state">Specification</div>
        <app-specification [boxPlan]="boxPlan"/>
        <div class="journey-stage-banner" [ngClass]="journey.compartmentDesign.state">Compartment Design</div>
        <app-design *ngIf="journey.compartmentDesign.state !== 'disabled'" [boxPlan]="boxPlan"/>
        <div class="journey-stage-banner" [ngClass]="journey.arrangement.state">Arrangement</div>
        <app-arrangement *ngIf="journey.arrangement.state !== 'disabled'" [boxPlan]="boxPlan"/>
        <div class="journey-stage-banner" [ngClass]="journey.customisation.state">Customisation</div>
        <app-customisation  *ngIf="journey.customisation.state !== 'disabled'"/>
        <div class="journey-stage-banner" [ngClass]="journey.review.state">Review</div>
        <app-review *ngIf="journey.review.state !== 'disabled'"/>
      </div>
    </div>
  `,
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent {
  readonly boxPlan = new BoxPlan();
  journey = this.boxPlan.journey;
}
