export class SocketManager {
  
  constructor(app) {
    this.app = app;
    this.socket = null;
    this.socket = io(this.app.apiURL, {query: {mode: 'writepad', parentID: this.app.parentID}});
  }

  init() {
    this.socket.on('new character', () => {
      this.app.clear();
      this.app.unlock();
    });
  }

  emit (event, ...data) {
    this.socket.emit(event, ...data);
  }

}