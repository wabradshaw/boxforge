import { FlippableCompartment } from "../../common/flippable-compartment";
import { SingleStripRefillAlgorithm } from "./single-strip-refill-algorithm";

export class RandomSingleStripAlgorithm extends SingleStripRefillAlgorithm {

    constructor(suffix:string = ""){
        super("rand" + suffix);
    }
    
    override prepareCompartments(compartments: FlippableCompartment[]): FlippableCompartment[] {
        compartments.forEach(c => c.flip(Math.random() > 0.5));
        return compartments.sort((a,b) => 0.5 - Math.random());
    }
}

