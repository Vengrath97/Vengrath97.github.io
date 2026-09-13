const root = document.querySelector('#lore-index');
const sidebar = document.querySelector('#lore-sidebar-groups');
const search = document.querySelector('#lore-search');
const status = document.querySelector('#lore-status');
const title = document.querySelector('#lore-title');
const description = document.querySelector('#lore-description');

const manifestUrl = './articles/index.json';
const articleFolder = './articles/';
let data = { categories: [], articles: [] };

init();

async function init() {
  try {
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = normalizeManifest(await response.json());
  } catch (error) {
    console.error('Lore manifest error:', error);
    status.textContent = 'BŁĄD ŁADOWANIA';
    root.innerHTML = '<p class="lore-empty">Nie udało się załadować indeksu kompendium.</p>';
    return;
  }

  render('');
  search?.addEventListener('input', event => render(event.target.value));

  const requested = new URLSearchParams(location.search).get('article');
  if (requested) {
    const article = data.articles.find(item => item.file === requested);
    if (article) await loadArticle(article);
  }
}

function normalizeManifest(value) {
  const categories = Array.isArray(value.categories) ? value.categories : [];
  const articles = Array.isArray(value.articles) ? value.articles : [];
  return {
    categories,
    articles: articles.filter(item => item && item.title && item.category).map(item => ({
      ...item,
      file: item.file ? String(item.file).trim() : null
    }))
  };
}

function articleHref(article) {
  return article.file ? `?article=${encodeURIComponent(article.file)}` : '#';
}

function render(query) {
  const needle = query.trim().toLowerCase();
  const groups = data.categories.map(category => {
    const entries = data.articles.filter(article => article.category === category.id && (!needle || article.title.toLowerCase().includes(needle)));
    if (!entries.length) return '';
    return `<section class="lore-category"><h2 class="lore-category__title">${escapeHtml(category.title || category.label)}</h2><div class="lore-links">${entries.map(article => `<a href="${articleHref(article)}" data-file="${escapeHtml(article.file || '')}"><span>${escapeHtml(article.title)}</span><b>↗</b></a>`).join('')}</div></section>`;
  }).join('');
  root.innerHTML = groups || '<p class="lore-empty">Brak wpisów dla tego wyszukiwania.</p>';
  root.querySelectorAll('a[data-file]').forEach(link => link.addEventListener('click', async event => {
    const file = link.dataset.file;
    if (!file) return;
    event.preventDefault();
    const article = data.articles.find(item => item.file === file);
    if (article) await loadArticle(article);
    history.replaceState(null, '', `?article=${encodeURIComponent(file)}`);
  }));
  renderSidebar(needle);
  status.textContent = `${data.articles.filter(article => !needle || article.title.toLowerCase().includes(needle)).length} WPISÓW`;
}

function renderSidebar(needle = '', activeFile = '') {
  if (!sidebar) return;
  sidebar.innerHTML = data.categories.map(category => {
    const entries = data.articles.filter(article => article.category === category.id && (!needle || article.title.toLowerCase().includes(needle)));
    if (!entries.length) return '';
    return `<section class="lore-sidebar__group"><h2>${escapeHtml(category.title || category.label)}</h2>${entries.map(article => `<a class="${article.file === activeFile ? 'is-active' : ''}" href="${articleHref(article)}" data-file="${escapeHtml(article.file || '')}">${escapeHtml(article.title)}</a>`).join('')}</section>`;
  }).join('');
  sidebar.querySelectorAll('a[data-file]').forEach(link => link.addEventListener('click', async event => {
    const file = link.dataset.file;
    if (!file) return;
    event.preventDefault();
    const article = data.articles.find(item => item.file === file);
    if (article) await loadArticle(article);
    history.replaceState(null, '', `?article=${encodeURIComponent(file)}`);
  }));
}

async function loadArticle(article) {
  try {
    if (!article.file) throw new Error('Brak pliku artykułu');
    const safeFile = article.file.split('/').pop();
    if (safeFile !== article.file || !safeFile.endsWith('.html')) throw new Error('Nieprawidłowa ścieżka artykułu');

    const response = await fetch(articleFolder + safeFile, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const articleNode = parsed.querySelector('article');
    if (!articleNode) throw new Error('Brak elementu article');

    document.title = `${article.title} — Echtra — Vengrath`;
    if (title) title.textContent = article.title;
    if (description) description.textContent = 'Wpis kompendium świata Echtra midst the Sidhe.';
    root.innerHTML = `<p><a href="./" id="lore-back">← Wszystkie wpisy</a></p>${articleNode.outerHTML}`;
    document.querySelector('#lore-back')?.addEventListener('click', event => {
      event.preventDefault();
      history.replaceState(null, '', './');
      document.title = 'Echtra midst the Sidhe — Kompendium — Vengrath';
      if (title) title.innerHTML = 'Kompendium<br><em>Irgaeli.</em>';
      if (description) description.textContent = 'Miejsca, ludy, bóstwa, Sidhe, Fomorianie, wielkie wyrmy, istoty i przedmioty. Wpisy są porządkowane według istniejącej struktury świata.';
      render(search?.value || '');
    });
    renderSidebar('', article.file);
    status.textContent = article.title;
  } catch (error) {
    console.error('Lore article error:', error, article);
    status.textContent = 'BŁĄD ŁADOWANIA';
    root.innerHTML = `<p class="lore-empty">Nie udało się załadować artykułu „${escapeHtml(article.title)}”.</p>`;
  }
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
