import { PlanningAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { PlannedColumn } from "./common/planned-column";
import { FlippableCompartment, toLengthFlippedComponent } from "./common/flippable-compartment";
import { maxDimensionSorter } from "./common/sorters";
import { PlannedRow } from "./common/planned-row";
import { PlannedBox } from "./common/planned-box";

export class SingleStripRefillAlgorithm implements PlanningAlgorithm {
    plan(boxPlan: BoxPlan): PlannedBox[] {
        let compartments = boxPlan.getCompartments();

        if(compartments.length <= 1){
            return [];
        }

        const woodWidth = boxPlan.getWood().size;

        const sortedCompartments = compartments.map(comp => toLengthFlippedComponent(comp))
                                               .sort(maxDimensionSorter);

        const firstCompartment = sortedCompartments.shift()!;
        const maxColumnLength = firstCompartment.maxSide; 

        const plannedColumns = [new PlannedColumn([firstCompartment], woodWidth)];
        
        let columnHeadCompartment = sortedCompartments.shift();
        while(columnHeadCompartment){                               
            const columnCompartments = this.fillColumn(sortedCompartments, columnHeadCompartment, maxColumnLength, woodWidth);

            plannedColumns.push(new PlannedColumn(columnCompartments, woodWidth));
            columnHeadCompartment = sortedCompartments.shift();
        }           

        return [{algorithm: "single strip", rows: [new PlannedRow(plannedColumns, woodWidth)]}];
    }

    private fillColumn(sortedCompartments: FlippableCompartment[],
                            columnHeadCompartment: FlippableCompartment, 
                            maxColumnLength: number, 
                            woodWidth: number) {

        const columnCompartments = [columnHeadCompartment];
        const colWidth = columnHeadCompartment.currentWidth;

        let remainingLength = maxColumnLength - columnHeadCompartment.currentLength - woodWidth;
        while (sortedCompartments.length > 0 && remainingLength > woodWidth) {

            const candidateIndex = sortedCompartments.findIndex(comp => (remainingLength >= comp.currentLength && colWidth >= comp.currentWidth)
                                                                        || (remainingLength >= comp.currentWidth && colWidth >= comp.currentLength));

            if (candidateIndex > -1) {
                const candidate = sortedCompartments.splice(candidateIndex, 1)[0];

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

