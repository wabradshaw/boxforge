import { JourneyStage } from "./journey-stage";
import { Specification } from "../specification/specification";

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
    readonly specification: Specification;
    readonly compartmentDesign: JourneyStage;
    readonly arrangement: JourneyStage;
    readonly customisation: JourneyStage;
    readonly review: JourneyStage;

    constructor(
        specification?: Specification,
        compartmentDesign?: JourneyStage,
        arrangement?: JourneyStage,
        customisation?: JourneyStage,
        review?: JourneyStage,
    ) {
        this.specification = specification || { name: 'Spec', state: 'available' };
        this.compartmentDesign = compartmentDesign || { name: 'Design', state: 'selected' };
        this.arrangement = arrangement || { name: 'Arrange', state: 'disabled' };
        this.customisation = customisation || { name: 'Customise', state: 'disabled' };
        this.review = review || { name: 'Review', state: 'disabled' };
    }

    list(): JourneyStage[] {
        return [this.specification, this.compartmentDesign, this.arrangement, this.customisation, this.review];
    }
}