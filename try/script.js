const toggleBtn = document.getElementById('drawer-toggle');
const drawer = document.getElementById('pullout-drawer');

toggleBtn.addEventListener('click', () => {
  if (drawer.open) {
    drawer.close();
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerText = 'Menu'; // Optional: change button text
  } else {
    drawer.showModal();
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.innerText = 'Close'; // Optional: change button text
  }
});

// A11y fix: If user presses 'ESC' to close, update the button state too
drawer.addEventListener('close', () => {
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerText = 'Menu';
});