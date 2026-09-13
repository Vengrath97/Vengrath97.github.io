const accessMenu = [...document.querySelectorAll('[data-access-link]')];
const accessScreen = document.querySelector('#access-screen');
const accessConsole = document.querySelector('#access-console');
const accessLog = document.querySelector('#access-log');
const accessBar = document.querySelector('#access-bar');
let accessIndex = -1;
let accessBusy = false;

function selectAccessItem(nextIndex) {
  accessIndex = (nextIndex + accessMenu.length) % accessMenu.length;
  accessMenu.forEach((item, index) => item.classList.toggle('is-selected', index === accessIndex));
}

function waitForTerminal(milliseconds) { return new Promise(resolve => window.setTimeout(resolve, milliseconds)); }

async function openAccessRoute(link) {
  if (accessBusy) return;
  accessBusy = true;
  accessScreen.hidden = true;
  accessConsole.classList.add('is-active');
  const label = link.dataset.accessLabel || link.textContent.trim();
  const lines = ['> REQUEST RECEIVED', `> OPENING CHANNEL: ${label}`, '[OK] ACCESS VERIFIED', '> RETRIEVING ARCHIVE NODE', '[OK] CONNECTION ESTABLISHED', '> TRANSFERRING CONTROL'];
  for (const line of lines) {
    const entry = document.createElement('div');
    entry.textContent = line;
    accessLog.append(entry);
    await waitForTerminal(90);
  }
  for (let percent = 0; percent <= 100; percent += 10) {
    accessBar.style.width = `${percent}%`;
    await waitForTerminal(32);
  }
  window.location.assign(link.href);
}

accessMenu.forEach((link, index) => {
  link.addEventListener('mouseenter', () => selectAccessItem(index));
  link.addEventListener('focus', () => selectAccessItem(index));
  link.addEventListener('click', event => { event.preventDefault(); openAccessRoute(link); });
});

document.addEventListener('keydown', event => {
  if (accessBusy) return;
  if (event.key === 'ArrowDown') { event.preventDefault(); selectAccessItem(accessIndex < 0 ? 0 : accessIndex + 1); }
  if (event.key === 'ArrowUp') { event.preventDefault(); selectAccessItem(accessIndex < 0 ? accessMenu.length - 1 : accessIndex - 1); }
  if (event.key === 'Enter' && accessIndex >= 0) { event.preventDefault(); openAccessRoute(accessMenu[accessIndex]); }
});
