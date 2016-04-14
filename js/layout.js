window.onload = function(_) {
  var header = document.querySelector('.site-header');
  var article = document.querySelector('article');
  var headerHeight = header.scrollHeight;

  window.addEventListener('scroll', function() {
    var scroll = window.scrollY;
    if (scroll > headerHeight) {
      header.classList.add('scrolled');
      article.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      article.classList.remove('scrolled');
    }
  });
}
