import { PlanningAlgorithm } from "../arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { FlippableCompartment } from "../common/flippable-compartment";
import { PlannedRow } from "../common/planned-row";
import { PlannedBox } from "../common/planned-box";

export abstract class SingleStripAlgorithm implements PlanningAlgorithm {
    readonly algorithm:string;
    readonly signifier:string;

    constructor(algorithm: string){
        this.signifier = algorithm;
        this.algorithm = "ss-" + algorithm;
    }

    plan(boxPlan: BoxPlan): PlannedBox[] {        
        const compartments = boxPlan.getCompartments().map(comp => new FlippableCompartment(comp));
        const row = this.planStrip(compartments, boxPlan);
        const woodWidth = boxPlan.getWood().size;
        return [new PlannedBox(this.algorithm, [row], woodWidth)];
    }

    abstract planStrip(compartments: FlippableCompartment[], boxPlan: BoxPlan): PlannedRow;
}

