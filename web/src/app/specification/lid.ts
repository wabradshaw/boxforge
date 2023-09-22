export interface Lid {
    name: string;
    depthChange: (woodWidth: number) => number;
    widthChange: (woodWidth: number) => number;
    lengthChange: (woodWidth: number) => number;
}

export const defaultLid: Lid = {
    "name": "open-box",
    "depthChange": (woodWidth:number) => 0,
    "widthChange": (woodWidth:number) => 0,
    "lengthChange": (woodWidth:number) => 0
}

export const possibleLids: Map<string, Lid> = new Map(
    [{
        "name": "clip",
        "depthChange": (woodWidth:number) => woodWidth,
        "widthChange": (woodWidth:number) => 0,
        "lengthChange": (woodWidth:number) => 0
    },
    {
        "name": "slab",
        "depthChange": (woodWidth:number) => 2*woodWidth,
        "widthChange": (woodWidth:number) => 0,
        "lengthChange": (woodWidth:number) => 0
    },
    {
        "name": "telescopic",
        "depthChange": (woodWidth:number) => woodWidth,
        "widthChange": (woodWidth:number) => 1 + (2 * woodWidth),
        "lengthChange": (woodWidth:number) => 1 + (2 * woodWidth)
    }].map(obj => [obj.name, obj]));