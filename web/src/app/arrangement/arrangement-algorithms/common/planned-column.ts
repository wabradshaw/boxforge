import { FlippableCompartment } from "./flippable-compartment";

export class PlannedColumn {
    readonly width: number;
    readonly length: number;
    compartments: FlippableCompartment[];

    constructor(compartments: FlippableCompartment[], woodWidth: number) {        
        this.compartments = [...compartments];
        this.length = compartments.reduce((acc, comp) => acc + comp.currentLength + woodWidth, -woodWidth);        
        this.width = compartments.reduce((acc, comp) => Math.max(acc, comp.currentWidth), 0);
    }
}
