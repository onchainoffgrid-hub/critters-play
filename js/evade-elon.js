(function () {
  var KEY = "coc-play-evade-elon-best";
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var scoreEl = document.getElementById("score");
  var livesEl = document.getElementById("lives");
  var bestEl = document.getElementById("best");
  var overlay = document.getElementById("overlay");
  var overlayTitle = document.getElementById("overlay-title");
  var overlayMsg = document.getElementById("overlay-msg");
  var startBtn = document.getElementById("start-btn");

  var W = canvas.width;
  var H = canvas.height;
  var running = false;
  var score = 0;
  var lives = 3;
  var player = { x: W / 2, y: H - 48, r: 18 };
  var elon = { x: W / 2, y: 60, r: 20, vx: 2.2, stealCd: 0 };
  var grains = [];
  var keys = {};
  var pointerX = null;
  var spawnTimer = 0;
  var last = 0;

  bestEl.textContent = CrittersPlay.getBest(KEY);

  function reset() {
    score = 0;
    lives = 3;
    player.x = W / 2;
    elon.x = W / 2;
    elon.vx = 2.2;
    elon.stealCd = 0;
    grains = [];
    spawnTimer = 0;
    scoreEl.textContent = "0";
    livesEl.textContent = "3";
  }

  function spawnGrain() {
    grains.push({
      x: 24 + Math.random() * (W - 48),
      y: -12,
      r: 10,
      vy: 1.4 + Math.random() * 1.6,
      taken: false
    });
  }

  function hit(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy < (a.r + b.r) * (a.r + b.r);
  }

  function drawBarnBg() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#2a3a28");
    g.addColorStop(0.45, "#3d4a30");
    g.addColorStop(1, "#5a4a30");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#4a3a22";
    ctx.fillRect(0, H - 36, W, 36);
    ctx.fillStyle = "rgba(201,162,39,0.12)";
    for (var i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(40 + i * 42, H - 20, 6 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawEmoji(emoji, x, y, size) {
    ctx.font = size + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, x, y);
  }

  function update(dt) {
    if (!running) return;
    var speed = 220 * dt;
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) player.x -= speed;
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) player.x += speed;
    if (pointerX != null) {
      var dx = pointerX - player.x;
      player.x += Math.max(-speed * 1.4, Math.min(speed * 1.4, dx));
    }
    player.x = Math.max(player.r, Math.min(W - player.r, player.x));

    elon.x += elon.vx;
    if (elon.x < elon.r || elon.x > W - elon.r) elon.vx *= -1;
    elon.vx += (Math.random() - 0.5) * 0.08;
    elon.vx = Math.max(-3.5, Math.min(3.5, elon.vx));
    if (elon.stealCd > 0) elon.stealCd -= dt;

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnGrain();
      spawnTimer = Math.max(0.45, 1.1 - score * 0.008);
    }

    for (var i = grains.length - 1; i >= 0; i--) {
      var g = grains[i];
      g.y += g.vy;
      if (g.y > H + 20) {
        grains.splice(i, 1);
        continue;
      }
      if (!g.taken && hit(player, g)) {
        g.taken = true;
        score += 10;
        scoreEl.textContent = String(score);
        grains.splice(i, 1);
        continue;
      }
      if (!g.taken && hit(elon, g)) {
        grains.splice(i, 1);
        if (elon.stealCd <= 0) {
          score = Math.max(0, score - 5);
          scoreEl.textContent = String(score);
          elon.stealCd = 0.35;
        }
        continue;
      }
    }

    if (elon.stealCd <= 0 && hit(player, elon)) {
      lives -= 1;
      livesEl.textContent = String(lives);
      elon.stealCd = 1.2;
      elon.x = elon.x < W / 2 ? W - 40 : 40;
      if (lives <= 0) endGame();
    }
  }

  function draw() {
    drawBarnBg();
    for (var i = 0; i < grains.length; i++) {
      drawEmoji("🌾", grains[i].x, grains[i].y, 22);
    }
    drawEmoji("🦆", elon.x, elon.y, 36);
    ctx.fillStyle = "rgba(196,92,74,0.85)";
    ctx.font = "bold 10px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ELON", elon.x, elon.y - 24);
    drawEmoji("🧑‍🌾", player.x, player.y, 34);
  }

  function loop(ts) {
    if (!last) last = ts;
    var dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    pointerX = null;
    var best = CrittersPlay.setBest(KEY, score);
    bestEl.textContent = String(best);
    overlayTitle.textContent = "Grain raid over";
    overlayMsg.textContent = "Score " + score + " · Best " + best + ". Elon Muscovy wins this round.";
    startBtn.textContent = "Play again";
    overlay.classList.remove("hidden");
  }

  function start() {
    reset();
    overlay.classList.add("hidden");
    running = true;
    last = 0;
  }

  startBtn.addEventListener("click", start);

  window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    if ((e.key === "Enter" || e.key === " ") && !running) {
      e.preventDefault();
      start();
    }
  });
  window.addEventListener("keyup", function (e) { keys[e.key] = false; });

  function pointer(clientX) {
    var rect = canvas.getBoundingClientRect();
    pointerX = ((clientX - rect.left) / rect.width) * W;
  }
  canvas.addEventListener("pointerdown", function (e) {
    if (!running) return;
    canvas.setPointerCapture(e.pointerId);
    pointer(e.clientX);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!running || pointerX == null) return;
    pointer(e.clientX);
  });
  canvas.addEventListener("pointerup", function () { pointerX = null; });
  canvas.addEventListener("pointercancel", function () { pointerX = null; });

  draw();
  requestAnimationFrame(loop);
})();
