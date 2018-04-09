const fs = require('fs'),
      express = require('express'),
	  socketio = require('socket.io');

module.exports = class Runner {
	constructor(server, app) {
		this.server = server
		this.app = app;
		this.setupIO(server);
		this.setupRoutes(app);
		this.socketSrc = fs.readFileSync('./node_modules/socket.io-client/dist/socket.io.min.js');
		this.startServer();
		this.socket = {emit:()=>{}};
		this.setupBreakBehaviour();
	}

	startServer() {
		this.server.listen(process.env.PORT || 8080, () => {
		  console.log('listening on *:8080');
		  let player = this.player = new TrackManager(this, BPM);
		});
	}

	cleanup() {
		this.player.cleanup();
	}

	send(eventName, data) {
		this.socket.emit(eventName, JSON.stringify(data));
	}

	setupIO(server) {
		let io = this.io = socketio(server);

		io.sockets.on('connection', socket => {
			console.log("UI Connected");

			this.socket = socket;

			socket.emit('connected', 'you are now connected.');

			socket.on('start', data => {
				console.log('starting...');
				this.player.play();
			});

			socket.on('stop', data => {
				console.log('stopping...');
				this.player.stop();
			});
		});
	}

	setupRoutes(app) {
		app.get('/version', (q,s) => {
			this.sendVesion();
		});

		app.get('/socket.io.js', (q,s) => {
			this.serveSocketIOClientCode(q,s);
		});

		app.use(express.static('./public'))
	}

	sendVersion(req, res) {
		res.json({ version: 'v1' });
	}

	serveSocketIOClientCode(req, res) {
		res.write(this.socketSrc);
		res.end();
	}

	setupBreakBehaviour() {
		process.on("SIGINT",  () => {
			console.log("Stopping all playback...")
			this.cleanup();
			console.log("All playback stopped.");
			process.exit();
		});
	}
};
