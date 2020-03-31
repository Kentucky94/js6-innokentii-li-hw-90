const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid')
const expressWs = require('express-ws');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
expressWs(app);

const connections = {};
const dots = [];

app.ws('/canvas', function(ws, req){
  const id = nanoid();

  connections[id] = ws;

  console.log(`${id} connected. Total: ${Object.keys(connections).length}`);

  ws.send(JSON.stringify({
    type: 'SHOW_PICTURE',
    dots
  }));

  ws.on('message', msg => {
    try{
      const data = JSON.parse(msg);

      switch (data.type){
        case 'CREATE_DOT':
          Object.keys(connections).forEach(id => {
            const connection = connections[id];

            const newDot = {
              coordX: data.coordX,
              coordY: data.coordY
            };

            dots.push(newDot);

            connection.send(JSON.stringify({
              type: 'NEW_DOT',
              ...newDot
            }));
          });
          break;
        default:
          console.log('No type')
      }
    }catch(error){
      console.log(error);
    }
  });

  ws.on('close', (msg) => {
    delete connections[id];
  })
});

app.listen(port, () => {
  console.log('Try ' + port);
});
