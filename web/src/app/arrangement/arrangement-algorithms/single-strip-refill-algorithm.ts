import { Compartment } from "src/app/design/compartment";
import { Arrangement } from "../arrangement";
import { ArrangementAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { PlannedCompartment } from "../planned-compartment";

export class SingleStripRefillAlgorithm implements ArrangementAlgorithm {
    plan(boxPlan: BoxPlan): Arrangement[] {
        let compartments = boxPlan.getCompartments();

        if(compartments.length > 1){
            const woodWidth = boxPlan.getWood().size;
            const targetArea = boxPlan.getTargetArea();

            let sortedComponents = compartments.map(comp => this.toLengthFlippedComponent(comp))
                                                 .sort(this.maxDimensionSorter);
            
            const first = sortedComponents.shift()!;
            const firstCompartmentLength = first.maxSide;
            const boxLength = firstCompartmentLength + (2 * woodWidth);
 
            const plannedColumns: PlannedColumn[] = [];
            plannedColumns.push({
                width: first.minSide,
                length: first.maxSide,
                compartments: [first]
            });
            
            let next = sortedComponents.shift();
            while(next){                               
                const columnCompartments: FlippableCompartment[] = [next];
                const colWidth = next.minSide;
                
                let length = next.maxSide;
                let remainingLength = firstCompartmentLength - length;
                while(sortedComponents.length > 0 && remainingLength > woodWidth){

                    const candidateIndex = sortedComponents.findIndex(comp => (remainingLength >= comp.maxSide && colWidth >= comp.minSide) 
                                                                           || (remainingLength >= comp.minSide && colWidth >= comp.maxSide));                                                       

                    if(candidateIndex > -1){
                        const candidate = sortedComponents.splice(candidateIndex, 1)[0];
                        const minFirst = remainingLength < candidate.maxSide || candidate.minSide > colWidth;

                        let change: number = woodWidth;
                        if(minFirst) {
                            candidate.flipped = !candidate.flipped;
                            change += candidate.minSide;
                        } else {
                            change += candidate.maxSide;
                        }
                        columnCompartments.push(candidate);
                        
                        length += change;
                        remainingLength -= change;
                    } else {
                        remainingLength = 0;
                    }
                }

                const nextCol: PlannedColumn = {
                    width: colWidth,
                    length: length,
                    compartments: columnCompartments
                };

                plannedColumns.push(nextCol);
                next = sortedComponents.shift();
            }

            console.log("Planned Columns");
            console.log(plannedColumns);

            let boxWidth = woodWidth;
            let area = 0;
            const plannedCompartments: PlannedCompartment[] = [];

            plannedColumns.forEach(col => {
                const difference = firstCompartmentLength - col.length;
                const colCompartments = col.compartments;
                const evenPadding: number = Math.floor(difference / colCompartments.length);
                let unevenPadding: number = difference % colCompartments.length;

                const x = boxWidth;
                let y = woodWidth;
                
                colCompartments.forEach(compartment => {
                    const flipped = compartment.flipped;
                    const originalLength = flipped ? compartment.width : compartment.length;
                    const originalWidth = flipped ? compartment.length : compartment.width;

                    let compartmentLength = originalLength + evenPadding + unevenPadding;
                    area += compartmentLength * col.width;

                    plannedCompartments.push({
                        id: compartment.id,
                        name: compartment.name,
                        depth: compartment.depth,
                        x: x,
                        y: y,
                        width: col.width,
                        length: compartmentLength,
                        targetWidth: originalWidth,
                        targetLength: originalLength,
                        flipped: flipped
                    });

                    if (unevenPadding > 0) {
                        unevenPadding--;
                    }
                    y += compartmentLength + woodWidth;
                })
                boxWidth += col.width + woodWidth;
            });
           
            console.log("Planned Compartments");
            console.log(plannedCompartments);

            return [{
                width: boxWidth,
                length: boxLength,
                compartments: plannedCompartments,
                area: area,
                wastedArea: area - targetArea
            }];
        } else {
            return [];
        }
    }

    toLengthFlippedComponent(comp: Compartment): FlippableCompartment {
        return {
            flipped: comp.width > comp.length,
            maxSide: Math.max(comp.width, comp.length),
            minSide: Math.min(comp.width, comp.length),
            id: comp.id,
            name: comp.name,
            depth: comp.depth,
            width: comp.width,
            length: comp.length
        }
    }

    maxDimensionSorter = (fCompA: FlippableCompartment, fCompB: FlippableCompartment) => {
        if (fCompB.maxSide > fCompA.maxSide) {
            return 1;
        } else if (fCompB.maxSide < fCompA.maxSide) {
            return -1;
        } else {
            return fCompB.minSide - fCompA.minSide;
        }
    }
    
}

interface PlannedColumn {
    width: number,
    length: number,
    compartments: FlippableCompartment[]
}

interface FlippableCompartment extends Compartment{
    flipped: boolean,
    maxSide: number,
    minSide: number
}

