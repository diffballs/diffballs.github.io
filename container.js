window.addEventListener('resize', _adapt_);

function _adapt_() {
  // header
  let header = document.getElementById('header');

  // container
  /* note: container was initialized in main.js */
  /* note: 8 - browser default margin */
  /* note: 2 - number of margins or something, don't know for sure, but it works */
  container.style.height =
    (window.innerHeight - header.offsetHeight - 8 * 2) + 'px';
}

_adapt_();
