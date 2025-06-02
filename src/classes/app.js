import { SocketManager } from './socket-manager.js';
import { Stroke } from './stroke.js';
import { View } from './view.js';

export class App {
  
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.parentID = urlParams.get('parent');
    this.apiURL = 'https://kanji-server.onrender.com';
    this.writepad = document.querySelector('#writepad');
    this.canvasCont = writepad.querySelector('.canvas-cont');
    this.clearBtn = this.writepad.querySelector('.clear.btn');
    this.submitBtn = this.writepad.querySelector('.submit.btn');
    this.socketManager = new SocketManager(this);
    this.view = new View(this, this.writepad);
    this.width = this.canvasCont.offsetWidth;
    this.height = this.canvasCont.offsetHeight;
    this.time = null;
    this.drawing = false;
    this.strokes = [];
    this.stroke = null;
  }

  run() {
    this.socketManager.init();
    this.view.init();
    this.events();
  }

  clear() {
    this.time = null;
    this.view.clear();
    this.strokes = [];
  }

  async submit() {
    const strokes = [];
    for (let stroke of this.strokes) {
      const xValues = stroke.points.map(p => p.x);
      const yValues = stroke.points.map(p => p.y); 
      const msValues = stroke.points.map(p => p.ms);
      const newStroke = [xValues, yValues, msValues];
      strokes.push(newStroke);
    }

    this.lock();
    this.socketManager.emit('send drawing', {
      width: this.width,
      height: this.height,
      device: navigator.userAgent,
      strokes
    });
  }


  startStroke(pageX, pageY) {
    const rect = this.canvasCont.getBoundingClientRect();
    const x = pageX - rect.left;
    const y = pageY - rect.top;
    this.drawing = true;
    if (!this.time) this.time = new Date().getTime();
    const ms = new Date().getTime() - this.time;
    this.stroke = new Stroke(x, y, ms); 
    this.view.startStroke(this.stroke);
  }

  drawStroke(pageX, pageY) {
    if (this.drawing) {
      const rect = this.canvasCont.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;
      const ms = new Date().getTime() - this.time;
      this.stroke.addPoint(x, y, ms);
      this.view.drawStroke(this.stroke);
    }
  }

  endStroke() {
    if (this.drawing) {
      this.drawing = false;
      this.strokes.push(this.stroke);
      this.stroke = null;
      this.view.endStroke();
    }
  }

  events() {
    this.canvasCont.ontouchstart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startStroke(touch.pageX, touch.pageY);
    }
    this.canvasCont.onmousedown = (e) => {
      this.startStroke(e.pageX, e.pageY);
    }
    
    this.canvasCont.ontouchmove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.drawStroke(touch.pageX, touch.pageY);
    }
    this.canvasCont.onmousemove = (e) => {
      this.drawStroke(e.pageX, e.pageY);
    }

    this.canvasCont.ontouchend = (e) => {
      this.endStroke();
    }
    this.canvasCont.onmouseup = () => {
      this.endStroke();
    }

    this.clearBtn.onclick = () => {
      this.clear();
    }

    this.submitBtn.onclick = () => {
      this.submit();
    }

  }

  
  lock() {
    this.submitBtn.classList.add('locked');
  }
    
  unlock() {
    this.submitBtn.classList.remove('locked');
  }

}