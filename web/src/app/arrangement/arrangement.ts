import { PlannedCompartment } from "./planned-compartment";

export interface Arrangement {
    width: number;
    length: number;
    compartments: PlannedCompartment[];
    area: number;
    wastedArea: number;
}
