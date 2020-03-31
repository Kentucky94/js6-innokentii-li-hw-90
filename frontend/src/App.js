import React, {Component, createRef} from 'react';

class App extends Component {
  state = {
    dots: [],
  };


  componentDidMount() {
    this.websocket = new WebSocket('ws://localhost:8080/canvas');

    this.websocket.onmessage = (message) => {

      try{
        const data = JSON.parse(message.data);

        switch(data.type){
          case 'NEW_DOT':
            console.log(data);
            this.drawDot(data.coordX, data.coordY);
            break;
          case 'SHOW_PICTURE':
            data.dots.forEach(dot => {
              this.drawDot(dot.coordX, dot.coordY);
            });
            break;
          default:
            console.log('No type');
        }
      }catch(e){
        console.log(e);
      }
    };
  }

  drawDot = (x, y) => {
    const ctx = this.canvas.current.getContext('2d');

    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 10, 10);
  };

  sendDot = (coordX, coordY) => {
    const message = {
      type: 'CREATE_DOT',
      coordX,
      coordY
    };

    this.websocket.send(JSON.stringify(message))
  };

  onCanvasClick = e => {
    e.persist();

    const coordX = e.pageX - e.target.offsetLeft;
    const coordY = e.pageY - e.target.offsetTop;

    this.drawDot(coordX, coordY);

    this.sendDot(coordX, coordY);
  };

  canvas = createRef();

  render() {
    return (
      <div style={{"padding": "20px"}}>
        <h3>Canvas App</h3>
        <canvas
          onClick={this.onCanvasClick}
          ref={this.canvas}
          height="500"
          width="800"
          style={{
            "border": "1px solid grey"
          }}
        />
      </div>
    );
  }
}

export default App;

