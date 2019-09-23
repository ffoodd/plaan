(function () {
  'use strict';

  const room = document.getElementById('main');
  const rows = room.style.getPropertyValue('--rows');
  const plan = document.getElementById('plan');
  const form = document.getElementById('settings');
  const link = document.querySelector('[download]');
  const file = document.querySelector('[type="file"]');
  const zero = document.querySelector('[type="reset"]');

  function getAxis(item) {
    const max = item.getAttribute('max');
    return (max === rows) ? 'y' : 'x';
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.length) {
      link.href = 'data:text/json,' + JSON.stringify(localStorage);
    }
  });

  plan.querySelectorAll('[type="number"]').forEach(
    item => {
      const parent = item.closest('li');
      const label  = item.dataset.key;
      const axis   = getAxis(item);
      const value  = localStorage.getItem(label);
      let result   = {
        name: parent.querySelector('h2').textContent
      };

      if (value !== null) {
        result = JSON.parse(value);

        if (result[axis] !== undefined) {
          parent.style.setProperty(`--${axis}`, result[axis]);
          item.value = result[axis];
        }
      }

      item.addEventListener('change', event => {
        const position = event.target.value;
        result[axis] = position;
        parent.style.setProperty(`--${axis}`, position);
        localStorage.setItem(label, JSON.stringify(result));
        link.href = 'data:text/json,' + JSON.stringify(localStorage);
      }, false);
    }
  );

  plan.querySelectorAll('[data-step]').forEach(
    item => {
      const control = item.dataset.controls;
      const step    = item.dataset.step;
      const input   = document.getElementById(control);
      const change  = new Event('change', { bubbles: true });

      item.addEventListener('click', () => {
        switch (step) {
          case 'up':
            input.stepUp();
            input.dispatchEvent(change);
            break;
          case 'down':
            input.stepDown();
            input.dispatchEvent(change);
            break;
        }
      }, false);
    }
  );

  plan.querySelectorAll('.arrows').forEach(
    item => {
      const control    = item.dataset.controls;
      const change     = new Event('change', { bubbles: true });
      const vertical   = document.getElementById(`${control}-y`);
      const horizontal = document.getElementById(`${control}-x`);

      item.addEventListener('keydown', event => {
        switch (event.key) {
          case 'ArrowLeft':
            horizontal.stepDown();
            horizontal.dispatchEvent(change);
            break;
          case 'ArrowUp':
            vertical.stepDown();
            vertical.dispatchEvent(change);
            break;
          case 'ArrowRight':
            horizontal.stepUp();
            horizontal.dispatchEvent(change);
            break;
          case 'ArrowDown':
            vertical.stepUp();
            vertical.dispatchEvent(change);
            break;
        }
      }, false);
    }
  );

  // @todo Grille aussi (!)
  file.addEventListener('change', event => {
    const upload = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event => {
      JSON.parse(event.target.result, (label, value) => {
        localStorage.removeItem(label);

        const result     = JSON.parse(value);
        const item       = document.querySelector(`[data-controls="${label}"]`);
        const vertical   = document.getElementById(`${label}-y`);
        const horizontal = document.getElementById(`${label}-x`);
        const parent     = item.closest('li');

        if (result.y !== undefined) {
          parent.style.setProperty('--y', result.y);
          vertical.value = result.y;
        }

        if (result.x !== undefined) {
          parent.style.setProperty('--x', result.x);
          horizontal.value = result.x;
        }

        localStorage.setItem(label, value);
      });
    });

    reader.readAsText(upload);
  });

  // @todo Comment remettre les valeurs d’origine, dans les styles (?)
  zero.addEventListener('click', () => {
    localStorage.clear();
  });


  // @todo Partir d’un doc vide, importer un fichier pour mouliner le contenu :
  // @todo documentFragment pour ajouter les éléments de liste, etc.
})();
