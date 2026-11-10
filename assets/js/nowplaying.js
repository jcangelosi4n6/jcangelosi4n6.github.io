// ListenBrainz "now playing" widget.
// Shows the current track if one is playing, otherwise the most recent listen.
// Uses the public ListenBrainz API (no token needed) and the Cover Art Archive.
(function () {
  "use strict";

  var el = document.getElementById("nowplaying");
  if (!el) return;

  var user = el.dataset.user;
  var refresh = Math.max(30, parseInt(el.dataset.refresh, 10) || 60) * 1000;
  var API = "https://api.listenbrainz.org/1/user/" + encodeURIComponent(user);

  var art = el.querySelector(".np-art");
  var artFallback = el.querySelector(".np-art-fallback");
  var label = el.querySelector(".np-label");
  var trackEl = el.querySelector(".np-track");
  var artistEl = el.querySelector(".np-artist");
  var timer = null;
  var lastKey = "";

  function getJSON(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function firstListen(data) {
    return data && data.payload && data.payload.listens && data.payload.listens[0];
  }

  function timeAgo(unixSeconds) {
    var s = Math.floor(Date.now() / 1000 - unixSeconds);
    if (s < 60) return "just now";
    var units = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (var i = 0; i < units.length; i++) {
      var n = Math.floor(s / units[i][1]);
      if (n >= 1) return n + " " + units[i][0] + (n > 1 ? "s" : "") + " ago";
    }
    return "just now";
  }

  function releaseMbid(meta) {
    var info = meta.additional_info || {};
    var mapping = meta.mbid_mapping || {};
    return info.release_mbid || mapping.release_mbid || null;
  }

  function setArt(mbid) {
    if (!mbid) {
      art.hidden = true;
      artFallback.hidden = false;
      return;
    }
    var src = "https://coverartarchive.org/release/" + mbid + "/front-250";
    if (art.getAttribute("src") === src) return;
    art.onload = function () { art.hidden = false; artFallback.hidden = true; };
    art.onerror = function () { art.hidden = true; artFallback.hidden = false; };
    art.src = src;
  }

  function render(listen, playing) {
    var meta = listen.track_metadata || {};
    var key = (meta.track_name || "") + "|" + (meta.artist_name || "") + "|" + playing;

    label.textContent = playing
      ? "Now playing"
      : "Last played" + (listen.listened_at ? " · " + timeAgo(listen.listened_at) : "");
    el.classList.toggle("is-playing", playing);

    if (key !== lastKey) {
      trackEl.textContent = meta.track_name || "Unknown track";
      artistEl.textContent = meta.artist_name || "";
      trackEl.title = trackEl.textContent;
      setArt(releaseMbid(meta));
      lastKey = key;
    }
    el.hidden = false;
  }

  function update() {
    getJSON(API + "/playing-now")
      .then(function (data) {
        var now = firstListen(data);
        if (now) return render(now, true);
        return getJSON(API + "/listens?count=1").then(function (d) {
          var last = firstListen(d);
          if (last) render(last, false);
        });
      })
      .catch(function () { /* keep whatever was last shown; stay quiet */ });
  }

  function start() {
    if (timer) return;
    update();
    timer = setInterval(update, refresh);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  // Don't poll the API from background tabs.
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });

  start();
})();
