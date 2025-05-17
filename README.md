# [GDCKit.js](https://kurogedelic.github.io/gdckit-js/example/)

**A minimal browser library for Game-Driven Composition (GDC)**
**ゲーム駆動型作曲のための最小 JS ライブラリ**

GitHub: [https://github.com/kurogedelic/gdckit-js](https://github.com/kurogedelic/gdckit-js)

CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/kurogedelic/gdckit-js@latest/GDCKit.js"></script>
```

---

## What is GDCKit?

**GDCKit** is a small, dependency-free JavaScript utility designed for building music-generating games in the browser using WebMIDI. Inspired by the idea of _Game-Driven Composition_ (GDC), this kit makes it easy to integrate MIDI output and input handling into any web-based game or interactive sketch.

Works best with **p5.js**, but p5 is not required.

---

## これは何?

**GDCKit.js** は、Iceface 氏 (X: [@H\_\_Wakabayashi](https://t.co/VcbZwkqrxz)) が提唱した「ゲーム駆動型作曲 (Game-Driven Composition)」を誰でも体験できるようにする JavaScript ライブラリです。

- WebMIDI を通じて MIDI をダイレクトに出力
- p5.js などの Web エンジンと簡単に連携
- キーボードやマウスの入力をもゲームのようにして取り扱い

---

## Features

- Easy MIDI note triggering with velocity, duration, and frequency helpers
- Auto MIDI output port selector UI (Chrome only)
- Lightweight input state tracker

  - `justPressedKey()` and `isPressingKey()` for keyboard
  - `justClickedMouse()` and `isPressingMouse()` for mouse

- `justReleasedKey()` for one-shot input detection
- Automatic MIDI port selection with IAC prioritization
- Built-in debug logging via `gdc.debug = true`

- Pure JavaScript: no frameworks required
- MIT Licensed and ready for use in personal or commercial projects

---

## Example Usage (with p5.js)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kurogedelic/gdckit-js@latest/GDCKit.js"></script>
```

```js
function setup() {
	createCanvas(400, 400);
	gdc.debug = true;
	gdc.init();
}

function draw() {
	if (gdc.justPressedKey("a")) {
		gdc.note(60, 100, 300);
	}
	gdc.updateInput(); // must be last
}
```

---

## API Overview

```js
gdc.init(); // Request MIDI access + display port selector
gdc.setMidiOut(index); // Manually choose output port
gdc.noteOn(note, vel); // Send MIDI note_on
gdc.noteOff(note); // Send note_off
gdc.note(note, vel, ms); // Send note_on + auto-off after duration
gdc.mtf(noteNum); // MIDI-to-frequency helper (Hz)

gdc.updateInput(); // Must be called once per frame

gdc.justPressedKey("a"); // true only on the first frame "a" is pressed
gdc.isPressingKey("a"); // true as long as "a" is held down
gdc.justReleasedKey("a"); // true on the frame "a" is released
gdc.justClickedMouse("left");
gdc.isPressingMouse("left");

gdc.debug = true; // enable debug logging
```

---

## Requirements

- **Browser**: Chrome or other WebMIDI-compatible browsers
- **OS**: macOS / Windows (tested)
- **MIDI**: IAC / virtual ports supported

---

## License

MIT License. Use freely in games, art, research, and experiments.

---

## Credits

Game-Driven Composition idea by [Iceface (@H\_\_Wakabayashi)](https://t.co/VcbZwkqrxz)

Library and structure by [@kurogedelic](https://github.com/kurogedelic)

---

## Prompt for AI Agents

You can use the following instruction to generate music-enabled games using GDCKit and p5.js:

> "Create a simple browser game using GDCKit and p5.js where MIDI notes are triggered interactively. Use gdc.init(), justPressedKey(), and gdc.note() to handle input and output. Make sure to call gdc.updateInput() at the end of every draw loop."
