import { Compartment } from "src/app/design/compartment";

export class FlippableCompartment {
    readonly id: string;
    readonly name: string;
    readonly depth: number;
    readonly originalLength: number;
    readonly originalWidth: number;
    readonly maxSide: number;
    readonly minSide: number;
    private _flipped: boolean;
    currentLength: number;
    currentWidth: number;
    readonly isPadding: boolean;
    
    constructor(comp: Compartment, flipped: boolean = false, isPadding: boolean = false){
        this.id = comp.id;
        this.name = comp.name;
        this.depth = comp.depth;
        this.originalLength = comp.length;
        this.originalWidth = comp.width;
        this._flipped = flipped;
        this.maxSide = Math.max(comp.width, comp.length),
        this.minSide = Math.min(comp.width, comp.length),
        this.currentLength = flipped ? comp.width : comp.length,
        this.currentWidth = flipped ? comp.length : comp.width
        this.isPadding = isPadding;
    }

    isFlipped(): boolean { return this._flipped;}

    flip = (flipTo: boolean = !this._flipped): void => {
        if(flipTo != this._flipped){
            this._flipped = flipTo;
            let placeholder = this.currentLength;
            this.currentLength = this.currentWidth;
            this.currentWidth = placeholder;
        }
    }

    clone(): FlippableCompartment {
        const clonedCompartment = new FlippableCompartment({
            id: this.id,
            name: this.name,
            depth: this.depth,
            length: this.originalLength,
            width: this.originalWidth
        }, this._flipped);
    
        return clonedCompartment;
    }

    effectiveHash(): string {
        return `${this.currentWidth}_${this.currentLength}`;
    }

    practicallyEquals(other: FlippableCompartment): boolean {
        return this.effectiveHash() === other.effectiveHash();
    }
}
