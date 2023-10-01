import { BoxPlan } from "src/app/boxplan";
import { PlanningAlgorithm } from "../arrangement-algorithm";
import { PlannedBox } from "../common/planned-box";
import { SingleStripAlgorithm } from "../single-strip/single-strip-algorithm";
import { PlannedRow } from "../common/planned-row";
import { FlippableCompartment } from "../common/flippable-compartment";
import { PlannedColumn } from "../common/planned-column";

export class LeftoverMultistrip implements PlanningAlgorithm {

    readonly algorithm:string;
    readonly singlestrip : SingleStripAlgorithm;
    readonly targetRowCount:number;

    constructor(singlestrip: SingleStripAlgorithm, targetRowCount:number = 2){
        this.algorithm = "ms-lo-" + singlestrip.signifier + "-" + targetRowCount;
        this.singlestrip = singlestrip;
        this.targetRowCount = targetRowCount;
    }

    plan(boxPlan: BoxPlan): PlannedBox[]{
        const compartments = boxPlan.getCompartments().map(comp => new FlippableCompartment(comp));
        if(compartments.length <= this.targetRowCount * 2){
            console.log("Not enough compartments")
            return [];
        }

        const row = this.singlestrip.planStrip(compartments, boxPlan);

        if(row.columns.length < this.targetRowCount * 2){
            console.log("Not enough columns")
            return []
        } else {
            const targetWidth = Math.ceil(row.width / this.targetRowCount);
            const sourceColumns = [...row.columns];
            const woodWidth = boxPlan.getWood().size;

            sourceColumns.sort((a,b) => b.length - a.length);

            let plannedRows:PlannedColumn[][] = [];

            for (let rowIndex = 1; rowIndex < this.targetRowCount; rowIndex++){
                let currentRowColumns:PlannedColumn[] = [];
                let currentRowLength = 0;
                let nextWidth = sourceColumns[sourceColumns.length-1].width;
                while (currentRowLength + woodWidth + nextWidth < targetWidth){
                    currentRowColumns.push(sourceColumns.pop()!);
                    currentRowLength += nextWidth;
                    nextWidth = sourceColumns[sourceColumns.length-1].width;                
                }
                plannedRows.unshift(currentRowColumns);
            }
            plannedRows.unshift(sourceColumns);

            const rows:PlannedRow[] = plannedRows.map(cs => new PlannedRow(cs, woodWidth));
            return [new PlannedBox(this.algorithm, rows, woodWidth)];
        }


    }    

}