const gallery = document.querySelector('#illustration-gallery');
const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const API_ROOT = 'https://api.github.com/repos/vengrathdm/vengrathdm.github.io/contents/illustrations/graphics?ref=main';
let lightbox;

if (gallery) loadGallery().catch(handleError);

async function loadGallery() {
  const files = await getFiles(API_ROOT);
  files.sort((a,b) => a.name.localeCompare(b.name, 'pl'));
  if (!files.length) { gallery.innerHTML = '<p class="project-empty">Brak ilustracji do wyświetlenia.</p>'; return; }
  gallery.replaceChildren(...files.map(createItem));
}
async function getFiles(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const entries = await response.json(), files = [];
  for (const entry of entries) {
    if (entry.type === 'file' && IMAGE_EXTENSIONS.test(entry.name)) files.push(entry);
    else if (entry.type === 'dir') files.push(...await getFiles(entry.url));
  }
  return files;
}
function createItem(file) {
  const figure = document.createElement('figure'); figure.className='gallery-item'; figure.tabIndex=0; figure.setAttribute('role','button');
  const title=formatTitle(file.name), image=document.createElement('img'); image.src=file.download_url; image.alt=title; image.loading='lazy'; image.decoding='async';
  const caption=document.createElement('figcaption'); caption.textContent=title; figure.append(image,caption);
  figure.addEventListener('click',()=>openLightbox(file)); figure.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(file);}}); return figure;
}
function openLightbox(file){if(!lightbox)lightbox=createLightbox();const image=lightbox.querySelector('.gallery-lightbox__image'),caption=lightbox.querySelector('.gallery-lightbox__caption');image.src=file.download_url;image.alt=formatTitle(file.name);caption.textContent=formatTitle(file.name);lightbox.hidden=false;document.body.classList.add('gallery-lightbox-open');lightbox.querySelector('.gallery-lightbox__close').focus();}
function createLightbox(){const overlay=document.createElement('div');overlay.className='gallery-lightbox';overlay.hidden=true;overlay.innerHTML='<button class="gallery-lightbox__close" type="button" aria-label="Zamknij podgląd">×</button><div class="gallery-lightbox__content" role="dialog" aria-modal="true" aria-label="Powiększona ilustracja"><img class="gallery-lightbox__image" alt=""><p class="gallery-lightbox__caption"></p></div>';const close=overlay.querySelector('.gallery-lightbox__close'),content=overlay.querySelector('.gallery-lightbox__content');close.addEventListener('click',closeLightbox);overlay.addEventListener('click',e=>{if(e.target===overlay)closeLightbox();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeLightbox();});document.body.append(overlay);return overlay;}
function closeLightbox(){if(!lightbox)return;lightbox.hidden=true;document.body.classList.remove('gallery-lightbox-open');}
function formatTitle(filename){return filename.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim().replace(/(^|\s)\S/g,l=>l.toUpperCase());}
function handleError(error){console.error('Illustration gallery error:',error);gallery.innerHTML='<p class="project-empty">Nie udało się załadować galerii ilustracji.</p>';}
