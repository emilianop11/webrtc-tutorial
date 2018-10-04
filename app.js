const express = require('express')
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const Voxbone = require('voxbone-webrtc');
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.readFile('index.html', null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write('Whoops! File not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
});

app.post('/logs', (req, res) => {
  console.log(req.body);
  res.status(200);
});

app.get('/token_config', function (req, res) {
  var voxbone = new Voxbone({
    voxrtcUsername: process.env.webrtc_username,
    voxrtcSecret: process.env.webrtc_pass,
    voxrtcExpiresInSeconds: 300
  });

  voxrtc_config = voxbone.generate();
  res.send(voxrtc_config);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});
