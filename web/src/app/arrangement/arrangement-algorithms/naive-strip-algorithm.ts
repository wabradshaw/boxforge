import { Compartment } from "src/app/design/compartment";
import { PlanningAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { PlannedBox } from "./common/planned-box";
import { PlannedRow } from "./common/planned-row";
import { PlannedColumn} from "./common/planned-column";
import { FlippableCompartment } from "./common/flippable-compartment";

export class NaiveStripAlgorithm implements PlanningAlgorithm {
    plan(boxPlan: BoxPlan): PlannedBox[] {
        let compartments = boxPlan.getCompartments();
        let woodWidth = boxPlan.getWood().size;

        return [
            this.planStrip("as supplied", compartments, woodWidth, _ => false),
            this.planStrip("flipped", compartments, woodWidth, _ => true),
            this.planStrip("max width", compartments, woodWidth, comp => comp.length > comp.width),
            this.planStrip("max length", compartments, woodWidth, comp => comp.length <= comp.width)
        ];
    }    

    private planStrip(algorithm: string,
                      compartments: Compartment[], 
                      woodWidth: number, 
                      flipAxis:(comp:Compartment) => boolean): PlannedBox {

        const columns: PlannedColumn[] = compartments.map(comp => new FlippableCompartment(comp, flipAxis(comp)))
                                                     .map(fComp => new PlannedColumn([fComp], 0));

        return {algorithm: algorithm, rows: [new PlannedRow(columns, woodWidth)]};
    }
}