import { PlanningAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { PlannedColumn } from "./common/planned-column";
import { FlippableCompartment } from "./common/flippable-compartment";
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

        const compartmentsByLongestDimension = compartments.map(comp => new FlippableCompartment(comp))
                                                           .sort(maxDimensionSorter);

        return [
            this.planStrip("lengthwise", compartmentsByLongestDimension, woodWidth, 
                                    comp => comp.currentWidth > comp.currentLength,
                                    (_a,_b) => 1),
            this.planStrip("widthwise", compartmentsByLongestDimension, woodWidth, 
                                    comp => comp.currentLength > comp.currentWidth,
                                    (_a,_b) => 1),
            this.planStrip("short first", compartmentsByLongestDimension, woodWidth, 
                                    comp => comp.currentWidth > comp.currentLength,
                                    (_a,_b) => -1),
            this.planStrip("randomised", compartmentsByLongestDimension, woodWidth, 
                                    _ => Math.random() > 0.5,
                                    (_a,_b) => 0.5 - Math.random())                                    
        ];
    }

    private planStrip(algorithm: string, originalCompartments: FlippableCompartment[], woodWidth: number, 
                      flipAxisCondition: (comp:FlippableCompartment) => boolean,
                      sorter: (a:FlippableCompartment, b:FlippableCompartment) => number): PlannedBox {
        
        const compartments = originalCompartments.map(c => c.clone());

        const firstCompartment = compartments.shift()!;
        if(firstCompartment.currentWidth > firstCompartment.currentLength){
            firstCompartment.flip();
        }
        const maxColumnLength = firstCompartment.maxSide;
        
        const plannedColumns = [new PlannedColumn([firstCompartment], woodWidth)];

        compartments.forEach(c => c.flip(flipAxisCondition(c)));
        compartments.sort(sorter);

        let columnHeadCompartment = compartments.shift();
        while (columnHeadCompartment) {
            const columnCompartments = this.fillColumn(compartments, columnHeadCompartment, maxColumnLength, woodWidth);

            plannedColumns.push(new PlannedColumn(columnCompartments, woodWidth));
            columnHeadCompartment = compartments.shift();
        }

        let result = new PlannedBox("single strip - " + algorithm, 
                                    [new PlannedRow(plannedColumns, woodWidth)]);
        return result;
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

