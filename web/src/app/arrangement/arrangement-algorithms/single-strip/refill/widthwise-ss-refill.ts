import { FlippableCompartment } from "../../common/flippable-compartment";
import { SingleStripRefillAlgorithm } from "./single-strip-refill-algorithm";

export class WidthwiseSingleStripAlgorithm extends SingleStripRefillAlgorithm {

    constructor(){
        super("ww");
    }
    
    override prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[] {
        compartments.forEach(c => c.flip(c.currentLength > c.currentWidth));
        return compartments;
    }
}

