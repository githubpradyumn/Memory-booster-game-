(function(){
  "use strict";

  var COLORS = ["red","gold","green","blue"];
  var FREQ = { red: 220.0, gold: 277.18, green: 329.63, blue: 415.30 };

  var wedgeEls = COLORS.map(function(_, i){ return document.getElementById("wedge-"+i); });
  var scoreEl = document.getElementById("score");
  var statusEl = document.getElementById("status");
  var bestEl = document.getElementById("best");
  var startBtn = document.getElementById("startBtn");
  var toastEl = document.getElementById("toast");
  var dots = document.querySelectorAll("#difficulty .dot");
  var hintEl = document.getElementById("hint");

  var baseFill = {
    0: "var(--wedge-red)", 1: "var(--wedge-gold)", 2: "var(--wedge-green)", 3: "var(--wedge-blue)"
  };
  var litFill = {
    0: "var(--wedge-red-lit)", 1: "var(--wedge-gold-lit)", 2: "var(--wedge-green-lit)", 3: "var(--wedge-blue-lit)"
  };
  wedgeEls.forEach(function(el, i){ el.style.fill = baseFill[i]; });

  var sequence = [];
  var playerStep = 0;
  var accepting = false;
  var best = 0;
  var audioCtx = null;

  try {
    var saved = localStorage.getItem("memoryBoosterBest");
    if (saved) best = parseInt(saved, 10) || 0;
  } catch(e) {}
  bestEl.textContent = best;

  function getAudioCtx(){
    if (!audioCtx){
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ audioCtx = null; }
    }
    return audioCtx;
  }

  function tone(colorIndex, duration){
    var ctx = getAudioCtx();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = FREQ[COLORS[colorIndex]];
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration/1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration/1000 + 0.02);
  }

  // Adaptive difficulty: flash speed shortens as sequence grows.
  function speedForRound(round){
    if (round <= 4) return { flash: 560, gap: 260 };
    if (round <= 8) return { flash: 440, gap: 200 };
    if (round <= 12) return { flash: 340, gap: 150 };
    if (round <= 16) return { flash: 280, gap: 120 };
    return { flash: 220, gap: 90 };
  }

  function difficultyLevel(round){
    if (round <= 4) return 1;
    if (round <= 8) return 2;
    if (round <= 12) return 3;
    if (round <= 16) return 4;
    return 5;
  }

  function updateDifficulty(round){
    var level = difficultyLevel(round);
    dots.forEach(function(d, i){ d.classList.toggle("on", i < level); });
  }

  function lightWedge(i, duration, cb){
    var el = wedgeEls[i];
    el.classList.add("lit");
    el.style.fill = litFill[i];
    tone(i, duration);
    setTimeout(function(){
      el.classList.remove("lit");
      el.style.fill = baseFill[i];
      if (cb) cb();
    }, duration);
  }

  function setWedgesEnabled(enabled){
    accepting = enabled;
    wedgeEls.forEach(function(el){ el.classList.toggle("disabled", !enabled); });
  }

  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(function(){ toastEl.classList.remove("show"); }, 1400);
  }

  function playSequence(){
    setWedgesEnabled(false);
    statusEl.textContent = "watch closely";
    var speed = speedForRound(sequence.length);
    var i = 0;
    function step(){
      if (i >= sequence.length){
        playerStep = 0;
        setWedgesEnabled(true);
        statusEl.textContent = "your turn";
        return;
      }
      lightWedge(sequence[i], speed.flash, function(){
        i++;
        setTimeout(step, speed.gap);
      });
    }
    setTimeout(step, 500);
  }

  function nextRound(){
    sequence.push(Math.floor(Math.random() * 4));
    scoreEl.textContent = sequence.length - 1;
    updateDifficulty(sequence.length);
    playSequence();
  }

  function handleWedge(i){
    if (!accepting) return;
    lightWedge(i, 180);
    if (sequence[playerStep] === i){
      playerStep++;
      if (playerStep === sequence.length){
        setWedgesEnabled(false);
        setTimeout(nextRound, 500);
      }
    } else {
      gameOver();
    }
  }

  function gameOver(){
    setWedgesEnabled(false);
    var finalScore = sequence.length - 1;
    statusEl.textContent = "tap start";
    if (finalScore > best){
      best = finalScore;
      bestEl.textContent = best;
      try { localStorage.setItem("memoryBoosterBest", String(best)); } catch(e){}
      showToast(finalScore === 0 ? "Let's try that again" : "New best — " + finalScore);
    } else {
      showToast("Sequence broken at step " + (playerStep + 1));
    }
    startBtn.disabled = false;
    startBtn.textContent = "Play again";
  }

  function startGame(){
    sequence = [];
    playerStep = 0;
    scoreEl.textContent = "0";
    updateDifficulty(0);
    startBtn.disabled = true;
    startBtn.textContent = "In progress…";
    hintEl.textContent = "Each round adds one more step. The pace quickens as your streak grows — stay locked in.";
    nextRound();
  }

  wedgeEls.forEach(function(el, i){
    el.addEventListener("click", function(){ handleWedge(i); });
    el.addEventListener("keydown", function(ev){
      if (ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); handleWedge(i); }
    });
  });

  startBtn.addEventListener("click", startGame);

})();
