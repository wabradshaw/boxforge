import { Injectable } from '@angular/core';
import { BoxPlan } from '../boxplan';
import { Arrangement } from './arrangement';
import { ArrangementAlgorithm } from './arrangement-algorithms/arrangement-algorithm';
import { TestArrangementAlgorithm } from './arrangement-algorithms/test-arrangement-algorithm';
import { NaiveStripAlgorithm } from './arrangement-algorithms/naive-strip-algorithm';

@Injectable({
  providedIn: 'root'
})
export class ArrangementService {

  private _arrangementAlgorithms: ArrangementAlgorithm[] = [
    new TestArrangementAlgorithm(),
    new NaiveStripAlgorithm()
  ];

  planArrangements(boxPlan: BoxPlan): Arrangement[] {
    let results =  this._arrangementAlgorithms.flatMap(algo => algo.plan(boxPlan));

    results.sort((a,b) => a.wastedArea - b.wastedArea);

    return results;
  }
}
