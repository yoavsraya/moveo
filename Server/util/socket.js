const WebSocket = require('ws');

let song;

exports.connectWebSocket = (server) => {
  const wss = new WebSocket.Server({server});  

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
};

exports.POSTsong = (req, res, next) => {
    song = req.body;
    console.log('a Song has been saved');
    res.status(201).json({ message: 'Song saved successfully' });
}

exports.GETsong = (req, res, next) => {
    console.log('a Song has been send');
    res.status(200).json({ song: song });
}

