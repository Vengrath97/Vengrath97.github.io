document.documentElement.classList.add('terminal-ready');

document.querySelectorAll('[data-terminal-clock]').forEach((node) => {
  const render = () => { node.textContent = new Date().toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }); };
  render();
  window.setInterval(render, 60000);
});

document.querySelectorAll('.archive-entry').forEach((entry) => {
  entry.addEventListener('mouseenter', () => entry.closest('.archive-list')?.setAttribute('data-active', entry.dataset.code || 'OPEN'));
  entry.addEventListener('mouseleave', () => entry.closest('.archive-list')?.removeAttribute('data-active'));
});
