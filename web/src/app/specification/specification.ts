import { JourneyStage } from "../journey/journey-stage";
import { Wood, possibleWoods } from "./wood";
import { Lid } from "./lid";

export class Specification implements JourneyStage {
    readonly stageName!: string;
    state!: "selected" | "available" | "disabled";
    readonly wood!: Wood;
    readonly lid!: Lid;
    readonly boxName!: string;
    maxDepth?: number;
    maxWidth?: number;
    maxLength?: number;

    constructor(
        stageName: string,
        state:  "selected" | "available" | "disabled",
        wood?: Wood,
        lid?: Lid,
        boxName?: string
    ) {
        this.stageName = stageName;
        this.state = state;
        this.wood = wood || possibleWoods[0];
        this.lid = lid || {name: "todo", 
                           depthChange: 0,
                           widthChange: 0,
                           lengthChange: 0};
        this.boxName = boxName || "MyBox";
    }
}
