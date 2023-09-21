export interface Wood {
    name: string;
    size: number;
    picture: string;
    description: string;
}

export const possibleWoods: Wood[] = [
    {
        name: "MDF", 
        size: 3,
        picture: "../assets/images/woods/mdf3mm.jpg", 
        description: "A cheap and sturdy material made from wood fibres."
    },
    {
        name: "Plywood", 
        size: 2,
        picture: "../assets/images/woods/ply2mm.jpg", 
        description: "Sheets of wood layered together to give a natural finish."
    },
    {
        name: "Plywood", 
        size: 3,
        picture: "../assets/images/woods/ply3mm.jpg", 
        description: "Sheets of wood layered together to give a natural finish."
    },
    {
        name: "Bamboo", 
        size: 3,
        picture: "../assets/images/woods/bamboo3mm.jpg", 
        description: "A beatuiful wood that is incredibly strong, but can be brittle."
    }
];