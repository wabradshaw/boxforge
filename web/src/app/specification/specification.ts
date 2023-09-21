import { JourneyStage } from "../journey/journey-stage";
import { Wood } from "./wood";
import { Lid } from "./lid";

export interface Specification extends JourneyStage {
    boxName?: string;
    wood?: Wood;
    lid?: Lid;
    maxDepth?: number;
    maxWidth?: number;
    maxHeight?: number;
}
