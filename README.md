# A walking bass generator

WIP, this is a Node.js walking bass generator using three virtual MIDI devices. It's sort of based on [midi-with-node](https://github.com/Pomax/midi-with-node), and the generator has code in place for:

1. Piano, using virtual MIDI device "NodeJS MIDI output piano",
2. Drums, using virtual MIDI device "NodeJS MIDI output drums",
3. Double bass, using virtual MIDI device "NodeJS MIDI output bass".

There is a [Reaper](https://reaper.fm) project in the repo that can be used to test this generator with, provided your OS lets you set up virtual MIDI devices on the fly (most unix/linux including OSX), or if you're on windows, install [loopmidi](https://www.tobias-erichsen.de/software/loopmidi.html) and create the abovementioned devices before running this generator.

### Architecture

There is one track manager, which builds tracks for each instrument, with each instrument backed by a specific generator.

The track manager knows the BPM and groove, and passes these into Tracks, which pass them into generators.

Generators contain `program` arrays which contain note/rest instructions with specific durations (measured in ticks, where each tick is 1/128th note). There is a small amount of BPM drift between the generator and "real" BPM tracking in Digital Audio Workstations, so if true BPM is important, you're going to have to build in DAW-time-syncing and then submit a PR so that everyone else can enjoy that functionality, too.

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
	- Piano: [Model 7 Grand](http://www.chocolateaudio.com/products/model-7) (Chocolate Audio)
	- Drums: [Strike2](https://www.pluginboutique.com/product/1-Instruments/64-Virtual-Instrument/1547-Strike-2) (AIR)
	- Bass: The double bass from [Cuba](https://www.native-instruments.com/en/products/komplete/world/cuba/) (Native Instruments)

### "Holy shit, those instruments are expensive!"

Yup. Which is why you look at https://rekkerd.org/deals-deals-deals every week or so, so that you can pick up $199+ instruments at 80% or 90% off when those offers present themselves.