/* Casefile: ListenBrainz "now playing" line. Fails silently; stays hidden on any error. */
(function () {
  var el = document.querySelector(".np");
  if (!el || !window.fetch) return;

  var api = "https://api.listenbrainz.org/1/user/" + encodeURIComponent(el.dataset.user) + "/";
  var mode = el.dataset.mode;                       // "now" or "recent"
  var maxAge = (parseFloat(el.dataset.maxAge) || 24) * 3600;

  function get(path) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 5000);
    return fetch(api + path, { signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  function first(d) { return d && d.payload && d.payload.listens && d.payload.listens[0]; }

  function show(label, meta, cls) {
    if (!meta || !meta.track_name) return false;
    // textContent only: track names are untrusted input
    el.querySelector(".np-label").textContent = label;
    el.querySelector(".np-track").textContent =
      meta.track_name + (meta.artist_name ? " \u2014 " + meta.artist_name : "");
    el.className = "np " + cls;
    el.hidden = false;
    return true;
  }

  function ago(sec) {
    var units = [["day", 86400], ["hour", 3600], ["minute", 60]];
    for (var i = 0; i < units.length; i++) {
      var n = Math.floor(sec / units[i][1]);
      if (n >= 1) {
        if (window.Intl && Intl.RelativeTimeFormat) {
          return new Intl.RelativeTimeFormat(document.documentElement.lang || "en", { numeric: "auto" }).format(-n, units[i][0]);
        }
        return n + " " + units[i][0] + (n > 1 ? "s" : "") + " ago";
      }
    }
    return "just now";
  }

  get("playing-now").then(function (d) {
    var l = first(d);
    if (l && show("Now playing", l.track_metadata, "np-live")) return;
    if (mode !== "recent") return;
    return get("listens?count=1").then(function (d) {
      var l = first(d);
      if (!l || !l.listened_at) return;
      var age = Date.now() / 1000 - l.listened_at;
      if (age >= 0 && age <= maxAge) show("Last played " + ago(age), l.track_metadata, "np-recent");
    });
  }).catch(function () {});
})();
