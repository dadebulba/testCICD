
var express = require('express');
const client = require('prom-client');
var app = express();


const collectDefaultMetrics = client.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 3000 });

app.get('/', function (req, res) {
  res.send('Hello World prometheus!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});