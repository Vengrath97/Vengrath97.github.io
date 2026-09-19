/*
  Renders the weekly campaign table from /data/campaigns.json.
  Replaces the previous sliding-canvas widget (its script had gone
  missing) with the same .card-grid component used elsewhere.
*/
(function () {
  var grid = document.querySelector("#campaign-list");
  var status = document.querySelector("#campaign-status");
  if (!grid) return;

  fetch(window.SITE_ROOT + "data/campaigns.json")
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status));
    })
    .then(function (items) {
      if (!items.length) {
        grid.innerHTML = '<p class="empty-state">Brak zaplanowanych stołów.</p>';
        return;
      }
      grid.replaceChildren.apply(grid, items.map(card));
      if (status) status.textContent = items.length + (items.length === 1 ? " stół w tym tygodniu" : " stoły w tym tygodniu");
    })
    .catch(function (error) {
      console.error("Campaign list error:", error);
      grid.innerHTML = '<p class="empty-state">Nie udało się załadować listy kampanii.</p>';
    });

  function card(item) {
    var div = document.createElement("div");
    div.className = "card";
    var media = document.createElement("div");
    media.className = "card__media";
    if (item.image) media.style.backgroundImage = "url('" + window.SITE_ROOT + "assets/cards/" + item.image + "')";
    var tag = document.createElement("span");
    tag.className = "card__status card__status--active";
    tag.textContent = item.day;
    media.appendChild(tag);

    var body = document.createElement("div");
    body.className = "card__body";
    body.innerHTML =
      '<span class="card__meta">' + escapeHtml(item.system) + "</span>" +
      "<h3>" + escapeHtml(item.title) + "</h3>" +
      "<p>Prowadzi: " + escapeHtml(item.creator) + "</p>";

    div.append(media, body);
    return div;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
