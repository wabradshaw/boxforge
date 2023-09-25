import { JourneyStage } from "./journey-stage";

/**
 * The main business journey for designing a box. This includes all of the steps in the journey:
 * 1. Specification - Choosing what the box will be made out of, and any constraints
 * 2. Compartments - Choose what will go in the box. 
 * 3. Arrange - Choose how the compartments should be arranged.
 * 4. Customise - Add notches and engravings.
 * 5. Download - Get the finished box.
 * In the future, steps for reviewing / purchasing etc could be added.
 */
export class Journey {
    readonly specification: JourneyStage;
    readonly compartmentDesign: JourneyStage;
    readonly arrangement: JourneyStage;
    readonly customisation: JourneyStage;
    readonly review: JourneyStage;

    constructor() {
        this.specification =  { stageName: 'Spec', state: 'selected'};
        this.compartmentDesign = { stageName: 'Design', state: 'disabled' };
        this.arrangement = { stageName: 'Arrange', state: 'disabled' };
        this.customisation = { stageName: 'Customise', state: 'disabled' };
        this.review = { stageName: 'Review', state: 'disabled' };
    }

    list(): JourneyStage[] {
        return [this.specification, this.compartmentDesign, this.arrangement, this.customisation, this.review];
    }
}