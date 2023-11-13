class InsetDefinition {
  insetLength: number;
  insetCount: number;
  remainder: number;

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

export class BoxSVGCreator {
  private readonly woodwidth: number;
  private readonly minSide: number;
  private readonly perfectInset: number;
  private readonly maxInsets: number;

  private readonly stroke = 'stroke="black" fill="none" stroke-width="0.1"';

  constructor(woodwidth: number, perfectInset: number, maxInsets: number) {
    this.woodwidth = woodwidth;
    this.minSide = this.woodwidth * 3;
    this.perfectInset = perfectInset;
    this.maxInsets = maxInsets;
  }

  private drawStraightLine(direction: number, lineLength: number): string {
    const directionCommand = direction % 2 == 0? 'h' : 'v'; 
    const scale = direction < 2 ? 1 : -1; 
    return `${directionCommand} ${scale * lineLength} `; 
  }

  private drawInsetLine(direction: number, lineLength: number, insetsPointRight: boolean): string {
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
    const leftInset = this.drawInsetLine((direction + 3) % 4, depth - this.woodwidth, !shortSide);
    const straightLine = this.drawStraightLine(direction, sideLength);
    const rightInset = this.drawInsetLine((direction + 1) % 4, depth - this.woodwidth, !shortSide);
  
    // Construct the path for the side, starting at (x, y)
    return `<path d="M ${x},${y} ${leftInset} ${straightLine} ${rightInset}" ${this.stroke}/>`;
  }
  
  public drawBox(width: number, length: number, depth: number): string {
    // Check if dimensions are valid
    if (width < this.minSide || length < this.minSide || depth < this.minSide) {
      throw new Error('Width, length, and depth must be at least three times the wood width.');
    }
    
    // Draw the base
    const base = this.drawBase(depth + this.woodwidth, depth + this.woodwidth, width, length, depth);

    // Draw each side of the box. Shortest pair of sides should be on the inside.
    const shortHorizontal = width < length;

    const topSide = this.drawSide(this.woodwidth + depth, this.woodwidth + depth, 0, width, depth, shortHorizontal);
    const rightSide = this.drawSide(this.woodwidth + depth + width, this.woodwidth + depth, 1, length, depth, !shortHorizontal);   
    const bottomSide = this.drawSide(this.woodwidth + depth + width, this.woodwidth + depth + length, 2, width, depth, shortHorizontal);
    const leftSide = this.drawSide(this.woodwidth + depth, this.woodwidth + depth + length, 3, length, depth, !shortHorizontal);

    const svgContent = `
  <svg viewBox="0 0 ${(width + (depth * 2) + (this.woodwidth * 2))} ${(length + (depth * 2) + (this.woodwidth * 2))}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${base}
    ${topSide}
    ${rightSide}
    ${bottomSide}
    ${leftSide}    
  </svg>`;

    return svgContent;
  }
}