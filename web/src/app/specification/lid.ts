export interface Lid {
    name: string;
    title: string;
    description: string;
    depthChange: (woodWidth: number) => number;
    widthChange: (woodWidth: number) => number;
    lengthChange: (woodWidth: number) => number;
    imageHtml: string;
}

export const possibleLids: Lid[] = [
    {
        "name": "open-box",
        "title": "Open Box",
        "description": "A box without a lid. This is the cheapest and smallest option.",
        "depthChange": (woodWidth:number) => 0,
        "widthChange": (woodWidth:number) => 0,
        "lengthChange": (woodWidth:number) => 0,
        "imageHtml": '<img src="/assets/images/lids/open.svg" alt="An open box" class="selectable"/>'
    },
    {
        "name": "clip",
        "title": "Clip",
        "description": "A box with a notched lid that clips into the box. The box has raised tabs that slot into the lid.",
        "depthChange": (woodWidth:number) => woodWidth,
        "widthChange": (woodWidth:number) => 0,
        "lengthChange": (woodWidth:number) => 0,
        "imageHtml": `
            <img src="/assets/images/lids/clip-box.svg" alt="An open box with notches for a lid to fit into" class="selectable"/>
            <img src="/assets/images/lids/clip-lid-mid.svg" class="lid clip"/>
            <img src="/assets/images/lids/clip-fore.svg"/>
            <img src="/assets/images/lids/clip-lid.svg" alt="A lid with notches in it" class="lid clip"/>
        `
    },
    {
        "name": "slab",
        "title": "Slab",
        "description": "A box with a flat lid. The lid has two layers, one that fits on top of the box and one that sits inside it.",
        "depthChange": (woodWidth:number) => 2*woodWidth,
        "widthChange": (woodWidth:number) => 0,
        "lengthChange": (woodWidth:number) => 0,
        "imageHtml": `
            <img src="/assets/images/lids/slab-box.svg" alt="An open box" class="selectable"/>
            <img src="/assets/images/lids/slab-lid-back.svg" class="lid slab"/>
            <img src="/assets/images/lids/slab-fore.svg"/>
            <img src="/assets/images/lids/slab-lid.svg" alt="A flat lid" class="lid slab"/>
        `
    },
    {
        "name": "telescopic",
        "title": "Telescopic",
        "description": "A box with a slip on lid.",
        "depthChange": (woodWidth:number) => woodWidth,
        "widthChange": (woodWidth:number) => 1 + (2 * woodWidth),
        "lengthChange": (woodWidth:number) => 1 + (2 * woodWidth),
        "imageHtml": `
            <img src="/assets/images/lids/telescope-box.svg" alt="An open box" class="selectable"/>
            <img src="/assets/images/lids/telescope-lid.svg" alt="A slip on lid" class="lid telescope"/>
        `
    }
];

export const defaultLid: Lid = possibleLids[0];