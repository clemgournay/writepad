export class Stroke {
  
  constructor(startX, startY, startMS) {
    this.startX = startX;
    this.startY = startY;
    this.startMS = startMS;
    this.points = [{x: this.startX, y: this.startY, ms: this.startMS}];
  }

  addPoint(x, y, ms) {
    this.points.push({x, y, ms});
  }
}