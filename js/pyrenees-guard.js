(function () {
  var KEY = "coc-play-pyrenees-guard-best";
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var scoreEl = document.getElementById("score");
  var hpEl = document.getElementById("hp");
  var bestEl = document.getElementById("best");
  var overlay = document.getElementById("overlay");
  var overlayTitle = document.getElementById("overlay-title");
  var overlayMsg = document.getElementById("overlay-msg");
  var startBtn = document.getElementById("start-btn");

  var W = canvas.width;
  var H = canvas.height;
  var BARN_Y = H - 70;
  var running = false;
  var score = 0;
  var hp = 10;
  var enemies = [];
  var dogs = [
    { name: "Sophie", x: 70, y: BARN_Y - 30, emoji: "🐕", phase: 0 },
    { name: "Gus", x: 180, y: BARN_Y - 28, emoji: "🦮", phase: 2.1 },
    { name: "Betty", x: 290, y: BARN_Y - 30, emoji: "🐕‍🦺", phase: 4.2 }
  ];
  var spawnTimer = 0;
  var last = 0;
  var t = 0;

  bestEl.textContent = CrittersPlay.getBest(KEY);

  function reset() {
    score = 0;
    hp = 10;
    enemies = [];
    spawnTimer = 0.6;
    scoreEl.textContent = "0";
    hpEl.textContent = "10";
  }

  function spawn() {
    var kinds = [
      { emoji: "🦊", points: 15, speed: 55 + Math.random() * 25 },
      { emoji: "🐺", points: 25, speed: 40 + Math.random() * 20 },
      { emoji: "🦝", points: 10, speed: 65 + Math.random() * 30 }
    ];
    var k = kinds[Math.floor(Math.random() * kinds.length)];
    enemies.push({
      x: 30 + Math.random() * (W - 60),
      y: -20,
      r: 22,
      emoji: k.emoji,
      points: k.points,
      speed: k.speed + score * 0.15
    });
  }

  function drawScene() {
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1e2a38");
    sky.addColorStop(0.5, "#3a4a38");
    sky.addColorStop(1, "#4a3a28");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // live oak canopy
    ctx.fillStyle = "#2a3a22";
    ctx.beginPath();
    ctx.ellipse(W / 2, 70, 140, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3d4a2a";
    ctx.beginPath();
    ctx.ellipse(W / 2 - 40, 85, 80, 40, 0, 0, Math.PI * 2);
    ctx.ellipse(W / 2 + 50, 80, 70, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a3820";
    ctx.fillRect(W / 2 - 8, 90, 16, 80);

    // red barn
    ctx.fillStyle = "#8b2e2e";
    ctx.fillRect(W / 2 - 70, BARN_Y - 50, 140, 70);
    ctx.fillStyle = "#5a1e1e";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, BARN_Y - 50);
    ctx.lineTo(W / 2, BARN_Y - 95);
    ctx.lineTo(W / 2 + 80, BARN_Y - 50);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3a2818";
    ctx.fillRect(W / 2 - 18, BARN_Y - 30, 36, 50);
    ctx.fillStyle = "#c9a227";
    ctx.fillRect(W / 2 - 6, BARN_Y - 8, 12, 12);

    // ground
    ctx.fillStyle = "#3a3020";
    ctx.fillRect(0, BARN_Y + 20, W, H - BARN_Y - 20);
  }

  function drawEmoji(emoji, x, y, size) {
    ctx.font = size + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, x, y);
  }

  function update(dt) {
    if (!running) return;
    t += dt;
    dogs.forEach(function (d, i) {
      d.x = 60 + i * 110 + Math.sin(t * 1.2 + d.phase) * 28;
    });

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawn();
      spawnTimer = Math.max(0.45, 1.4 - score * 0.01);
    }

    for (var i = enemies.length - 1; i >= 0; i--) {
      var e = enemies[i];
      e.y += e.speed * dt;
      // dogs scare nearby
      for (var d = 0; d < dogs.length; d++) {
        var dx = dogs[d].x - e.x;
        var dy = dogs[d].y - e.y;
        if (dx * dx + dy * dy < 38 * 38) {
          score += Math.floor(e.points / 2);
          scoreEl.textContent = String(score);
          enemies.splice(i, 1);
          e = null;
          break;
        }
      }
      if (!e) continue;
      if (e.y >= BARN_Y - 40) {
        enemies.splice(i, 1);
        hp -= 1;
        hpEl.textContent = String(hp);
        if (hp <= 0) endGame();
      }
    }
  }

  function draw() {
    drawScene();
    dogs.forEach(function (d) {
      drawEmoji(d.emoji, d.x, d.y, 32);
      ctx.fillStyle = "rgba(245,240,230,0.7)";
      ctx.font = "9px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.name, d.x, d.y + 22);
    });
    enemies.forEach(function (e) {
      drawEmoji(e.emoji, e.x, e.y, 30);
    });
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
    var best = CrittersPlay.setBest(KEY, score);
    bestEl.textContent = String(best);
    overlayTitle.textContent = "Barn held… for now";
    overlayMsg.textContent = "Score " + score + " · Best " + best + ". The pack rests under the oak.";
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
    if ((e.key === "Enter" || e.key === " ") && !running) {
      e.preventDefault();
      start();
    }
  });

  canvas.addEventListener("pointerdown", function (e) {
    if (!running) return;
    var rect = canvas.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * W;
    var y = ((e.clientY - rect.top) / rect.height) * H;
    for (var i = enemies.length - 1; i >= 0; i--) {
      var en = enemies[i];
      var dx = en.x - x;
      var dy = en.y - y;
      if (dx * dx + dy * dy < 36 * 36) {
        score += en.points;
        scoreEl.textContent = String(score);
        enemies.splice(i, 1);
        break;
      }
    }
  });

  draw();
  requestAnimationFrame(loop);
})();
