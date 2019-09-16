(function () {
  'use strict';

  const room = document.getElementById('main');
  const rows = room.style.getPropertyValue('--rows');
  const cols = room.style.getPropertyValue('--cols');

  function getAxis(item) {
    const max = item.getAttribute('max');
    return (max === rows) ? 'y' : 'x';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[type="number"]').forEach(
      item => {
        const parent = item.closest('li');
        const label  = item.dataset.key;
        const axis   = getAxis(item);
        const value  = localStorage.getItem(label);
        let result   = {
          name: parent.querySelector('button').textContent
        };

        if (value !== null) {
          result = JSON.parse(value);

          if (result[axis] !== undefined) {
            parent.style.setProperty(`--${axis}`, result[axis]);
            item.value = result[axis];
          }
        }

        item.addEventListener('input', event => {
          const position = event.target.value;
          result[axis] = position;
          parent.style.setProperty(`--${axis}`, position);
          localStorage.setItem(label, JSON.stringify(result));
        });
      }
    );
  });

  // @todo Vérifier si localStorage n’est pas vide
  // @todo Sinon désactiver le lien
  /*document.querySelector('a[download]').addEventListener('click', function() {
    this.href = 'data:text/json,' + JSON.stringify(localStorage);
  });*/

  // @todo Formater localStorage pour correspondre ?
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
