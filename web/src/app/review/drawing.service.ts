import { Arrangement } from '../arrangement/arrangement';
import { PlannedCompartment } from '../arrangement/planned-compartment';

class InsetDefinition {
  readonly insetLength: number;
  readonly insetCount: number;
  readonly remainder: number;

  constructor(lineLength: number, perfectInset: number, maxInsets: number) {
    let evenlyDividedInsetLength = lineLength / (2 * maxInsets + 1);
    if (evenlyDividedInsetLength >= perfectInset) {
      this.insetLength = evenlyDividedInsetLength;
      this.insetCount = maxInsets;
      this.remainder = 0;
    } else if (lineLength / 3 < perfectInset) {
      this.insetLength = lineLength / 3;
      this.insetCount = 1;
      this.remainder = 0;
    } else {
      this.insetLength = perfectInset;
      this.insetCount = Math.floor((lineLength - perfectInset) / (2 * perfectInset));
      this.remainder = lineLength - ((2 * this.insetCount * perfectInset) + perfectInset);
    }
  }
}

class SvgComponent {
  readonly path: string;
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly width: number;
  readonly length: number;

  constructor(path: string, x0: number, y0: number, x1: number, y1: number){
    this.path = path;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.width = x1 - x0;
    this.length = y1 - y0;
  }
}

export class BoxSVGCreator {
  private readonly woodwidth: number;
  private readonly minInsetSide: number;
  private readonly perfectInset: number;
  private readonly maxInsets: number;

  private readonly stroke = 'stroke="black" fill="none" stroke-width="0.1"';

  constructor(woodwidth: number, perfectInset: number, maxInsets: number) {
    this.woodwidth = woodwidth;
    this.minInsetSide = this.woodwidth * 3;
    this.perfectInset = perfectInset;
    this.maxInsets = maxInsets;
  }

  private drawStraightLine(direction: number, lineLength: number): string {
    const directionCommand = direction % 2 == 0? 'h' : 'v'; 
    const scale = direction < 2 ? 1 : -1; 
    return `${directionCommand} ${scale * lineLength} `; 
  }

  private drawInsetLine(direction: number, lineLength: number, insetsPointRight: boolean): string {
    if(lineLength < this.minInsetSide){
      return this.drawStraightLine(direction, lineLength);
    } else {
      const insetDefinition = new InsetDefinition(lineLength, this.perfectInset, this.maxInsets);
      
      // Plan the movements using insetDefinition
      const directionCommand = direction % 2 == 0 ? 'h' : 'v';
      const oppositeDirectionCommand = direction % 2 == 0 ? 'v' : 'h';
      const scale = direction < 2 ? 1 : -1;
      const insetDirection = (insetsPointRight ? direction + 3 : direction + 1) % 4;
      const insetScale = insetDirection < 2 ? 1 : -1;

      const remainderPath = `${directionCommand} ${scale * insetDefinition.remainder / 2} `;
      const forward = `${directionCommand} ${scale * insetDefinition.insetLength} `;
      const left = `${oppositeDirectionCommand} ${insetScale * this.woodwidth} `;
      const right = `${oppositeDirectionCommand} ${insetScale * -this.woodwidth} `;

      // Construct the path
      let path = remainderPath + forward;
      for (let i = 0; i < insetDefinition.insetCount; i++) {
          path += right + forward + left + forward;
      }    
      path += remainderPath;

      return path.trim();
    }
  }

  private drawBase(x: number, y: number, width: number, length: number, depth: number): string {

    const topPath = this.drawInsetLine(0, width, true);
    const rightPath = this.drawInsetLine(1, length, true);
    const bottomPath = this.drawInsetLine(2, width, true);
    const leftPath = this.drawInsetLine(3, length, true);

    return `<path d="M ${x},${y} ${topPath} ${rightPath} ${bottomPath} ${leftPath} Z" ${this.stroke}/>`;
  }

  private drawSide(x: number, y: number, direction: number, sideLength: number, depth: number, shortSide: boolean): string {    
    if (shortSide){
      sideLength -= 2*this.woodwidth;
      switch(direction){
        case(0):
          x += this.woodwidth;
          break;
        case(1):
          y += this.woodwidth;
          break;
        case(2):
          x -= this.woodwidth;
          break;
        case(3):
          y -= this.woodwidth;
          break;
      }
    }
    const leftInset = this.drawInsetLine((direction + 3) % 4, depth, !shortSide);
    const straightLine = this.drawStraightLine(direction, sideLength);
    const rightInset = this.drawInsetLine((direction + 1) % 4, depth, !shortSide);
  
    // Construct the path for the side, starting at (x, y)
    return `<path d="M ${x},${y} ${leftInset} ${straightLine} ${rightInset}" ${this.stroke}/>`;
  }
  
  public drawOpenBox(x: number, y: number, width: number, length: number, depth: number): SvgComponent {
    // Check if dimensions are valid
    if (width < this.woodwidth || length < this.woodwidth || depth < this.woodwidth) {
      throw new Error('Width, length, and depth must be at least the wood width.');
    }
    
    // Draw the base
    const base = this.drawBase(depth + this.woodwidth, depth + this.woodwidth, width, length, depth);

    // Draw each side of the box. Shortest pair of sides should be on the inside.
    const shortHorizontal = width < length;

    const topSide = this.drawSide(x + depth, y + depth, 0, width, depth, shortHorizontal);
    const rightSide = this.drawSide(x + depth + width, y + depth, 1, length, depth, !shortHorizontal);   
    const bottomSide = this.drawSide(x + depth + width, y + depth + length, 2, width, depth, shortHorizontal);
    const leftSide = this.drawSide(x + depth, y + depth + length, 3, length, depth, !shortHorizontal);

    const svgContent = `
      ${base}
      ${topSide}
      ${rightSide}
      ${bottomSide}
      ${leftSide}
    `;

    return new SvgComponent(svgContent, x, y, 
      x + width + (2 * depth) + this.woodwidth,
      y + length + (2 * depth) + this.woodwidth);
  }

  private cutHolesFromInsets(isHorizontal: boolean, x: number, y: number, insets: InsetDefinition): string[] {    
    if(insets.insetCount == 0){
      return [];
    } else {
      const result: string[] = [];

      let current = isHorizontal ? x : y;
      current += (insets.remainder / 2) + insets.insetLength;

      for(let i = 0; i < insets.insetCount; i++){
        const rect = isHorizontal ? `<rect x="${current}" y="${y}" width="${insets.insetLength}" height="${this.woodwidth}" ${this.stroke}/>` 
                                  : `<rect x="${x}" y="${current}" width="${this.woodwidth}" height="${insets.insetLength}" ${this.stroke}/>`;
        result.push(rect);
        current += insets.insetLength * 2;
      }

      return result;
    }
  }

  private cutHolesFromLength(isHorizontal: boolean, x: number, y: number, lineLength: number): string[] {
    const insets = new InsetDefinition(lineLength, this.perfectInset, this.maxInsets);
    return this.cutHolesFromInsets(isHorizontal, x, y, insets);
  }

  private cutRowHoles(compartments:PlannedCompartment[][][], x: number, y: number, width: number): string[]{
    const result: string[] = [];

    const insets = new InsetDefinition(width, this.perfectInset, this.maxInsets);

    for(let r = 1; r < compartments.length; r++){
      const row = compartments[r];
      const initial = row[0][0];

      const holes = this.cutHolesFromInsets(true, x, y + initial.y - this.woodwidth, insets);
      result.push(...holes);
    }
    return result;
  }

  private cutColHoles(compartments:PlannedCompartment[][][], x: number, y: number): string[]{
    const result: string[] = [];    

    for(let r = 0; r < compartments.length; r++){
      const row = compartments[r];
      
      const initialCol = row[0];
      const initialCell = initialCol[0];
      const finalCell = initialCol[initialCol.length - 1];
      const length = finalCell.y + finalCell.length - initialCell.y;
      const insets = new InsetDefinition(length, this.perfectInset, this.maxInsets);

      for(let c = 1; c < row.length; c++){
        const col = row[c];
        const cell = col[0];

        const holes = this.cutHolesFromInsets(false, x + cell.x - this.woodwidth, y + cell.y - this.woodwidth, insets);
        result.push(...holes);
      }
    }
    return result;
  }

  private cutCellHoles(compartments:PlannedCompartment[][][], x: number, y: number): string[]{
    const result: string[] = [];    

    for(let r = 0; r < compartments.length; r++){
      const row = compartments[r];

      for(let c = 1; c < row.length; c++){
        const col = row[c];
        const width = col[0].width;
        const insets = new InsetDefinition(width, this.perfectInset, this.maxInsets);

        for(let cellId = 1; cellId < col.length; cellId++){
          const cell = col[cellId];

          const holes = this.cutHolesFromInsets(true, x + cell.x, y + cell.y - this.woodwidth, insets);
          result.push(...holes);
        }
      }
    }
    return result;
  }

  private cutBoxHoles(compartments:PlannedCompartment[][][], x: number, y: number, width: number, length: number, depth: number): string[] {
    return [
      ...this.cutRowHoles(compartments, x + depth, y + depth, width),
      ...this.cutColHoles(compartments, x + depth, y + depth),
      ...this.cutCellHoles(compartments, x + depth, y + depth)
    ];
  }

  private drawInnerBox(arrangement: Arrangement, compartments: PlannedCompartment[][][]): SvgComponent {
    const boxWidth = arrangement.width;
    const boxLength = arrangement.length;
    const boxDepth = arrangement.compartments[0].depth; //TODO

    const box = this.drawOpenBox(this.woodwidth, this.woodwidth, boxWidth, boxLength, boxDepth)
    const content = [box.path];

    const holes = this.cutBoxHoles(compartments, this.woodwidth, this.woodwidth, boxWidth, boxLength, boxDepth)
    content.push(...holes);

    return new SvgComponent(content.join(), box.x0, box.y0, box.x1, box.y1);    
  }

  private rearrange(compartments: PlannedCompartment[]): PlannedCompartment[][][] {
    if(compartments.length < 1) {
      return [];
    } else if (compartments.length == 1) {
      return [[compartments]]
    } else {
      const rows:PlannedCompartment[][][] = [];
      let cols:PlannedCompartment[][] = [];
      let cells:PlannedCompartment[] = [];

      let currentPath = [0,0,0];

      compartments.forEach( compartment => {
        const newPath = compartment.path;
        if(currentPath[0] != newPath[0]){
          cols.push(cells);
          cells = [];
          rows.push(cols);          
          cols = [];    
        } else if(currentPath[1] != newPath[1]){
          cols.push(cells);
          cells = [];
        }

        currentPath = newPath;
        cells.push(compartment);
      });
      cols.push(cells);
      rows.push(cols);
      return rows;
    }
  }

  public drawBox(arrangement: Arrangement): string {
    const compartments = this.rearrange(arrangement.compartments);
    const base = this.drawInnerBox(arrangement, compartments);

    const svgContent = `
  <svg viewBox="0 0 ${base.x1} ${base.y1}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${base.path}
  </svg>`;

    return svgContent;
  }
}