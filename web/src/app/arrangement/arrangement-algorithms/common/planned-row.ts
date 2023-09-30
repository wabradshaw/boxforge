import { PlannedColumn } from "./planned-column";

export class PlannedRow {
    readonly width: number;
    readonly length: number;
    readonly columns: PlannedColumn[];

    constructor(columns: PlannedColumn[], woodWidth: number) {        
        this.columns = [...columns];
        this.length = columns.reduce((acc, col) => Math.max(acc, col.length), 0);
        this.width = columns.reduce((acc, col) => acc + col.width + woodWidth, -woodWidth);
    }

    effectiveHash(): string {
        return `[${this.columns.map(c=>c.effectiveHash()).join("|")}]`;
    }

    practicallyEquals(other: PlannedRow): boolean {
        return this.effectiveHash() === other.effectiveHash();
    }
}
