/*
  SITE.JS
  Shared behaviour for every page on the main site: mobile nav toggle,
  active-link highlighting, sticky header shadow, skip link, and the
  global search overlay. Page-specific data rendering (project cards,
  blog list, campaign list) lives in its own small file under
  /pages/<Section>/ and is loaded in addition to this file.
*/
(function () {
  "use strict";

  var root = document.documentElement;
  // ROOT is the absolute path to the site root from any page depth,
  // read from a data attribute on <html> so every page — regardless
  // of folder depth — can resolve root-relative asset and API URLs.
  var ROOT = root.dataset.root || "/";
  window.SITE_ROOT = ROOT;

  addSkipLink();
  wireMobileNav();
  markCurrentNavLink();
  wireHeaderElevation();
  addSearchTrigger();
  wireKeyboardSearch();

  function addSkipLink() {
    if (document.querySelector(".skip-link")) return;
    var main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main";
    var a = document.createElement("a");
    a.className = "skip-link";
    a.href = "#main";
    a.textContent = "Przejdź do treści";
    document.body.prepend(a);
  }

  function wireMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Zamknij" : "Menu";
    });
  }

  function markCurrentNavLink() {
    var here = location.pathname.replace(/index\.html$/, "");
    document.querySelectorAll(".site-nav__link").forEach(function (link) {
      var target = new URL(link.getAttribute("href"), location.href).pathname.replace(/index\.html$/, "");
      if (target !== "/" && here.indexOf(target) === 0) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function wireHeaderElevation() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", scrollY > 8);
      },
      { passive: true }
    );
  }

  function wireKeyboardSearch() {
    document.addEventListener("keydown", function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        var trigger = document.querySelector("[data-search-trigger]");
        if (trigger) trigger.click();
      }
    });
  }

  /* ---------------- global search ---------------- */

  function addSearchTrigger() {
    var nav = document.querySelector(".header-tools");
    if (!nav || nav.querySelector("[data-search-trigger]")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "search-trigger";
    btn.dataset.searchTrigger = "true";
    btn.innerHTML = 'Szukaj <kbd>/</kbd>';
    nav.prepend(btn);
    initGlobalSearch(btn);
  }

  function initGlobalSearch(trigger) {
    var dialog, input, results, items = [], loaded = false;

    trigger.addEventListener("click", function () {
      if (!dialog) {
        dialog = buildDialog();
        input = dialog.querySelector(".search-input");
        results = dialog.querySelector(".search-results");
      }
      dialog.hidden = false;
      document.body.classList.add("search-open");
      input.focus();
      if (loaded) return;
      results.innerHTML = '<p class="search-status">Ładowanie indeksu…</p>';
      loadIndex()
        .then(function (list) {
          items = list;
          loaded = true;
          renderResults(input.value);
        })
        .catch(function (err) {
          console.error("Global search error:", err);
          results.innerHTML = '<p class="search-status">Indeks wyszukiwania jest chwilowo niedostępny.</p>';
        });
    });

    function loadIndex() {
      return fetch(ROOT + "data/search-index.json", { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("Search index HTTP " + r.status);
          return r.json();
        })
        .then(function (base) {
          return base.map(normalize);
        });
    }

    function normalize(item) {
      return {
        title: String((item && item.title) || ""),
        description: String((item && item.description) || ""),
        type: String((item && item.type) || "INNE"),
        tags: Array.isArray(item && item.tags) ? item.tags.map(String) : [],
        url: String((item && item.url) || "#"),
      };
    }

    function buildDialog() {
      var overlay = document.createElement("div");
      overlay.className = "search-overlay";
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">' +
        '<div class="search-dialog__top"><h2 id="search-title">Szukaj po całej stronie</h2>' +
        '<button class="search-close" type="button" aria-label="Zamknij wyszukiwanie">\u00d7</button></div>' +
        '<label class="sr-only" for="search-input-field">Szukaj</label>' +
        '<input id="search-input-field" class="search-input" type="search" placeholder="Kampania, projekt, wpis, wiki\u2026" autocomplete="off">' +
        '<div class="search-results" aria-live="polite"></div>' +
        "</div>";
      overlay.querySelector(".search-close").addEventListener("click", close);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });
      overlay.querySelector(".search-input").addEventListener("input", function (e) {
        renderResults(e.target.value);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !overlay.hidden) close();
      });
      document.body.appendChild(overlay);
      return overlay;

      function close() {
        overlay.hidden = true;
        document.body.classList.remove("search-open");
      }
    }

    function renderResults(query) {
      var q = query.trim().toLowerCase();
      var matches = items
        .filter(function (i) {
          return !q || (i.title + " " + i.description + " " + i.type + " " + i.tags.join(" ")).toLowerCase().indexOf(q) !== -1;
        })
        .slice(0, 40);
      if (!matches.length) {
        results.innerHTML = '<p class="search-status">Brak wyników.</p>';
        return;
      }
      results.replaceChildren.apply(
        results,
        matches.map(function (i) {
          var a = document.createElement("a");
          a.className = "search-result";
          a.href = new URL(i.url, new URL(ROOT, location.href)).href;
          a.innerHTML =
            '<span class="search-result__type">' + escapeHtml(i.type) + "</span>" +
            "<strong>" + escapeHtml(i.title) + "</strong>" +
            "<span>" + escapeHtml(i.description) + "</span>";
          return a;
        })
      );
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
