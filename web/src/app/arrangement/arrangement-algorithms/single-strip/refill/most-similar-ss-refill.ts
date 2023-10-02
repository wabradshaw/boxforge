import { FlippableCompartment } from "../../common/flippable-compartment";
import { PlannedColumn } from "../../common/planned-column";
import { SingleStripRefillAlgorithm } from "./single-strip-refill-algorithm";

export class MostSimilarSingleStripAlgorithm extends SingleStripRefillAlgorithm {

    constructor(){
        super("ms");
    }
    
    override planFirstColumn(compartments: FlippableCompartment[], woodWidth: number): PlannedColumn {
        const dimensionCountMap: Map<number, number> = new Map();
        const dimensionLengthMap: Map<number, number> = new Map();
    
        // Count the occurrences of each dimension and map compartments to their dimensions
        compartments.forEach(compartment => {
            const dimensions = compartment.currentWidth === compartment.currentLength
            ? [compartment.currentWidth]
            : [compartment.currentWidth, compartment.currentLength];

            dimensions.forEach(dimension => {
                const otherDimension = dimension == compartment.currentWidth ? compartment.currentLength : compartment.currentWidth;

                if(dimensionCountMap.has(dimension)){
                    dimensionCountMap.set(dimension, dimensionCountMap.get(dimension)! + 1);
                    dimensionLengthMap.set(dimension, dimensionLengthMap.get(dimension)! + woodWidth + otherDimension);
                } else {
                    dimensionCountMap.set(dimension, 1);
                    dimensionLengthMap.set(dimension, otherDimension);
                }
            });
        });
    
        const sortedDimensions = [...dimensionCountMap.keys()].sort((a,b) => dimensionLengthMap.get(b)! - dimensionLengthMap.get(a)!);
        const targetDimension:number = sortedDimensions[0];         
        
        sortCompartments();

        let currentLength = -woodWidth;
        const secondLongest:number = dimensionLengthMap.get(sortedDimensions[1]) || 0;
        const columnCompartments:FlippableCompartment[] = [];
        while(compartments.length > 1 && compartments[0].currentWidth == targetDimension && currentLength < secondLongest){
            const currentCompartment = compartments.shift()!;
            const change = currentCompartment.currentLength + woodWidth;
            currentLength += change;
            columnCompartments.push(currentCompartment);            
        }
        dimensionLengthMap.set(targetDimension, dimensionLengthMap.get(targetDimension)! + woodWidth - currentLength);

        // Needs a second sort to handle the remaining compartments in the target dimension
        sortCompartments();

        return new PlannedColumn(columnCompartments, woodWidth);

        function sortCompartments() {
            compartments.forEach(comp => {
                const width = comp.currentWidth;
                const length = comp.currentLength;
    
                if(width !== length && 
                    (length === targetDimension || dimensionLengthMap.get(length)! > dimensionLengthMap.get(width)!)){
                    comp.flip()
                }
            });

            compartments.sort((a, b) => {
                let result = dimensionLengthMap.get(b.currentWidth)! - dimensionLengthMap.get(a.currentWidth)!;
                if (result == 0) {
                    result = b.currentWidth - a.currentWidth;
                }
                if (result == 0) {
                    result = b.currentLength - a.currentLength;
                }
                return result;
            });
        }
    }

    override prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[] {     
        // No need to sort, compartments are already sorted.   
        return compartments;
    }
}

