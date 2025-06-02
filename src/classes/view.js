import { Stroke } from './stroke.js';

export class View {

  constructor(app, writepad) {
    this.app = app;
    this.canvas = writepad.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    this.resize();
    this.setSettings();
  }

  setSettings() {
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = 'rgb(54, 204, 152)';
  }
  
  startStroke(stroke) {
    const point = stroke.points[0];
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    this.ctx.stroke();
  }

  drawStroke(stroke) {
    const point = stroke.points[stroke.points.length - 1];
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
  }

  endStroke() {
    this.ctx.closePath();
  }

  clear() {
    console.log('C+EAR')
    this.ctx.clearRect(0, 0, this.app.width, this.app.height);
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'rgb(54, 204, 152)';
  }
  
 
  resize() {
    this.canvas.width = this.app.width;
    this.canvas.height = this.app.height;
    this.canvas.style.width = `${this.app.width}px`;
    this.canvas.style.height = `${this.app.height}px`;
  }


}