/* Shared high-score helpers (localStorage) */
(function (global) {
  function getBest(key) {
    try {
      var v = parseInt(localStorage.getItem(key), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  }
  function setBest(key, score) {
    var best = getBest(key);
    if (score > best) {
      try {
        localStorage.setItem(key, String(score));
      } catch (e) {}
      return score;
    }
    return best;
  }
  global.CrittersPlay = {
    getBest: getBest,
    setBest: setBest
  };
})(window);
