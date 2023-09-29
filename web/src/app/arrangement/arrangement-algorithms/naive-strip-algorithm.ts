import { Compartment } from "src/app/design/compartment";
import { Arrangement } from "../arrangement";
import { ArrangementAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";
import { PlannedCompartment } from "../planned-compartment";

export class NaiveStripAlgorithm implements ArrangementAlgorithm {
    plan(boxPlan: BoxPlan): Arrangement[] {
        let compartments = boxPlan.getCompartments();
        let woodWidth = boxPlan.getWood().size;
        let targetArea = boxPlan.getTargetArea();

        return [
            this.planStrip("as supplied", compartments, woodWidth, targetArea, comp => false),
            this.planStrip("flipped", compartments, woodWidth, targetArea, comp => true),
            this.planStrip("max width", compartments, woodWidth, targetArea, comp => comp.length > comp.width),
            this.planStrip("max length", compartments, woodWidth, targetArea, comp => comp.length <= comp.width)
        ];
    }    

    private planStrip(algorithm: string,
                      compartments: Compartment[], 
                      woodWidth: number, 
                      targetArea: number,
                      flipAxis:(comp:Compartment) => boolean): Arrangement {

        var boxWidth = woodWidth;
        var area = 0;

        let compartmentLength = compartments.reduce((acc, comp) => Math.max(acc, flipAxis(comp) ? comp.width : comp.length), 0);
        let boxLength = compartmentLength + (2 * woodWidth);

        let plannedCompartments: PlannedCompartment[] = [];

        compartments.forEach(compartment => {
            let flip = flipAxis(compartment);
            let compartmentWidth = flip ? compartment.length : compartment.width;

            plannedCompartments.push({
                id: compartment.id,
                name: compartment.name,
                depth: compartment.depth,
                x: boxWidth,
                y: woodWidth,
                width: compartmentWidth,
                length: compartmentLength,
                targetWidth: compartmentWidth,
                targetLength: flip ? compartment.width : compartment.length,
                flipped: flip
            });
            boxWidth = boxWidth + compartmentWidth + woodWidth;
            area += compartmentWidth * compartmentLength;
        });

        return {
            width: boxWidth,
            length: boxLength,
            compartments: plannedCompartments,
            area: area,
            wastedArea: area - targetArea,
            algorithm: "Naive " + algorithm
        };
    }
}