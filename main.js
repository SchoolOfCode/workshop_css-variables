const darkModeButton = document.querySelector('#dark-mode-button');
const body = document.querySelector('body');

function toggleDarkMode() {
  //---Write your code below:---
  body.classList.toggle('dark-mode-theme');
  //---Write your code above!---
}

darkModeButton.addEventListener('click', toggleDarkMode);
