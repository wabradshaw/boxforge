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
import { LeftoverMultistrip } from './arrangement-algorithms/multi-strip/leftover-multistrip-algorithm';
import { MostSimilarSingleStripAlgorithm } from './arrangement-algorithms/single-strip/refill/most-similar-ss-refill';
import {v4 as uuidv4} from 'uuid';

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
    new MostSimilarSingleStripAlgorithm(),
    new LeftoverMultistrip(new LengthwiseSingleStripAlgorithm()),
    new LeftoverMultistrip(new LengthwiseSingleStripAlgorithm(),3),
    new LeftoverMultistrip(new WidthwiseSingleStripAlgorithm()),
    new LeftoverMultistrip(new WidthwiseSingleStripAlgorithm(),3),
    new LeftoverMultistrip(new MostSimilarSingleStripAlgorithm())
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
        [new PlannedRow([new PlannedColumn([new FlippableCompartment(compartment)], 0)], 0)],
        0
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
    const woodWidth = boxPlan.getWood().size;
    const plannedCompartments: PlannedCompartment[] = [];

    let area = 0;

    const plannedRows = plannedBox.rows;
    
    let baseY = woodWidth;

    plannedRows.forEach(row => {      
      let rowLength = row.length;
      const rowDifference = plannedBox.width - row.width;
      const plannedColumns = row.columns;

      let evenRowPadding: number;
      let unevenRowPadding: number;

      if(rowDifference >= boxPlan.getMinPaddedCompartmentSize()){
        plannedColumns.push(new PlannedColumn([this.padCompartment(rowDifference - woodWidth, rowLength, boxPlan.getTargetWorkableDepth()!)], woodWidth));
        evenRowPadding = 0;
        unevenRowPadding = 0;
      } else {          
        evenRowPadding = Math.floor(rowDifference / plannedColumns.length);
        unevenRowPadding = rowDifference % plannedColumns.length;
      }
      
      let x = woodWidth;

      plannedColumns.forEach(col => {
          const columnDifference = rowLength - col.length;
          const colCompartments = col.compartments;

          let evenColumnPadding: number;
          let unevenColumnPadding: number;

          if(columnDifference >= boxPlan.getMinPaddedCompartmentSize()){
            colCompartments.push(this.padCompartment(col.width, columnDifference - woodWidth, boxPlan.getTargetWorkableDepth()!));
            evenColumnPadding = 0;
            unevenColumnPadding = 0;
          } else {          
            evenColumnPadding = Math.floor(columnDifference / colCompartments.length);
            unevenColumnPadding = columnDifference % colCompartments.length;
          }

          let y = baseY;

          let columnWidthPad = evenRowPadding;
          if (unevenRowPadding > 0) {
            unevenRowPadding--;
            columnWidthPad++;
          }

          colCompartments.forEach(compartment => {
              const flipped = compartment.isFlipped();
              const unpaddedLength = compartment.currentLength;
              const unpaddedWidth = compartment.currentWidth;

              let compartmentWidth = col.width + columnWidthPad;
              let compartmentLength = unpaddedLength + evenColumnPadding;
              if (unevenColumnPadding > 0) {
                unevenColumnPadding--;
                compartmentLength++;
              }
              area += compartmentLength * compartmentWidth;

              plannedCompartments.push({
                  id: compartment.id,
                  name: compartment.name,
                  depth: compartment.depth,
                  x: x,
                  y: y,
                  width: compartmentWidth,
                  length: compartmentLength,
                  targetWidth: compartment.isPadding ? 0 : unpaddedWidth,
                  targetLength: compartment.isPadding ? 0 : unpaddedLength,
                  flipped: flipped
              });

              y += compartmentLength + woodWidth;
          });

          x += col.width + woodWidth + columnWidthPad;
      });
      baseY += row.length + woodWidth;
    });

    const result = {
        width: plannedBox.width + (2 * woodWidth),
        length: plannedBox.length + (2 * woodWidth),
        compartments: plannedCompartments,
        area: area,
        wastedArea: area - boxPlan.getTargetArea(),
        algorithm: plannedBox.algorithm
    };

    return result;
  }

  padCompartment(width: number, length: number, depth:number): FlippableCompartment {
    const compartment = {
      id: uuidv4(),
      name: "Padding",
      depth: depth,
      length: length,
      width: width 
    };
    return new FlippableCompartment(compartment, false, true);
  }
}



