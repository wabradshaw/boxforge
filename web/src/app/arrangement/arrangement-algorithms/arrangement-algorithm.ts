import { BoxPlan } from "src/app/boxplan";
import { PlannedBox } from "./common/planned-box";

export interface PlanningAlgorithm {
    plan: (boxPlan: BoxPlan) => PlannedBox[]
}