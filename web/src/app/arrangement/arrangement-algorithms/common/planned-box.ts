import { PlannedRow } from "./planned-row";

export class PlannedBox {
    readonly algorithm: string;    
    readonly rows: PlannedRow[];
    
    constructor(algorithm:string, rows: PlannedRow[]){
        this.algorithm = algorithm;
        this.rows = rows;
    }
}
