const body = document.querySelector('body');
const darkModeButton = document.querySelector('#dark-mode-button');

function toggleDarkMode() {
  body.classList.toggle('dark-mode-theme');
}

darkModeButton.addEventListener('click', toggleDarkMode);
