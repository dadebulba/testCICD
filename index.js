
var express = require('express');
var app = express();

const client = require('prom-client');
 
const collectDefaultMetrics = client.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

const histogram = new client.Histogram({
    name: 'my_apis_duration',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['api_name','method', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 500]
  });

// Probe every 5th second.
collectDefaultMetrics({ timeout: 3000 });

app.get('/', function (req, res) {
  const end = histogram.startTimer();
  res.send('Hello World prometheus!');
  end({api_name: 'index', method: req.method, 'status_code': res.status });
});

app.get('/name', getName);

async function getName(req, res) {
  const end = histogram.startTimer();
  console.log(1);
  await sleep(3000)
  console.log(2);
  res.send("Pino").status(200);
  end({api_name: 'getName', method: req.method, 'status_code': res.status });
}

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(client.register.metrics())
})

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});


// Utils

function sleep(ms) {
  return new Promise(resolve => {
      setTimeout(resolve, ms)
  })
}