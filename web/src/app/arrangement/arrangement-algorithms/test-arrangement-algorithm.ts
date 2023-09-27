import { Compartment } from "src/app/design/compartment";
import { Arrangement } from "../arrangement";
import { ArrangementAlgorithm } from "./arrangement-algorithm";
import { BoxPlan } from "src/app/boxplan";

export class TestArrangementAlgorithm implements ArrangementAlgorithm {
    plan(boxPlan: BoxPlan): Arrangement[] {
        return [{
            "width": 262,
            "length": 86,
            "compartments": [
            { id: '1', name: 'Comp1', depth: 10, x: 3, y: 3, width: 50, length: 80, targetWidth: 50, targetLength: 60, flipped: false },
            { id: '2', name: 'Comp2', depth: 10, x: 56, y: 3, width: 50, length: 60, targetWidth: 50, targetLength: 55, flipped: false },
            { id: '3', name: 'Comp3', depth: 5, x: 56, y: 66, width: 50, length: 17, targetWidth: 45, targetLength: 15, flipped: false },
            { id: '4', name: 'Short', depth: 3, x: 109, y: 3, width: 150, length: 34, targetWidth: 150, targetLength: 34, flipped: false  },
            { id: '5', name: 'Longer Name', depth: 3, x: 109, y: 40, width: 150, length: 34, targetWidth: 150, targetLength: 34, flipped: false },
            { id: '6', name: 'Long Name', depth: 3, x: 109, y: 77, width: 150, length: 6, targetWidth: 140, targetLength: 5, flipped: false }
            ],
            "area":  (50*80)+(50*60)+(50*17)+(150*34)+(150*34)+(150*6),
            "wastedArea": (50*80)+(50*60)+(50*17)+(150*34)+(150*34)+(150*6) - ((50*60)+(50*55)+(45*15)+(150*34)+(150*34)+(140*5)) 
        },
        {
            "width": 156,
            "length": 138,
            "compartments": [
            { id: '1', name: 'Comp1', depth: 10, x: 3, y: 85, width: 65, length: 50, targetWidth: 60, targetLength: 50, flipped: true  },
            { id: '2', name: 'Comp2', depth: 10, x: 71, y: 85, width: 60, length: 50, targetWidth: 55, targetLength: 50, flipped: true },
            { id: '3', name: 'Comp3', depth: 5, x: 134, y: 85, width: 19, length: 50, targetWidth: 15, targetLength: 45, flipped: true  },
            { id: '4', name: 'Short', depth: 3, x: 3, y: 3, width: 150, length: 34, targetWidth: 150, targetLength: 34, flipped: false  },
            { id: '5', name: 'Longer Name', depth: 3, x: 3, y: 40, width: 150, length: 34, targetWidth: 150, targetLength: 34, flipped: false },
            { id: '6', name: 'Long Name', depth: 3, x: 3, y: 77, width: 150, length: 5, targetWidth: 140, targetLength: 5, flipped: false  }
            ],
            "area": (65*50)+(60*50)+(19*50)+(150*34)+(150*34)+(150*5),
            "wastedArea": (65*50)+(60*50)+(19*50)+(150*34)+(150*34)+(150*5) - ((50*60)+(50*55)+(45*15)+(150*34)+(150*34)+(140*5)) 
        }];
    }    
}