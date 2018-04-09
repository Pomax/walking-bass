var haveSocket = (typeof socket !== "undefined");
var playStart = Date.now();

var theory = {
	currentChord: { key: 'C' },
	sharps: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
	flats:  ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'],
	noteToName: (note) => {
		let key = note % 12;
		let lut = theory.currentChord.key.indexOf('b'>-1) ? theory.flats : theory.sharps;
		return '' + lut[key] + Math.floor(note/12);
	}
};

function send(evtname, data) {
  if (haveSocket) {
    socket.emit(evtname, data);
  }
}

function processStep(msg) {
	let data = typeof msg === 'object' ? msg : JSON.parse(msg);
	let type = data.trackType;
	let details = data.data;
	let tick = Date.now() - playStart;

	let tracks = document.getElementById('tracks');
	tracks.style.left = (window.innerWidth/2 - (tick/10)) + 'px';

	let div = document.getElementById(type);
	if (!div) return;

	let entry = document.createElement('li');
	entry.style.left = (tick/10) + 'px';

	if (type == 'piano') {
		let key = details.originalNote.replace(/\d+/,'');
		entry.textContent = key;
		let sup = document.createElement('sup');
		sup.textContent = details.chord;
		entry.appendChild(sup);
		theory.currentChord = { key: key, type: details.chord, root: details.root };
	}

	else if (type == 'bass') {
		if (details.notes.length) {
			let note = details.notes[0];
			let name = theory.noteToName(note);
			entry.textContent = 'o\n\n' + name;
			a = 34;
			b = 1.9;
			x = (63 - note);
			entry.style.top = Math.ceil(a + b*x) + 'px';
		}
	}

	div.appendChild(entry);
}

function bootstrap(socket) {
	console.log('run bootstrap now.');
	window.connected = true;

	let button = document.getElementById('start');

	let start = () => {
		playStart = Date.now();
		socket.emit('start');
		button.textContent = 'Let\'s take five?';
		button.removeEventListener('click', start);
		button.addEventListener('click', stop);
	}

	let stop = () => {
		socket.emit('stop');
		button.textContent = 'Yeah man, let\'s do this';
		button.onclick = start;
		button.removeEventListener('click', stop);
		button.addEventListener('click', start);
	}

	button.addEventListener('click', start);
	stop();
	//test();
}

function test() {
	test = [
		{ trackType: 'bass', data: { notes: [52], }},
		{ trackType: 'bass', data: { notes: [53], }},
		{ trackType: 'bass', data: { notes: [55], }},
		{ trackType: 'bass', data: { notes: [57], }},
		{ trackType: 'bass', data: { notes: [59], }},
		{ trackType: 'bass', data: { notes: [60], }},
		{ trackType: 'bass', data: { notes: [62], }},
		{ trackType: 'bass', data: { notes: [64], }},
		{ trackType: 'bass', data: { notes: [65], }},
		{ trackType: 'bass', data: { notes: [67], }},
		{ trackType: 'bass', data: { notes: [69], }},
		{ trackType: 'bass', data: { notes: [71], }},
	];

	next = () => {
		if (!test.length) return;
		step = test.shift();
		processStep(step);
		setTimeout( () => next(), 240);
	}

	next();
}

if (typeof io !== "undefined") {
	var socket = io();

	socket.on('connected', function(msg){
	    console.log(msg);
		bootstrap(socket);
	});

	socket.on('play-event', function(msg){
		processStep(msg);
	});

} else { bootstrap(); }
