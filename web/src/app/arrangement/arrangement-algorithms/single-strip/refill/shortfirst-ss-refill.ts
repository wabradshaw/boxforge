import { FlippableCompartment } from "../../common/flippable-compartment";
import { SingleStripRefillAlgorithm } from "./single-strip-refill-algorithm";

export class ShortFirstSingleStripAlgorithm extends SingleStripRefillAlgorithm {

    constructor(){
        super("sf");
    }
    
    override prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[] {
        compartments.forEach(c => c.flip(c.currentWidth > c.currentLength));
        return compartments.reverse();
    }
}

