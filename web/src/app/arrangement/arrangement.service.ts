import { Injectable } from '@angular/core';
import { BoxPlan } from '../boxplan';
import { Arrangement } from './arrangement';
import { PlanningAlgorithm } from './arrangement-algorithms/arrangement-algorithm';
import { PlannedRow } from './arrangement-algorithms/common/planned-row';
import { PlannedCompartment } from './planned-compartment';
import { PlannedBox } from './arrangement-algorithms/common/planned-box';
import { FlippableCompartment } from './arrangement-algorithms/common/flippable-compartment';
import { PlannedColumn } from './arrangement-algorithms/common/planned-column';
import { LengthwiseSingleStripAlgorithm } from './arrangement-algorithms/single-strip/refill/lengthwise-ss-refill';
import { RandomSingleStripAlgorithm } from './arrangement-algorithms/single-strip/refill/random-ss-refill';
import { WidthwiseSingleStripAlgorithm } from './arrangement-algorithms/single-strip/refill/widthwise-ss-refill';
import { ShortFirstSingleStripAlgorithm } from './arrangement-algorithms/single-strip/refill/shortfirst-ss-refill';
import { AsIsAlgorithm } from './arrangement-algorithms/single-strip/naive/as-is-algorithm';
import { AsIsFlippedAlgorithm } from './arrangement-algorithms/single-strip/naive/as-is-flipped-algorithm';
import { AsIsLengthfirstAlgorithm } from './arrangement-algorithms/single-strip/naive/as-is-lengthfirst-algorithm';

@Injectable({
  providedIn: 'root'
})
export class ArrangementService {

  private _arrangementAlgorithms: PlanningAlgorithm[] = [
    new AsIsAlgorithm(),
    new AsIsFlippedAlgorithm(),
    new AsIsLengthfirstAlgorithm(),
    new LengthwiseSingleStripAlgorithm(),
    new WidthwiseSingleStripAlgorithm(),
    new ShortFirstSingleStripAlgorithm(),
    new RandomSingleStripAlgorithm(),
  ];

  planArrangements(boxPlan: BoxPlan): Arrangement[] {
    let compartmentCount = boxPlan.getCompartments().length;

    if (compartmentCount === 0){
      return [];

    } else {
      let plannedBoxes: PlannedBox[];

      if (compartmentCount === 1) { 
        plannedBoxes = this.singletonBox(boxPlan);  
      } else {
        plannedBoxes =  this._arrangementAlgorithms.flatMap(algo => algo.plan(boxPlan));
      }

      console.log(plannedBoxes);

      plannedBoxes.forEach(box => this.tidy(box));

      let uniqueBoxes = this.mergeAndDeduplicatePlannedBoxes(plannedBoxes);

      let results = uniqueBoxes.map(plan => this.arrange(plan, boxPlan));      
      
      results.sort((a,b) => a.wastedArea - b.wastedArea);

      return results;  
    }
  }

  private singletonBox(boxPlan: BoxPlan) {
    let compartment = boxPlan.getCompartments()[0];
    return [
      new PlannedBox("Singleton",
        [new PlannedRow([new PlannedColumn([new FlippableCompartment(compartment)], 0)], 0)]
      )
    ];
  }

  private tidy(plannedBox: PlannedBox) {
    plannedBox.rows.sort((a,b) => a.columns.length - b.columns.length);
    plannedBox.rows.forEach(row => row.columns.sort((a,b) => a.compartments.length - b.compartments.length));
  }

  private mergeAndDeduplicatePlannedBoxes(boxes: PlannedBox[]): PlannedBox[] {
    const boxMap = new Map<string, PlannedBox>();

    for (const box of boxes) {
        const hashValue = box.effectiveHash();
        const existingBox = boxMap.get(hashValue);

        if (existingBox) {
            existingBox.algorithm += ` | ${box.algorithm}`;
        } else {
            boxMap.set(hashValue, box);
        }
    }

    return Array.from(boxMap.values());
  }

  private arrange(plannedBox: PlannedBox, 
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

            let compartmentLength = unpaddedLength + evenPadding;
            if (unevenPadding > 0) {
              unevenPadding--;
              compartmentLength++;
            }
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
