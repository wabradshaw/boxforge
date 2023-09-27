import { Injectable } from '@angular/core';
import { BoxPlan } from '../boxplan';
import { Arrangement } from './arrangement';

@Injectable({
  providedIn: 'root'
})
export class ArrangementService {

  planArrangements(boxPlan: BoxPlan): void {
    let arrangements: Arrangement[] = [];

    //Temp
    let testArrangement: Arrangement = {
      "width": 262,
      "length": 86,
      "compartments": [
        { id: '1', name: 'Comp1', depth: 10, x: 3, y: 3, width: 50, length: 80, targetWidth: 50, targetLength: 60 },
        { id: '2', name: 'Comp2', depth: 10, x: 56, y: 3, width: 50, length: 60, targetWidth: 50, targetLength: 55},
        { id: '3', name: 'Comp3', depth: 5, x: 56, y: 66, width: 50, length: 17, targetWidth: 45, targetLength: 15 },
        { id: '4', name: 'Nigel', depth: 3, x: 109, y: 3, width: 150, length: 34, targetWidth: 150, targetLength: 34 },
        { id: '5', name: 'Nigella', depth: 3, x: 109, y: 40, width: 150, length: 34, targetWidth: 150, targetLength: 34},
        { id: '6', name: 'Nigella', depth: 3, x: 109, y: 77, width: 150, length: 6, targetWidth: 140, targetLength: 5 }
      ],
      "area": 262*86,
      "wastedArea": (262*86) - ((50*60)+(50*55)+(45*15)+(150*34)+(150*34)+(140*5)) 
    }
    let testArrangement2: Arrangement = {
      "width": 156,
      "length": 138,
      "compartments": [
        { id: '1', name: 'Comp1', depth: 10, x: 3, y: 85, width: 65, length: 50, targetWidth: 60, targetLength: 50 },
        { id: '2', name: 'Comp2', depth: 10, x: 71, y: 85, width: 60, length: 50, targetWidth: 55, targetLength: 50},
        { id: '3', name: 'Comp3', depth: 5, x: 134, y: 85, width: 19, length: 50, targetWidth: 15, targetLength: 45 },
        { id: '4', name: 'Nigel', depth: 3, x: 3, y: 3, width: 150, length: 34, targetWidth: 150, targetLength: 34 },
        { id: '5', name: 'Nigella', depth: 3, x: 3, y: 40, width: 150, length: 34, targetWidth: 150, targetLength: 34},
        { id: '6', name: 'Nigella', depth: 3, x: 3, y: 77, width: 150, length: 5, targetWidth: 140, targetLength: 5 }
      ],
      "area": 156*138,
      "wastedArea": (156*138) - ((50*60)+(50*55)+(45*15)+(150*34)+(150*34)+(140*5)) 
    }
    arrangements.push(testArrangement);
    arrangements.push(testArrangement2);
    //

    boxPlan.updateArrangements(arrangements);
    console.log(boxPlan);
  }
}
