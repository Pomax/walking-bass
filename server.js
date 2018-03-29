var path = require('path'),
    express = require('express'),
    app = express(),
    verbose = process.argv.indexOf("--verbose")>-1
    http = require('http'),
    server = http.Server(app),
    TrackManager = require('./trackmanager'),
    BPM = 120,
    player = undefined;

var bpmPos = process.argv.indexOf('--bpm');
if (bpmPos > -1) {
  BPM = process.argv[bpmPos + 1];
}

server.listen(process.env.PORT || 8080, function(){
  console.log('listening on *:8080');
  player = new TrackManager(BPM);
  player.play();
});




/*

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err) {
  if (stop) stop();
  process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

*/