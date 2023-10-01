import { PlannedRow } from "./planned-row";

export class PlannedBox {
    algorithm: string;    
    readonly rows: PlannedRow[];
    readonly width: number;
    readonly length: number;
    
    constructor(algorithm:string, rows: PlannedRow[], woodWidth: number){
        this.algorithm = algorithm;
        this.rows = rows;
        this.length = rows.reduce((acc, row) => acc + row.length + woodWidth, -woodWidth);        
        this.width = rows.reduce((acc, row) => Math.max(acc, row.width), 0);
    }

    effectiveHash(): string {
        return `[${this.rows.map(r=>r.effectiveHash()).join("|")}]`;
    }

    practicallyEquals(other: PlannedBox): boolean {
        console.log(this.effectiveHash() + " vs " + other.effectiveHash());
        return this.effectiveHash() === other.effectiveHash();
    }
}
