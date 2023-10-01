import { BoxPlan } from "src/app/boxplan";
import { FlippableCompartment } from "../../common/flippable-compartment";
import { PlannedRow } from "../../common/planned-row";
import { SingleStripAlgorithm } from "../single-strip-algorithm";
import { PlannedColumn } from "../../common/planned-column";

export class AsIsLengthfirstAlgorithm extends SingleStripAlgorithm {
    
    constructor(){
        super("nv-lf");
    }

    override planStrip(compartments: FlippableCompartment[], boxPlan: BoxPlan): PlannedRow {
        const woodWidth = boxPlan.getWood().size;
        compartments.forEach(c => c.flip(c.currentWidth > c.currentLength));
        const columns = compartments.map(comp => new PlannedColumn([comp], woodWidth));
        return new PlannedRow(columns, woodWidth);
    }
}