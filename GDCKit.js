const gdc = (() => {
	let midiAccess = null;
	let output = null;
	let debug = false;

	const NOTE_NAME_TO_MIDI = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 };

	// Input state
	const keys = {};
	const prevKeys = {};
	const mouse = {};
	const prevMouse = {};

	// Event listeners
	window.addEventListener("keydown", (e) => (keys[e.key] = true));
	window.addEventListener("keyup", (e) => (keys[e.key] = false));
	window.addEventListener("mousedown", (e) => (mouse[e.button] = true));
	window.addEventListener("mouseup", (e) => (mouse[e.button] = false));

	function updateInput() {
		// Fully overwrite prevKeys with keys
		Object.keys(prevKeys).forEach((k) => delete prevKeys[k]);
		Object.keys(keys).forEach((k) => (prevKeys[k] = keys[k]));
		// Fully overwrite prevMouse with mouse
		Object.keys(prevMouse).forEach((b) => delete prevMouse[b]);
		Object.keys(mouse).forEach((b) => (prevMouse[b] = mouse[b]));
	}

	// Input queries
	function justPressedKey(k) {
		return !!keys[k] && !prevKeys[k];
	}

	function justReleasedKey(k) {
		return !keys[k] && !!prevKeys[k];
	}

	function isPressingKey(k) {
		return !!keys[k];
	}

	function justClickedMouse(btn) {
		const b = btn === "left" ? 0 : 2;
		return mouse[b] && !prevMouse[b];
	}

	function isPressingMouse(btn) {
		const b = btn === "left" ? 0 : 2;
		return !!mouse[b];
	}

	// MIDI init
	function init() {
		if (!navigator.requestMIDIAccess) {
			alert("WebMIDI not supported. Use Chrome.");
			return;
		}
		navigator.requestMIDIAccess({ sysex: false }).then((access) => {
			midiAccess = access;
			// Auto-select port containing "IAC"
			const outputs = [...midiAccess.outputs.values()];
			const iacOutput = outputs.find((o) => o.name.includes("IAC"));
			if (iacOutput) {
				output = iacOutput;
				if (debug) console.log("Selected MIDI output (IAC):", output.name);
			} else {
				output = outputs[0] || null;
				if (debug && output)
					console.log("Selected MIDI output (default):", output.name);
			}
			renderPortSelector();
			if (debug)
				console.log(
					"MIDI initialized with outputs:",
					outputs.map((o) => o.name)
				);
		});
	}

	function renderPortSelector() {
		const sel = document.createElement("select");
		sel.id = "gdc-midi-out";
		for (let [i, out] of [...midiAccess.outputs.values()].entries()) {
			const opt = document.createElement("option");
			opt.value = i;
			opt.textContent = out.name;
			sel.appendChild(opt);
		}
		sel.onchange = () => setMidiOut(parseInt(sel.value));
		document.body.appendChild(sel);
	}

	function setMidiOut(index) {
		const outputs = [...midiAccess.outputs.values()];
		output = outputs[index] || outputs[0];
		if (debug && output) console.log("MIDI output set to:", output.name);
	}

	// MIDI commands
	function noteOn(note, velo = 100) {
		if (!output) {
			if (debug) console.warn("No MIDI output selected");
			return;
		}
		if (debug) console.log("sending to output:", output.name);
		output.send([0x90, note, velo]);
		if (debug) console.log(`noteOn: note=${note}, velocity=${velo}`);
	}

	function noteOff(note) {
		if (output) {
			output.send([0x80, note, 0]);
			if (debug) console.log(`noteOff: note=${note}`);
		}
	}

	function note(note, velo = 100, duration = 200) {
		if (debug)
			console.log(
				`note(): note=${note}, velocity=${velo}, duration=${duration}`
			);
		noteOn(note, velo);
		setTimeout(() => noteOff(note), duration);
	}

	function list() {
		return [...midiAccess.outputs.values()].map((o) => o.name);
	}

	function mtf(n) {
		return 440 * Math.pow(2, (n - 69) / 12);
	}

	return {
		init,
		setMidiOut,
		noteOn,
		noteOff,
		note,
		list,
		mtf,
		updateInput,
		justPressedKey,
		justReleasedKey,
		isPressingKey,
		justClickedMouse,
		isPressingMouse,
		get debug() {
			return debug;
		},
		set debug(value) {
			debug = value;
		},
	};
})();
