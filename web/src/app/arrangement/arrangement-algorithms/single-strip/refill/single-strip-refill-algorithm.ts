import { BoxPlan } from "src/app/boxplan";
import { PlannedColumn } from "../../common/planned-column";
import { FlippableCompartment } from "../../common/flippable-compartment";
import { maxDimensionSorter } from "../../common/sorters";
import { PlannedRow } from "../../common/planned-row";
import { SingleStripAlgorithm } from "../single-strip-algorithm";

export abstract class SingleStripRefillAlgorithm extends SingleStripAlgorithm {
 
    abstract prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[];

    override planStrip(compartments: FlippableCompartment[], boxPlan: BoxPlan): PlannedRow {
        const woodWidth = boxPlan.getWood().size;

        const compartmentsByLongestDimension = compartments.sort(maxDimensionSorter);

        const firstCompartment = compartmentsByLongestDimension.shift()!;
        if(firstCompartment.currentWidth > firstCompartment.currentLength){
            firstCompartment.flip();
        }
        const maxColumnLength = firstCompartment.maxSide;
        
        const plannedColumns = [new PlannedColumn([firstCompartment], woodWidth)];

        const remainingCompartments = this.prepareCompartments(compartmentsByLongestDimension);

        let columnHeadCompartment = remainingCompartments.shift();
        while (columnHeadCompartment) {
            const columnCompartments = this.fillColumn(compartments, columnHeadCompartment, maxColumnLength, woodWidth);

            plannedColumns.push(new PlannedColumn(columnCompartments, woodWidth));
            columnHeadCompartment = compartments.shift();
        }

        return new PlannedRow(plannedColumns, woodWidth);
    }

    private fillColumn(compartments: FlippableCompartment[],
                       columnHeadCompartment: FlippableCompartment, 
                       maxColumnLength: number, 
                       woodWidth: number) {

        const columnCompartments = [columnHeadCompartment];
        const colWidth = columnHeadCompartment.currentWidth;

        let remainingLength = maxColumnLength - columnHeadCompartment.currentLength - woodWidth;
        while (compartments.length > 0 && remainingLength > woodWidth) {

            const candidateIndex = compartments.findIndex(comp => (remainingLength >= comp.currentLength && colWidth >= comp.currentWidth)
                                                                        || (remainingLength >= comp.currentWidth && colWidth >= comp.currentLength));

            if (candidateIndex > -1) {
                const candidate = compartments.splice(candidateIndex, 1)[0];

                const needsFlipping = remainingLength < candidate.currentLength || colWidth < candidate.currentWidth;                    
                if (needsFlipping) {
                    candidate.flip();
                } 

                columnCompartments.push(candidate);                    
                remainingLength -= (woodWidth + candidate.currentLength);
            } else {
                remainingLength = 0;
            }
        }
        return columnCompartments;
    }
}

