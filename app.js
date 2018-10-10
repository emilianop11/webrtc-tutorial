require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(function (req, res, next) {
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
  const username = process.env.webrtc_username;
  const secret = process.env.webrtc_pass;

  res.send(generate(username, secret));
});

function generate (username, secret, expiresInSeconds = 300) {
  const cleanHmacDigest = function (hmac) {
    while ((hmac.length % 4 !== 0)) {
      hmac += '=';
    }
    hmac = hmac.replace('/ /g', '+');
    return hmac;
  };

  let hmac = crypto.createHmac('sha1', secret);
  const expires = Math.round(Date.now() / 1000) + expiresInSeconds;
  const text = expires + ':' + username;
  hmac.update(text);
  const key = cleanHmacDigest(hmac.digest('base64'));

  return {key, expires, username};
}

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
