import { FlippableCompartment } from "../../common/flippable-compartment";
import { SingleStripRefillAlgorithm } from "./single-strip-refill-algorithm";

export class LengthwiseSingleStripAlgorithm extends SingleStripRefillAlgorithm {

    constructor(){
        super("lw");
    }
    
    override prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[] {
        compartments.forEach(c => c.flip(c.currentWidth > c.currentLength));
        return compartments;
    }
}

