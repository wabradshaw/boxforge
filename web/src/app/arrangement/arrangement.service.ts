import { Injectable } from '@angular/core';
import { BoxPlan } from '../boxplan';
import { Arrangement } from './arrangement';
import { ArrangementAlgorithm } from './arrangement-algorithms/arrangement-algorithm';
import { TestArrangementAlgorithm } from './arrangement-algorithms/test-arrangement-algorithm';
import { NaiveStripAlgorithm } from './arrangement-algorithms/naive-strip-algorithm';
import { SingleStripRefillAlgorithm } from './arrangement-algorithms/single-strip-refill-algorithm';

@Injectable({
  providedIn: 'root'
})
export class ArrangementService {

  private _arrangementAlgorithms: ArrangementAlgorithm[] = [
    //new TestArrangementAlgorithm(),
    new NaiveStripAlgorithm(),
    new SingleStripRefillAlgorithm()
  ];

  planArrangements(boxPlan: BoxPlan): Arrangement[] {
    let compartmentCount = boxPlan.getCompartments().length;
    if (compartmentCount === 0){
      return []
    } else if (compartmentCount === 1) {
      //TODO
      return [];
    } else{
      let results =  this._arrangementAlgorithms.flatMap(algo => algo.plan(boxPlan));

      results.sort((a,b) => a.wastedArea - b.wastedArea);

      return results;
    }
  }
}
