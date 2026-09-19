/*
  Renders the project catalog from /data/projects.json into .card-grid
  markup. Filtering is done client-side against the same dataset.
*/
(function () {
  var catalog = document.querySelector("#project-catalog");
  var filterBar = document.querySelector("#project-filters");
  if (!catalog) return;

  var STATUS = {
    ACTIVE: { label: "Aktywne", mod: "active" },
    IN_DEVELOPMENT: { label: "W trakcie tworzenia", mod: "active" },
    PREPARATION: { label: "W przygotowaniu", mod: "planned" },
    ARCHIVE: { label: "Archiwum", mod: "" },
    SOMEDAY: { label: "Kiedyś", mod: "" },
  };

  fetch(window.SITE_ROOT + "data/projects.json")
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status));
    })
    .then(function (projects) {
      render(projects, "all");
      if (filterBar) {
        filterBar.querySelectorAll("[data-filter]").forEach(function (button) {
          button.addEventListener("click", function () {
            filterBar.querySelectorAll("[data-filter]").forEach(function (b) {
              b.classList.remove("is-active");
            });
            button.classList.add("is-active");
            render(projects, button.dataset.filter);
          });
        });
      }
    })
    .catch(function (error) {
      console.error("Project catalog error:", error);
      catalog.innerHTML = '<p class="empty-state">Nie udało się załadować katalogu projektów.</p>';
    });

  function render(projects, filter) {
    var visible = projects.filter(function (p) {
      if (filter === "legacy") return p.legacy;
      if (filter === "active") return !p.legacy && p.status !== "SOMEDAY" && p.status !== "ARCHIVE";
      return true;
    });
    if (!visible.length) {
      catalog.innerHTML = '<p class="empty-state">Brak projektów w tej kategorii.</p>';
      return;
    }
    catalog.replaceChildren.apply(catalog, visible.map(card));
  }

  function card(project) {
    var a = document.createElement("a");
    a.className = "card";
    a.href = project.url;
    var status = STATUS[project.status] || { label: project.status, mod: "" };
    var media = document.createElement("div");
    media.className = "card__media";
    if (project.image) media.style.backgroundImage = "url('" + window.SITE_ROOT + "assets/cards/" + project.image + "')";
    var statusTag = document.createElement("span");
    statusTag.className = "card__status" + (status.mod ? " card__status--" + status.mod : "");
    statusTag.textContent = status.label;
    media.appendChild(statusTag);

    var body = document.createElement("div");
    body.className = "card__body";
    body.innerHTML =
      '<span class="card__meta">' + escapeHtml(project.type) + " · " + escapeHtml(project.system) + "</span>" +
      "<h3>" + escapeHtml(project.title) + "</h3>" +
      "<p>" + escapeHtml(project.excerpt || "") + "</p>" +
      '<span class="card__foot">Otwórz projekt</span>';

    a.append(media, body);
    return a;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
