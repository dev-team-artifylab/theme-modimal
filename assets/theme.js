document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('CollectionFiltersForm');
  const applyBtn = document.getElementById('applyBtn');

  let visible = 6;

  // --------------------------
  // INIT ALL
  // --------------------------
  function initAll() {
    initAccordion();
    initLoadMore();
    initCheckbox();
    initPrice();
  }

  // --------------------------
  // ACCORDION
  // --------------------------
  function initAccordion() {
    document.querySelectorAll('.filter-toggle').forEach(btn => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.icon');

      btn.addEventListener('click', () => {
        content.classList.toggle('hidden');
        icon.textContent = content.classList.contains('hidden') ? '+' : '−';
      });
    });
  }

  // --------------------------
  // LOAD MORE
  // --------------------------
  function initLoadMore() {
    const items = document.querySelectorAll('.product-item');
    const btn = document.getElementById('loadMoreBtn');

    if (!items.length || !btn) return;

    items.forEach((item, index) => {
      item.classList.toggle('hidden', index >= visible);
    });

    btn.style.display = items.length > visible ? 'block' : 'none';

    btn.onclick = () => {
      visible += 6;

      items.forEach((item, index) => {
        if (index < visible) item.classList.remove('hidden');
      });

      if (visible >= items.length) {
        btn.style.display = 'none';
      }
    };
  }

  // --------------------------
  // CHECKBOX → APPLY BTN + AUTO FILTER
  // --------------------------
  function initCheckbox() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        applyBtn.classList.remove('hidden');
      });
    });
  }

  // --------------------------
  // PRICE FILTER
  // --------------------------
  function initPrice() {

  const minRange = document.querySelector('.range-min');
  const maxRange = document.querySelector('.range-max');
  const minInput = document.querySelector('.min-input');
  const maxInput = document.querySelector('.max-input');
  const track = document.getElementById('slider-track');

  if (!minRange || !maxRange) return;

  const max = parseInt(maxRange.max);

  function updateTrack() {
    const minVal = parseInt(minRange.value);
    const maxVal = parseInt(maxRange.value);

    const left = (minVal / max) * 100;
    const width = ((maxVal - minVal) / max) * 100;

    track.style.left = left + '%';
    track.style.width = width + '%';
  }

  function syncMin() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);

    if (minVal >= maxVal) {
      minVal = maxVal - 1;
      minRange.value = minVal;
    }

    minInput.value = minVal;
    updateTrack();
  }

  function syncMax() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);

    if (maxVal <= minVal) {
      maxVal = minVal + 1;
      maxRange.value = maxVal;
    }

    maxInput.value = maxVal;
    updateTrack();
  }

  // 🔥 SLIDER → INPUT
  minRange.addEventListener('input', syncMin);
  maxRange.addEventListener('input', syncMax);

  // 🔥 INPUT → SLIDER (SAFE)
  minInput.addEventListener('input', () => {
    let val = parseInt(minInput.value) || 0;

    if (val >= maxRange.value) {
      val = maxRange.value - 1;
    }

    minRange.value = val;
    minInput.value = val;
    updateTrack();
  });

  maxInput.addEventListener('input', () => {
    let val = parseInt(maxInput.value) || 0;

    if (val <= minRange.value) {
      val = parseInt(minRange.value) + 1;
    }

    maxRange.value = val;
    maxInput.value = val;
    updateTrack();
  });

  updateTrack();

  // 🔥 AUTO APPLY (DEBOUNCE)
  let timer;
  function autoSubmit() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      applyFilters();
    }, 400);
  }

  minRange.addEventListener('change', autoSubmit);
  maxRange.addEventListener('change', autoSubmit);
}

  // --------------------------
  // MAIN AJAX FILTER FUNCTION
  // --------------------------
  function applyFilters() {

    const formData = new FormData(form);

    const minInput = document.querySelector('.min-input');
    const maxInput = document.querySelector('.max-input');

    // 🔥 PRICE → convert to cents
    if (minInput && maxInput) {
      formData.set(minInput.name, (parseInt(minInput.value) || 0) * 100);
      formData.set(maxInput.name, (parseInt(maxInput.value) || 0) * 100);
    }

    const params = new URLSearchParams(formData).toString();

    fetch(window.location.pathname + '?' + params)
      .then(res => res.text())
      .then(html => {

        const doc = new DOMParser().parseFromString(html, 'text/html');

        // 🔥 UPDATE PRODUCT GRID
        const newGrid = doc.querySelector('#product-grid');
        const currentGrid = document.querySelector('#product-grid');

        if (newGrid && currentGrid) {
          currentGrid.innerHTML = newGrid.innerHTML;
        }

        // 🔥 UPDATE FILTER SIDEBAR (chips + states)
        const newForm = doc.querySelector('#CollectionFiltersForm');
        if (newForm) {
          form.innerHTML = newForm.innerHTML;
        }

        // 🔥 RESET LOAD MORE
        visible = 6;

        // 🔥 RE-INIT EVERYTHING
        initAll();

        // 🔥 UPDATE URL
        window.history.replaceState({}, '', '?' + params);
      });

      
  }

  // --------------------------
  // FORM SUBMIT → AJAX
  // --------------------------
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters();
  });

  // --------------------------
  // INIT
  // --------------------------
  initAll();

});