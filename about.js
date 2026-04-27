// ============================================================
// The Shiny Hunting Guide — about.js
// Contact form confirmation message
// ============================================================

(function () {
  var form    = document.getElementById('contact-form');
  var confirm = document.getElementById('form-confirm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    confirm.textContent = 'Thanks for your feedback! It has been received.';
    form.reset();
  });
}());
