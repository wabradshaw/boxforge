import { BoxPlan } from "src/app/boxplan";
import { Arrangement } from "../arrangement";

export interface ArrangementAlgorithm {
    plan: (boxPlan: BoxPlan) => Arrangement[]
}