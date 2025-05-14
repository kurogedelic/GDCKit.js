// GDCKit.js - Game-Driven Composition Kit

const gdc = (() => {
  let midiAccess = null;
  let output = null;

  const NOTE_NAME_TO_MIDI = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 };

  // Input state
  const keys = {};
  const prevKeys = {};
  const mouse = {};
  const prevMouse = {};

  // Event listeners
  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);
  window.addEventListener("mousedown", e => mouse[e.button] = true);
  window.addEventListener("mouseup", e => mouse[e.button] = false);

  function updateInput() {
    Object.assign(prevKeys, keys);
    Object.assign(prevMouse, mouse);
  }

  // Input queries
  function justPressedKey(k) {
    return keys[k] && !prevKeys[k];
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
    navigator.requestMIDIAccess().then(access => {
      midiAccess = access;
      output = [...midiAccess.outputs.values()][0] || null;
      renderPortSelector();
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
  }

  // MIDI commands
  function noteOn(note, velo = 100) {
    if (output) output.send([0x90, note, velo]);
  }

  function noteOff(note) {
    if (output) output.send([0x80, note, 0]);
  }

  function note(note, velo = 100, duration = 200) {
    noteOn(note, velo);
    setTimeout(() => noteOff(note), duration);
  }

  function list() {
    return [...midiAccess.outputs.values()].map(o => o.name);
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
    isPressingKey,
    justClickedMouse,
    isPressingMouse,
  };
})();
