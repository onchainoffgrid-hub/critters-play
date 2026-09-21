(function () {
  var KEY = "coc-play-barn-cat-best";
  var HOLES = 9;
  var grid = document.getElementById("grid");
  var scoreEl = document.getElementById("score");
  var timeEl = document.getElementById("time");
  var bestEl = document.getElementById("best");
  var overlay = document.getElementById("overlay");
  var overlayTitle = document.getElementById("overlay-title");
  var overlayMsg = document.getElementById("overlay-msg");
  var startBtn = document.getElementById("start-btn");

  var holes = [];
  var score = 0;
  var timeLeft = 30;
  var running = false;
  var spawnId = null;
  var tickId = null;
  var active = {};

  bestEl.textContent = CrittersPlay.getBest(KEY);

  for (var i = 0; i < HOLES; i++) {
    var hole = document.createElement("div");
    hole.className = "hole";
    hole.dataset.index = String(i);
    var pop = document.createElement("button");
    pop.type = "button";
    pop.className = "critter-pop";
    pop.setAttribute("aria-label", "Hay hole " + (i + 1));
    pop.dataset.index = String(i);
    hole.appendChild(pop);
    grid.appendChild(hole);
    holes.push(pop);
  }

  function clearAll() {
    active = {};
    holes.forEach(function (p) {
      p.classList.remove("up", "whacked");
      p.textContent = "";
      p.disabled = true;
    });
  }

  function endGame() {
    running = false;
    if (spawnId) clearTimeout(spawnId);
    if (tickId) clearInterval(tickId);
    spawnId = null;
    tickId = null;
    clearAll();
    var best = CrittersPlay.setBest(KEY, score);
    bestEl.textContent = String(best);
    overlayTitle.textContent = "Barn quiet";
    overlayMsg.textContent = "Score " + score + " · Best " + best + ". Sophie tips her whiskers.";
    startBtn.textContent = "Play again";
    overlay.classList.remove("hidden");
  }

  function hideCritter(idx, delay) {
    setTimeout(function () {
      var pop = holes[idx];
      if (!active[idx]) return;
      delete active[idx];
      pop.classList.remove("up");
      setTimeout(function () {
        pop.textContent = "";
        pop.classList.remove("whacked");
        pop.disabled = true;
      }, 120);
    }, delay);
  }

  function spawn() {
    if (!running) return;
    var free = [];
    for (var i = 0; i < HOLES; i++) if (!active[i]) free.push(i);
    if (free.length) {
      var idx = free[Math.floor(Math.random() * free.length)];
      var roll = Math.random();
      var type = roll < 0.55 ? "mouse" : roll < 0.85 ? "snake" : "kitten";
      var emoji = type === "mouse" ? "🐭" : type === "snake" ? "🐍" : "🐱";
      var pop = holes[idx];
      active[idx] = type;
      pop.textContent = emoji;
      pop.disabled = false;
      pop.classList.remove("whacked");
      requestAnimationFrame(function () { pop.classList.add("up"); });
      var upMs = Math.max(550, 1100 - score * 4);
      hideCritter(idx, upMs);
    }
    var next = Math.max(280, 700 - score * 3);
    spawnId = setTimeout(spawn, next + Math.random() * 200);
  }

  holes.forEach(function (pop) {
    pop.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      if (!running) return;
      var idx = parseInt(pop.dataset.index, 10);
      var type = active[idx];
      if (!type) return;
      delete active[idx];
      pop.classList.add("whacked");
      if (type === "mouse") {
        score += 10;
      } else if (type === "snake") {
        score += 25;
      } else {
        score = Math.max(0, score - 15);
        timeLeft = Math.max(0, timeLeft - 2);
        timeEl.textContent = String(timeLeft);
      }
      scoreEl.textContent = String(score);
      setTimeout(function () {
        pop.classList.remove("up", "whacked");
        pop.textContent = "";
        pop.disabled = true;
      }, 100);
    });
  });

  function start() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = "0";
    timeEl.textContent = "30";
    clearAll();
    overlay.classList.add("hidden");
    running = true;
    if (spawnId) clearTimeout(spawnId);
    if (tickId) clearInterval(tickId);
    spawn();
    tickId = setInterval(function () {
      if (!running) return;
      timeLeft -= 1;
      timeEl.textContent = String(timeLeft);
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  startBtn.addEventListener("click", start);
  window.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && !running) {
      e.preventDefault();
      start();
    }
  });
})();
