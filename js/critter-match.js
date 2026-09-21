(function () {
  var KEY = "coc-play-critter-match-best";
  var ROSTER = [
    { id: "sophie", emoji: "🐱", name: "Sophie", fact: "Tuxedo barn cat" },
    { id: "pekin", emoji: "🦆", name: "Pekin", fact: "White Pekin duck" },
    { id: "toulouse", emoji: "🪿", name: "Toulouse", fact: "Gray Toulouse goose" },
    { id: "rir", emoji: "🐔", name: "RIR hen", fact: "Rhode Island Red" },
    { id: "goat", emoji: "🐐", name: "Nugget", fact: "Dwarf goat" },
    { id: "piggy", emoji: "🐷", name: "Hamlet", fact: "Homestead piggy" },
    { id: "bunny", emoji: "🐰", name: "Clover", fact: "Farm bunny" },
    { id: "gus", emoji: "🐕", name: "Gus", fact: "Great Pyrenees" }
  ];

  var grid = document.getElementById("grid");
  var scoreEl = document.getElementById("score");
  var movesEl = document.getElementById("moves");
  var bestEl = document.getElementById("best");
  var overlay = document.getElementById("overlay");
  var overlayTitle = document.getElementById("overlay-title");
  var overlayMsg = document.getElementById("overlay-msg");
  var startBtn = document.getElementById("start-btn");

  var cards = [];
  var flipped = [];
  var lock = false;
  var matches = 0;
  var moves = 0;
  var score = 0;
  var playing = false;

  bestEl.textContent = CrittersPlay.getBest(KEY);

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function calcScore() {
    var base = matches * 100;
    var bonus = Math.max(0, 400 - moves * 12);
    return base + bonus;
  }

  function endGame() {
    playing = false;
    score = calcScore();
    scoreEl.textContent = String(score);
    var best = CrittersPlay.setBest(KEY, score);
    bestEl.textContent = String(best);
    overlayTitle.textContent = "Herd matched!";
    overlayMsg.textContent = "Score " + score + " in " + moves + " moves · Best " + best;
    startBtn.textContent = "Play again";
    overlay.classList.remove("hidden");
  }

  function onCardClick(btn) {
    if (!playing || lock) return;
    if (btn.classList.contains("flipped") || btn.classList.contains("matched")) return;
    btn.classList.add("flipped");
    flipped.push(btn);
    if (flipped.length < 2) return;

    moves += 1;
    movesEl.textContent = String(moves);
    lock = true;
    var a = flipped[0];
    var b = flipped[1];
    if (a.dataset.id === b.dataset.id) {
      a.classList.add("matched");
      b.classList.add("matched");
      a.disabled = true;
      b.disabled = true;
      matches += 1;
      score = calcScore();
      scoreEl.textContent = String(score);
      flipped = [];
      lock = false;
      if (matches >= ROSTER.length) {
        setTimeout(endGame, 350);
      }
    } else {
      setTimeout(function () {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        flipped = [];
        lock = false;
      }, 650);
    }
  }

  function buildBoard() {
    grid.innerHTML = "";
    cards = [];
    var deck = [];
    ROSTER.forEach(function (c) {
      deck.push(c);
      deck.push(c);
    });
    shuffle(deck);
    deck.forEach(function (c, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-card";
      btn.dataset.id = c.id;
      btn.setAttribute("aria-label", "Card " + (i + 1));
      btn.innerHTML =
        '<span class="match-card-inner">' +
        '<span class="match-face match-back" aria-hidden="true">✦</span>' +
        '<span class="match-face match-front">' +
        '<span class="emoji">' + c.emoji + "</span>" +
        '<span class="name">' + c.name + "</span>" +
        "</span></span>";
      btn.addEventListener("click", function () { onCardClick(btn); });
      grid.appendChild(btn);
      cards.push(btn);
    });
  }

  function start() {
    matches = 0;
    moves = 0;
    score = 0;
    flipped = [];
    lock = false;
    playing = true;
    scoreEl.textContent = "0";
    movesEl.textContent = "0";
    buildBoard();
    overlay.classList.add("hidden");
  }

  startBtn.addEventListener("click", start);
  window.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && !playing) {
      e.preventDefault();
      start();
    }
  });

  buildBoard();
})();
