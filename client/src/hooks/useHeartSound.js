// src/hooks/useHeartSound.js

export function useHeartSound() {
  const playLove = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Primo tono — nota base (do)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523, ctx.currentTime); // Do5
    osc1.frequency.exponentialRampToValueAtTime(659, ctx.currentTime + 0.1); // Mi5
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Secondo tono — armonico leggero (effetto "doppio pop")
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(784, ctx.currentTime + 0.08); // Sol5
    osc2.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.2); // Do6
    gain2.gain.setValueAtTime(0.0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.3);

    // Chiudi il contesto dopo l'uso
    setTimeout(() => ctx.close(), 400);
  };

  const playUnlove = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.15); // tono discendente
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 300);
  };

  const playLevelUp = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    
    // Arpeggio ascendente trionfale — Do Mi Sol Do
    const notes = [523, 659, 784, 1046]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      const start = ctx.currentTime + i * 0.12
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0, start)
      gain.gain.linearRampToValueAtTime(0.18, start + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)
      osc.start(start)
      osc.stop(start + 0.25)
    })

    // Nota finale lunga — rinforzo
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    const start = ctx.currentTime + 0.48
    osc.frequency.setValueAtTime(1046, start)
    osc.frequency.exponentialRampToValueAtTime(1318, start + 0.2)
    gain.gain.setValueAtTime(0.15, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
    osc.start(start)
    osc.stop(start + 0.5)

    setTimeout(() => ctx.close(), 1200)
  }

  return { playLove, playUnlove, playLevelUp }
}
