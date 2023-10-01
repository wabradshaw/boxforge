import { PlanningAlgorithm } from "../arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { FlippableCompartment } from "../common/flippable-compartment";
import { PlannedRow } from "../common/planned-row";
import { PlannedBox } from "../common/planned-box";

export abstract class SingleStripAlgorithm implements PlanningAlgorithm {
    readonly algorithm:string;

    constructor(algorithm: string){
        this.algorithm = "ss-" + algorithm;
    }

    plan(boxPlan: BoxPlan): PlannedBox[] {        
        const compartments = boxPlan.getCompartments().map(comp => new FlippableCompartment(comp));
        const row = this.planStrip(compartments, boxPlan);
        return [new PlannedBox(this.algorithm, [row])];
    }

    abstract planStrip(compartments: FlippableCompartment[], boxPlan: BoxPlan): PlannedRow;
}

