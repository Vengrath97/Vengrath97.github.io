const list = document.querySelector('#blog-posts');
const status = document.querySelector('#blog-status');

async function loadPosts() {
  try {
    const response = await fetch('./posts.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('posts.json must contain an array');
    list.replaceChildren();
    if (!posts.length) { list.append(emptyRow('Brak wpisów w archiwum.')); status.textContent = 'ARCHIWUM · 0 WPISÓW'; return; }
    posts.sort((a,b) => String(b.date).localeCompare(String(a.date)));
    posts.forEach(post => list.append(postRow(post)));
    status.textContent = `ARCHIWUM · ${posts.length} ${posts.length === 1 ? 'WPIS' : 'WPISÓW'}`;
  } catch (error) {
    console.error('Blog archive error:', error);
    list.replaceChildren(emptyRow('Nie udało się załadować archiwum.'));
    status.textContent = 'ARCHIWUM · BŁĄD ŁADOWANIA';
  }
}
function postRow(post) {
  const article = document.createElement('article'); article.className='blog-entry';
  article.innerHTML=`<div class="blog-entry__index">${escapeHtml(post.date||'—')}</div><div class="blog-entry__body"><p class="eyebrow">${escapeHtml(post.category||'NOTATKA')} · ${escapeHtml(post.system||'')}</p><h2><a href="${safePath(post.url)}">${escapeHtml(post.title||'Bez tytułu')}</a></h2><p>${escapeHtml(post.description||'')}</p></div><a class="blog-entry__arrow" href="${safePath(post.url)}" aria-label="Otwórz wpis">↗</a>`; return article;
}
function emptyRow(message){const element=document.createElement('p');element.className='blog-empty';element.textContent=message;return element;}
function safePath(value){const normalized=String(value??'').replace(/^\/+/, '');return normalized.includes('..')||normalized.startsWith('/')?'#':normalized;}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
if(list) loadPosts();
