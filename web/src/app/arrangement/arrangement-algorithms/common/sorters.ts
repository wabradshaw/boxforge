import { FlippableCompartment } from "./flippable-compartment";

export function maxDimensionSorter(fCompA: FlippableCompartment, fCompB: FlippableCompartment): number {
    if (fCompB.maxSide > fCompA.maxSide) {
        return 1;
    } else if (fCompB.maxSide < fCompA.maxSide) {
        return -1;
    } else {
        return fCompB.minSide - fCompA.minSide;
    }
}