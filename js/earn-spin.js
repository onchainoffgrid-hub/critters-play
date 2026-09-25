/* Shared Wheel earn-spin helpers (same-origin localStorage with critters-on-call) */
(function (global) {
  var CP = global.CrittersPlay || (global.CrittersPlay = {});
  var EARN_KEY = "coc_earned_wheel_spins_v1";
  var SMS_NUMBER = "9142631311";

  CP.WHEEL_URL = "https://onchainoffgrid-hub.github.io/critters-on-call/wheel.html";
  CP.SMS_NUMBER = SMS_NUMBER;
  CP.EARN_KEY = EARN_KEY;

  function readEarns() {
    try {
      var raw = localStorage.getItem(EARN_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function writeEarns(arr) {
    try {
      localStorage.setItem(EARN_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  /** sms:9142631311?&body=GUS|BETTY (iOS/Android-friendly) */
  CP.smsHref = function (keyword) {
    return "sms:" + SMS_NUMBER + "?&body=" + encodeURIComponent(String(keyword || "").toUpperCase());
  };

  CP.wheelEarnUrl = function (dogId) {
    var dog = String(dogId || "").toLowerCase();
    return CP.WHEEL_URL + "?earn=" + encodeURIComponent(dog);
  };

  CP.readWheelEarns = readEarns;

  /**
   * Append an earn record if not already granted for that dog.
   * Returns the existing or new record, or null if dogId is invalid.
   */
  CP.grantWheelSpin = function (dogId) {
    var dog = String(dogId || "").toLowerCase();
    if (dog !== "gus" && dog !== "betty") return null;
    var earns = readEarns();
    for (var i = 0; i < earns.length; i++) {
      if (earns[i] && earns[i].dog === dog) return earns[i];
    }
    var rec = {
      id: dog + "-" + Date.now(),
      dog: dog,
      at: new Date().toISOString(),
      claimed: false
    };
    earns.push(rec);
    writeEarns(earns);
    return rec;
  };

  CP.getEarnForDog = function (dogId) {
    var dog = String(dogId || "").toLowerCase();
    var earns = readEarns();
    for (var i = 0; i < earns.length; i++) {
      if (earns[i] && earns[i].dog === dog) return earns[i];
    }
    return null;
  };

  CP.hasUnclaimedEarn = function (dogId) {
    var rec = CP.getEarnForDog(dogId);
    return !!(rec && !rec.claimed);
  };

  CP.getUnclaimedEarns = function () {
    return readEarns().filter(function (e) { return e && !e.claimed; });
  };
})(window);
