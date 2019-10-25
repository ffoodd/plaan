(function () {
  'use strict';

  const rows = 4;
  const cols = 7;

  const plan = document.getElementById('plan');
  const form = document.getElementById('settings');

  function createForm(prop, x, y) {
    const label = prop.toLowerCase().replace(' ', '-');
    const template = `
      <div class="table">
        <button type="button" class="arrows" data-controls="${label}">
          <span class="sr-only">Utilisez les flèches pour déplacer ${prop}</span>
        </button>
        <h2>${prop}</h2>
        <button type="button" data-controls="${label}-y" data-step="down"
                class="↑" aria-label="Monter" tabindex="-1">↑</button>
        <button type="button" data-controls="${label}-y" data-step="up"
                class="↓" aria-label="Descendre" tabindex="-1">↓</button>
        <button type="button" data-controls="${label}-x" data-step="up"
                class="→" aria-label="Décaler à droite" tabindex="-1">→</button>
        <button type="button" data-controls="${label}-x" data-step="down"
                class="←" aria-label="Décaler à gauche" tabindex="-1">←</button>
      </div>
      <form class="sr-only">
        <p>
          <label for="${label}-y">Ligne</label>
          <input type="number" step="1" min="1" max="${rows}" value="${y}"
                 tabindex="-1" data-key="${label}" id="${label}-y"/>
        </p>
        <p>
          <label for="${label}-x">Colonne</label>
          <input type="number" step="1" min="1" max="${cols}" value="${x}"
                tabindex="-1" data-key="${label}" id="${label}-x"/>
        </p>
      </form>`;

    return document.createRange().createContextualFragment(template);
  }

  function createPanel() {
    const template = `
			<button type="button" class="no-margin">
          <span aria-hidden="true">&#9881;</span>&nbsp;Réglages
        </button>
        <form>
          <div class="grid-2">
            <a download="plaan.json" class="no-margin">Exporter</a>
            <p class="no-margin">
              <label for="import">Importer</label>
              <input id="import" name="import" type="file" accept="json" class="sr-only"/>
            </p>
          </div>
          <input id="reset" name="reset" type="reset" value="Annuler les modifications"/>
        </form>`;

    return document.createRange().createContextualFragment(template);
  }

  document.addEventListener('DOMContentLoaded', () => {
    main.style.setProperty('--rows', rows);
    main.style.setProperty('--cols', cols);

    const panel = createPanel();
    form.append(panel);

    const link = document.querySelector('[download]');
    const file = document.querySelector('[type="file"]');
    const zero = document.querySelector('[type="reset"]');
    const change = new Event('change', { bubbles: true });

    if (localStorage.length) {
      link.href = 'data:text/json,' + JSON.stringify(localStorage);
    }

    plan.querySelectorAll('[style]').forEach(item => {
      const name = item.textContent;
      const x = item.style.getPropertyValue('--x');
      const y = item.style.getPropertyValue('--y');
      const form = createForm(name, x, y);

      item.innerHTML = '';
      item.append(form);

      item.querySelectorAll('[type="number"]').forEach(input => {
        const label  = input.dataset.key;
        const max    = Number(input.getAttribute('max'));
        const axis   = (max === rows) ? 'y' : 'x';
        const value  = localStorage.getItem(label);
        let result   = {
          name: name
        };

        if (value !== null) {
          result = JSON.parse(value);

          if (result[axis] !== undefined) {
            item.style.setProperty(`--${axis}`, result[axis]);
            input.value = result[axis];
          }
        }

        input.addEventListener('change', event => {
          const position = event.target.value;
          const stored = localStorage.getItem(label);
          if (stored !== null) {
            result = JSON.parse(stored);
          }
          result[axis] = position;
          item.style.setProperty(`--${axis}`, position);
          localStorage.setItem(label, JSON.stringify(result));
          link.href = 'data:text/json,' + JSON.stringify(localStorage);
        }, false);
      });

      item.querySelectorAll('[data-step]').forEach(arrow => {
        const step = arrow.dataset.step;

        arrow.addEventListener('click', () => {
          const isPortrait = matchMedia('screen and (orientation: portrait)').matches;
          let control      = arrow.dataset.controls;

          if (isPortrait) {
            const axis = (control.slice(-1) === 'x') ? 'y' : 'x';
            control = control.slice(0, -1) + axis;
          }

          const input      = document.getElementById(control);
          const rotateKeys = isPortrait && control.slice(-1) === 'y';
          const UP         = rotateKeys ? 'down' : 'up';
          const DOWN       = rotateKeys ? 'up' : 'down';

          switch (step) {
            case UP:
              input.stepUp();
              input.dispatchEvent(change);
              break;
            case DOWN:
              input.stepDown();
              input.dispatchEvent(change);
              break;
          }
        }, false);
      });

      item.querySelectorAll('.arrows').forEach(arrows => {
        const control    = arrows.dataset.controls;
        const vertical   = document.getElementById(`${control}-y`);
        const horizontal = document.getElementById(`${control}-x`);

        arrows.addEventListener('keydown', event => {
          const isPortrait = matchMedia('screen and (orientation: portrait)').matches;
          const LEFT       = isPortrait ? 'ArrowUp' : 'ArrowLeft';
          const UP         = isPortrait ? 'ArrowRight' : 'ArrowUp';
          const RIGHT      = isPortrait ? 'ArrowDown' : 'ArrowRight';
          const DOWN       = isPortrait ? 'ArrowLeft' : 'ArrowDown';

          switch (event.key) {
            case LEFT:
              horizontal.stepDown();
              horizontal.dispatchEvent(change);
              break;
            case UP:
              vertical.stepDown();
              vertical.dispatchEvent(change);
              break;
            case RIGHT:
              horizontal.stepUp();
              horizontal.dispatchEvent(change);
              break;
            case DOWN:
              vertical.stepUp();
              vertical.dispatchEvent(change);
              break;
          }
        }, false);
      });
    });

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

    zero.addEventListener('click', () => {
      localStorage.clear();
      document.location.reload();
    });
  });
})();
