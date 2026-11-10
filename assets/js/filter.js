// Live filter for the post list on the home page (matches title, tags, categories).
(function () {
  "use strict";
  var input = document.getElementById("post-filter");
  if (!input) return;

  var items = Array.prototype.slice.call(document.querySelectorAll(".post-list li"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".year-group"));
  var empty = document.querySelector(".no-match");

  input.addEventListener("input", function () {
    var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var shown = 0;

    items.forEach(function (li) {
      var hay = li.getAttribute("data-search") || "";
      var match = terms.every(function (t) { return hay.indexOf(t) !== -1; });
      li.hidden = !match;
      if (match) shown++;
    });

    groups.forEach(function (g) {
      g.hidden = !g.querySelector("li:not([hidden])");
    });

    if (empty) empty.hidden = shown !== 0;
  });
})();
