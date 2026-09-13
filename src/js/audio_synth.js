// src/js/audio_synth.js - Procedural Web Audio API Sound Effects & Ambient Soundscapes
// 100% native, zero external dependencies, works offline and standalone.

const AudioEngine = (function() {
  let ctx = null;
  let masterGain = null;
  let sfxGain = null;
  let ambientGain = null;
  
  let currentAmbiance = 'none';
  let ambientNodes = [];
  let ambientInterval = null;
  
  let isMuted = false;
  let volume = 0.5;

  function initAudio() {
    if (!ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      ctx = new AudioContextClass();
      
      masterGain = ctx.createGain();
      sfxGain = ctx.createGain();
      ambientGain = ctx.createGain();

      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      sfxGain.gain.setValueAtTime(0.8, ctx.currentTime);
      ambientGain.gain.setValueAtTime(0.35, ctx.currentTime);

      sfxGain.connect(masterGain);
      ambientGain.connect(masterGain);
      masterGain.connect(ctx.destination);
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function playFX(type) {
    try {
      const audioCtx = initAudio();
      if (!audioCtx || isMuted) return;

      const now = audioCtx.currentTime;

      if (type === 'dice') {
        // Sequência de 4 a 6 cliques de rolagem de dados em madeira
        const count = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          const delay = i * 0.05 + Math.random() * 0.02;
          const freq = 160 + Math.random() * 240;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + delay);
          osc.frequency.exponentialRampToValueAtTime(60, now + delay + 0.04);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 1.5, now + delay);
          filter.Q.setValueAtTime(3, now + delay);

          gain.gain.setValueAtTime(0.35 - i * 0.04, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(sfxGain);

          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
        }
      } else if (type === 'crit') {
        // Fanfarra triunfante mágica (Acorde de C Maior com arpejo brilhante)
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + idx * 0.08;

          osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

          osc.connect(gain);
          gain.connect(sfxGain);

          osc.start(t);
          osc.stop(t + 0.65);
        });
      } else if (type === 'fumble') {
        // Som dramático e tenso de falha crítica (queda dissonante de graves)
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc2.type = 'triangle';

        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.5);

        osc2.frequency.setValueAtTime(148, now); // Dissonância de semitom
        osc2.frequency.exponentialRampToValueAtTime(48, now + 0.5);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.6);
        osc2.stop(now + 0.6);
      } else if (type === 'spell') {
        // Cintilação mágica ascendente
        const count = 7;
        for (let i = 0; i < count; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + i * 0.04;
          const freq = 400 + i * 220;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq + 300, t + 0.2);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          gain.connect(sfxGain);

          osc.start(t);
          osc.stop(t + 0.3);
        }
      } else if (type === 'heal') {
        // Harmônicos restauradores e suaves
        const chords = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
        chords.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + idx * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.25, t + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

          osc.connect(gain);
          gain.connect(sfxGain);

          osc.start(t);
          osc.stop(t + 0.85);
        });
      } else if (type === 'sword' || type === 'hit' || type === 'damage') {
        // Impacto de golpe e ressonância metálica
        const noise = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.03));
        }
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);

        noise.start(now);
      } else if (type === 'death') {
        // Badalo de sino fúnebre / som sombrio
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.exponentialRampToValueAtTime(110, now + 1.2);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + 1.3);
      }
    } catch (e) {
      console.warn('Audio FX play error:', e);
    }
  }

  function stopAmbiance() {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
    ambientNodes.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (e) {}
    });
    ambientNodes = [];
    currentAmbiance = 'none';
    updateAudioUI();
  }

  function playAmbiance(type) {
    try {
      stopAmbiance();
      if (!type || type === 'none') return;

      const audioCtx = initAudio();
      if (!audioCtx) return;

      currentAmbiance = type;
      updateAudioUI();

      if (type === 'tavern') {
        // Taverna / Fogueira: Ruído quente filtrado + estalos periódicos de lenha
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown/Pink noise
          lastOut = data[i];
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ambientGain);

        noise.start();
        ambientNodes.push(noise, filter, gain);

        // Estalos periódicos aleatórios de fogo
        ambientInterval = setInterval(() => {
          if (Math.random() > 0.4) {
            const crackleOsc = audioCtx.createOscillator();
            const crackleGain = audioCtx.createGain();
            const crackleTime = audioCtx.currentTime;

            crackleOsc.type = 'sawtooth';
            crackleOsc.frequency.setValueAtTime(400 + Math.random() * 800, crackleTime);

            crackleGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, crackleTime);
            crackleGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.03);

            crackleOsc.connect(crackleGain);
            crackleGain.connect(ambientGain);

            crackleOsc.start(crackleTime);
            crackleOsc.stop(crackleTime + 0.04);
          }
        }, 180);
      } else if (type === 'rain') {
        // Chuva & Tempestade: Ruído branco contínuo com filtro passa-faixa + trovões ocasionais
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, audioCtx.currentTime);
        filter.Q.setValueAtTime(0.8, audioCtx.currentTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ambientGain);

        noise.start();
        ambientNodes.push(noise, filter, gain);

        // Trovões distantes
        ambientInterval = setInterval(() => {
          if (Math.random() > 0.75) {
            const thunderOsc = audioCtx.createOscillator();
            const thunderGain = audioCtx.createGain();
            const t = audioCtx.currentTime;

            thunderOsc.type = 'triangle';
            thunderOsc.frequency.setValueAtTime(70, t);
            thunderOsc.frequency.exponentialRampToValueAtTime(30, t + 1.8);

            thunderGain.gain.setValueAtTime(0.4, t);
            thunderGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

            thunderOsc.connect(thunderGain);
            thunderGain.connect(ambientGain);

            thunderOsc.start(t);
            thunderOsc.stop(t + 2.1);
          }
        }, 4000);
      } else if (type === 'dungeon') {
        // Masmorra Sombria: Zumbido profundo e misterioso + gotas de água ocasionais
        const drone = audioCtx.createOscillator();
        const droneGain = audioCtx.createGain();

        drone.type = 'sine';
        drone.frequency.setValueAtTime(55, audioCtx.currentTime); // A1

        droneGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

        drone.connect(droneGain);
        droneGain.connect(ambientGain);

        drone.start();
        ambientNodes.push(drone, droneGain);

        // Gotas cavernosas
        ambientInterval = setInterval(() => {
          if (Math.random() > 0.45) {
            const drip = audioCtx.createOscillator();
            const dripGain = audioCtx.createGain();
            const t = audioCtx.currentTime;

            const freq = 1200 + Math.random() * 800;
            drip.type = 'sine';
            drip.frequency.setValueAtTime(freq, t);
            drip.frequency.exponentialRampToValueAtTime(freq - 300, t + 0.12);

            dripGain.gain.setValueAtTime(0.15, t);
            dripGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            drip.connect(dripGain);
            dripGain.connect(ambientGain);

            drip.start(t);
            drip.stop(t + 0.16);
          }
        }, 1200);
      } else if (type === 'battle') {
        // Tambores de Guerra / Tensão rítmica
        ambientInterval = setInterval(() => {
          const drum = audioCtx.createOscillator();
          const drumGain = audioCtx.createGain();
          const t = audioCtx.currentTime;

          drum.type = 'triangle';
          drum.frequency.setValueAtTime(110, t);
          drum.frequency.exponentialRampToValueAtTime(38, t + 0.22);

          drumGain.gain.setValueAtTime(0.45, t);
          drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          drum.connect(drumGain);
          drumGain.connect(ambientGain);

          drum.start(t);
          drum.stop(t + 0.26);
        }, 650);
      }
    } catch (e) {
      console.warn('Audio Ambiance play error:', e);
    }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, parseFloat(v) || 0));
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    }
    updateAudioUI();
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    }
    updateAudioUI();
    return isMuted;
  }

  function updateAudioUI() {
    const btnMute = document.getElementById('btn-audio-mute');
    const selAmb = document.getElementById('sel-audio-ambiance');
    const rngVol = document.getElementById('rng-audio-vol');

    if (btnMute) {
      btnMute.innerHTML = isMuted ? '🔇' : (volume > 0.5 ? '🔊' : '🔉');
      btnMute.title = isMuted ? 'Desmutar Áudio' : 'Mutar Áudio';
    }
    if (selAmb && selAmb.value !== currentAmbiance) {
      selAmb.value = currentAmbiance;
    }
    if (rngVol && Math.abs(parseFloat(rngVol.value) - volume) > 0.05) {
      rngVol.value = volume;
    }
  }

  return {
    init: initAudio,
    playFX,
    playAmbiance,
    stopAmbiance,
    setVolume,
    toggleMute,
    getCurrentAmbiance: () => currentAmbiance,
    isMuted: () => isMuted,
    getVolume: () => volume
  };
})();

// Global wrapper for backward compatibility
function playFX(type) {
  if (typeof AudioEngine !== 'undefined' && AudioEngine.playFX) {
    AudioEngine.playFX(type);
  }
}

function setAudioAmbiance(type) {
  if (typeof AudioEngine !== 'undefined') {
    AudioEngine.playAmbiance(type);
  }
}

function toggleAudioMute() {
  if (typeof AudioEngine !== 'undefined') {
    AudioEngine.toggleMute();
  }
}

function setAudioMasterVolume(val) {
  if (typeof AudioEngine !== 'undefined') {
    AudioEngine.setVolume(val);
  }
}
