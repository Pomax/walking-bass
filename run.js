var path = require('path'),
    express = require('express'),
    app = express(),
    Runner = require('./src/runner'),
    verbose = process.argv.indexOf("--verbose")>-1
    http = require('http'),
    server = http.Server(app),
    TrackManager = require('./src/trackmanager'),
    BPM = 120,
    player = undefined;

var bpmPos = process.argv.indexOf('--bpm');
if (bpmPos > -1) {
  BPM = process.argv[bpmPos + 1];
}

const runner = new Runner(server, app);
