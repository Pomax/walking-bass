# A walking bass generator

WIP, this is a Node.js walking bass generator in three channels. Based on [midi-with-node](https://github.com/Pomax/midi-with-node)

1. Piano chords
2. Drum track
3. Double bass

### Architecture

There is one track manager, which builds tracks for each instrument, with each instrument backed by a specific generator.

The track manager knows the BPM and groove, and passes these into Tracks, which pass them into generators.

Generators contain `program` arrays which contain note/rest instructions with specific durations, with all generators running a play loop based on `setTimeout()` with a 1ms (this makes a 128th at 120BPM still quite possible at 7.8ms intervals).

(There is no drift compensation at the moment, so tracks can desync over time) 

### Files

```
- track manager
| `- track
|    `- generator
|       |- piano
|       |- drum
|       `- bass
```

### How I'm using this

- Node.js with `windows-build-tools` globally installed
- [loopmidi](https://www.tobias-erichsen.de/software/loopmidi.html) installed at the OS level with a midi device called "Nodejs MIDI out"
- [Reaper](http://reaper.fm/) with three instrument tracks for piano, drum, and bass listening on Nodejs MIDI out channels 1, 2, and 3 respectively
	- Piano: [Eighty Eight Ensemble 2.0](https://www.pluginboutique.com/product/1-Instruments/64-Virtual-Instrument/1844-Eighty-Eight-Ensemble) (SONiVOX)
	- Drums: [Strike2](https://www.pluginboutique.com/product/1-Instruments/64-Virtual-Instrument/1547-Strike-2) (AIR) 
	- Bass: [Swing!](https://www.projectsam.com/products/swing/1449) double bass (Project SAM)
 