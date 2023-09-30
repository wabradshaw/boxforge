import { PlannedRow } from "./planned-row";

export class PlannedBox {
    algorithm: string;    
    readonly rows: PlannedRow[];
    
    constructor(algorithm:string, rows: PlannedRow[]){
        this.algorithm = algorithm;
        this.rows = rows;
    }

    effectiveHash(): string {
        return `[${this.rows.map(r=>r.effectiveHash()).join("|")}]`;
    }

    practicallyEquals(other: PlannedBox): boolean {
        console.log(this.effectiveHash() + " vs " + other.effectiveHash());
        return this.effectiveHash() === other.effectiveHash();
    }
}
