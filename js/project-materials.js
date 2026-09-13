const materialHost = document.querySelector('[data-project-materials]');

if (materialHost) {
  loadProjectMaterials().catch(error => {
    console.warn('Project materials unavailable:', error);
    materialHost.hidden = true;
  });
}

async function loadProjectMaterials() {
  const response = await fetch('./materials/index.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const manifest = await response.json();
  const manifestUrl = response.url;
  const pdf = manifest?.pdf && await resolveResource(manifest.pdf.src, manifestUrl) ? { ...manifest.pdf, src: resolveResource(manifest.pdf.src, manifestUrl) } : null;
  const images = Array.isArray(manifest?.images)
    ? (await Promise.all(manifest.images.map(async image => {
        if (!image?.src) return null;
        const src = resolveResource(image.src, manifestUrl);
        return await validResource(src) ? { ...image, src } : null;
      }))).filter(Boolean)
    : [];

  if (!pdf && !images.length) { materialHost.hidden = true; return; }
  materialHost.hidden = false;
  materialHost.replaceChildren(buildMaterialIntro(manifest, pdf, images));
  if (pdf) materialHost.append(buildPdfBlock(pdf));
  if (images.length) materialHost.append(buildImageGallery(images));
}

function resolveResource(src, baseUrl) {
  try { return new URL(String(src || ''), baseUrl).href; }
  catch { return ''; }
}

async function validResource(src) {
  if (!src) return false;
  try { return (await fetch(src, { method: 'HEAD', cache: 'no-store' })).ok; }
  catch { return false; }
}

function buildMaterialIntro(manifest, pdf, images) {
  const wrapper = document.createElement('div');
  wrapper.className = 'project-materials-inner project-materials-inner--assets';
  wrapper.innerHTML = `<div><p class="eyebrow">[ MATERIAŁY ]</p><h2>${escapeHtml(manifest.title || 'Materiały projektu')}</h2></div><p>${escapeHtml(manifest.description || `${pdf ? 'PDF projektu jest dostępny do podglądu i pobrania.' : ''}${pdf && images.length ? ' ' : ''}${images.length ? 'Zdjęcia i ilustracje są dostępne poniżej.' : ''}`)}</p>`;
  return wrapper;
}

function buildPdfBlock(pdf) {
  const section = document.createElement('div');
  section.className = 'project-material project-material--pdf';
  section.innerHTML = `<div class="project-material__head"><div><small>PDF</small><h3>${escapeHtml(pdf.title || 'Dokument projektu')}</h3></div><a class="button project-material__download" href="${safeUrl(pdf.src)}" download>POBIERZ PDF ↗</a></div>`;
  if (pdf.preview !== false) {
    const preview = document.createElement('iframe');
    preview.className = 'project-material__pdf-preview';
    preview.src = safeUrl(pdf.src);
    preview.title = pdf.title || 'Podgląd PDF';
    preview.loading = 'lazy';
    section.append(preview);
  }
  return section;
}

function buildImageGallery(images) {
  const section = document.createElement('div');
  section.className = 'project-material project-material--gallery';
  const title = document.createElement('h3');
  title.textContent = 'Zdjęcia i ilustracje';
  section.append(title);
  const grid = document.createElement('div');
  grid.className = 'project-material__gallery';
  for (const item of images) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = safeUrl(item.src);
    image.alt = item.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    figure.append(image);
    if (item.caption) { const caption = document.createElement('figcaption'); caption.textContent = item.caption; figure.append(caption); }
    grid.append(figure);
  }
  section.append(grid);
  return section;
}

function safeUrl(value) {
  const url = String(value || '');
  return /^https?:\/\//i.test(url) || url.startsWith('/') ? url : '';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
