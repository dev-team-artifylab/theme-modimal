document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-toggle').forEach(btn => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.icon');
    const parent = btn.closest('.filter-item');

    // initial state
    if (content && !content.classList.contains('hidden')) {
      icon.textContent = '−';

      parent.classList.add('border', 'border-[#748C70]', 'p-2');

      btn.classList.remove('bg-[#748C70]', 'text-white');
      btn.classList.add('bg-transparent', 'text-[#748C70]');
    }

    btn.addEventListener('click', () => {
      content.classList.toggle('hidden');

      const isHidden = content.classList.contains('hidden');

      // icon
      icon.textContent = isHidden ? '+' : '−';

      if (isHidden) {
        // CLOSED
        parent.classList.remove('border', 'border-[#748C70]', 'p-2');

        btn.classList.add('bg-[#748C70]', 'text-white');
        btn.classList.remove('bg-transparent', 'text-[#748C70]');
      } else {
        // OPEN
        parent.classList.add('border', 'border-[#748C70]', 'p-2');

        btn.classList.remove('bg-[#748C70]', 'text-white');
        btn.classList.add('bg-transparent', 'text-[#748C70]');
      }
    });
  });
});