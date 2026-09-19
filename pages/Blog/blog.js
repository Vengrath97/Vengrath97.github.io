/*
  Renders the blog archive from /data/blog-posts.json into .entry-row
  markup, newest first.
*/
(function () {
  var list = document.querySelector("#blog-posts");
  var status = document.querySelector("#blog-status");
  if (!list) return;

  fetch(window.SITE_ROOT + "data/blog-posts.json")
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status));
    })
    .then(function (posts) {
      if (!Array.isArray(posts)) throw new Error("blog-posts.json must contain an array");
      if (!posts.length) {
        list.replaceChildren(emptyRow("Brak wpisów w archiwum."));
        if (status) status.textContent = "0 wpisów";
        return;
      }
      posts.sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });
      list.replaceChildren.apply(list, posts.map(row));
      if (status) status.textContent = posts.length + (posts.length === 1 ? " wpis w archiwum" : " wpisów w archiwum");
    })
    .catch(function (error) {
      console.error("Blog archive error:", error);
      list.replaceChildren(emptyRow("Nie udało się załadować archiwum."));
      if (status) status.textContent = "błąd ładowania";
    });

  function row(post) {
    var article = document.createElement("article");
    article.className = "entry-row";
    article.innerHTML =
      '<div class="entry-row__date">' + escapeHtml(formatDate(post.date)) + "</div>" +
      '<div class="entry-row__body">' +
      '<span class="marker">' + escapeHtml(post.category || "Notatka") + (post.system ? " · " + escapeHtml(post.system) : "") + "</span>" +
      "<h2><a href=\"" + safePath(post.url) + "\">" + escapeHtml(post.title || "Bez tytułu") + "</a></h2>" +
      "<p>" + escapeHtml(post.description || "") + "</p>" +
      "</div>";
    return article;
  }

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d)) return value || "—";
    return d.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  }

  function emptyRow(message) {
    var p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = message;
    return p;
  }

  function safePath(value) {
    var normalized = String(value == null ? "" : value).replace(/^\/+/, "");
    return normalized.indexOf("..") !== -1 || normalized.charAt(0) === "/" ? "#" : normalized;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
