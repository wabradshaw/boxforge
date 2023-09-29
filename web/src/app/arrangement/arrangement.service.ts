import { Injectable } from '@angular/core';
import { BoxPlan } from '../boxplan';
import { Arrangement } from './arrangement';
import { PlanningAlgorithm } from './arrangement-algorithms/arrangement-algorithm';
import { NaiveStripAlgorithm } from './arrangement-algorithms/naive-strip-algorithm';
import { SingleStripRefillAlgorithm } from './arrangement-algorithms/single-strip-refill-algorithm';
import { PlannedRow } from './arrangement-algorithms/common/planned-row';
import { PlannedCompartment } from './planned-compartment';
import { PlannedBox } from './arrangement-algorithms/common/planned-box';
import { FlippableCompartment } from './arrangement-algorithms/common/flippable-compartment';

@Injectable({
  providedIn: 'root'
})
export class ArrangementService {

  private _arrangementAlgorithms: PlanningAlgorithm[] = [
    //new TestArrangementAlgorithm(),
    new NaiveStripAlgorithm(),
    new SingleStripRefillAlgorithm()
  ];

  planArrangements(boxPlan: BoxPlan): Arrangement[] {
    let compartmentCount = boxPlan.getCompartments().length;

    if (compartmentCount === 0){
      return [];

    } else {
      let plannedBoxes: PlannedBox[];

      if (compartmentCount === 1) { 
        let compartment = boxPlan.getCompartments()[0];
        plannedBoxes = [{
                          algorithm: "Singleton", 
                          rows: [new PlannedRow([{
                            width: compartment.width,
                            length: compartment.length,
                            compartments: [new FlippableCompartment(compartment)]
                          }], 0)]
                      }];  
      } else {
        plannedBoxes =  this._arrangementAlgorithms.flatMap(algo => algo.plan(boxPlan));
      }

      let results = plannedBoxes.map(plan => this.arrange(plan, boxPlan));      
      
      results.sort((a,b) => a.wastedArea - b.wastedArea);

      return results;  
    }
  }

  arrange(plannedBox: PlannedBox, 
          boxPlan: BoxPlan): Arrangement {                        

    //TODO: loop
    const plannedRows = plannedBox.rows;
    const plannedColumns = plannedRows[0].columns;

    let area = 0;
    let woodWidth = boxPlan.getWood().size;
    let boxWidth = woodWidth;

    const plannedCompartments: PlannedCompartment[] = [];

    const rowLength = plannedColumns.reduce((acc, col) => Math.max(acc, col.length), 0);

    plannedColumns.forEach(col => {
        const difference = rowLength - col.length;
        const colCompartments = col.compartments;
        const evenPadding: number = Math.floor(difference / colCompartments.length);
        let unevenPadding: number = difference % colCompartments.length;

        const x = boxWidth;
        let y = woodWidth;

        colCompartments.forEach(compartment => {
            const flipped = compartment.isFlipped();
            const unpaddedLength = compartment.currentLength;
            const unpaddedWidth = compartment.currentWidth;

            let compartmentLength = unpaddedLength + evenPadding + unevenPadding;
            area += compartmentLength * col.width;

            plannedCompartments.push({
                id: compartment.id,
                name: compartment.name,
                depth: compartment.depth,
                x: x,
                y: y,
                width: col.width,
                length: compartmentLength,
                targetWidth: unpaddedWidth,
                targetLength: unpaddedLength,
                flipped: flipped
            });

            if (unevenPadding > 0) {
                unevenPadding--;
            }
            y += compartmentLength + woodWidth;
        });
        boxWidth += col.width + woodWidth;
    });

    const result = {
        width: boxWidth,
        length: rowLength + (2 * woodWidth),
        compartments: plannedCompartments,
        area: area,
        wastedArea: area - boxPlan.getTargetArea(),
        algorithm: plannedBox.algorithm
    };

    return result;
}
}
