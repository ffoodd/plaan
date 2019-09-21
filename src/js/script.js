(function () {
  'use strict';

  const room = document.getElementById('main');
  const rows = room.style.getPropertyValue('--rows');
  const plan = document.getElementById('plan');
  const form = document.getElementById('settings');

  function getAxis(item) {
    const max = item.getAttribute('max');
    return (max === rows) ? 'y' : 'x';
  }

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
          case "up":
            input.stepUp(1);
            input.dispatchEvent(change);
            break;
          case "down":
            input.stepDown(1);
            input.dispatchEvent(change);
            break;
          default:
            console.warn(`${item.textContent} value for data-step matches nothing…`);
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
        switch (event.keyCode) {
          case 9:
          case 16:
            break;
          case 37:
            horizontal.stepDown(1);
            horizontal.dispatchEvent(change);
            break;
          case 38:
            vertical.stepDown(1);
            vertical.dispatchEvent(change);
            break;
          case 39:
            horizontal.stepUp(1);
            horizontal.dispatchEvent(change);
            break;
          case 40:
            vertical.stepUp(1);
            vertical.dispatchEvent(change);
            break;
          default:
            console.warn(`${event.keyCode} can't move ${control}…`);
        }
      }, false);
    }
  );

  form.addEventListener('click', () => {
    let expanded = form.getAttribute('aria-expanded') === 'true' || false;
    form.setAttribute('aria-expanded', !expanded);
    form.nextElementSibling.hidden = expanded;
  });

  // @todo Vérifier si localStorage n’est pas vide
  // @todo Sinon désactiver le lien
  /*document.querySelector('a[download]').addEventListener('click', function() {
    this.href = 'data:text/json,' + JSON.stringify(localStorage);
  });*/

  // @todo Grille + personnes + positions
  // @todo Idem pour enregistrer dans localStorage
  /*document.querySelector('input[type="file"]').addEventListener('change', function(e) {
    var file   = e.target.files[0];
    var reader = new FileReader();

    reader.onload = (function(f) {
      return function(e) {
        JSON.parse(e.target.result, function(key, value) {
          localStorage.removeItem(key);

          if (key !== '') {
            const item = document.querySelector('#' + key);
            if (item) {
              const axis = getAxis(item);
              item.parentNode.parentNode.parentNode.style.setProperty(axis, value);
            }
          }

          localStorage.setItem(key, value);
        });
      }
    })(file);

    reader.readAsText(file);
  });*/

  // @todo Idem que export : si localStorage vide, désactiver
  /*document.querySelector('input[type="reset"]') → vider localStorage*/
  // @see https://developer.mozilla.org/fr/docs/Web/API/Storage/clear


  // @todo Partir d’un doc vide, importer un fichier pour mouliner le contenu :
  // @todo documentFragment pour ajouter les éléments de liste, etc.
})();
