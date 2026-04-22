document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-toggle').forEach(btn => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.icon');

    // initial state
    if (icon && !content.classList.contains('hidden')) {
      icon.textContent = '−';
    }

    // click event
    btn.addEventListener('click', () => {
      content.classList.toggle('hidden');

      if (icon) {
        icon.textContent = content.classList.contains('hidden') ? '+' : '−';
      }
    });
  });
});