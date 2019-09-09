(function () {
  'use strict';

  const room = document.getElementById('main');
  const rows = room.style.getPropertyValue('--rows');
  const cols = room.style.getPropertyValue('--cols');
  const inputs = document.querySelectorAll('[type="number"]');

  // @todo Formater localStorage, en mode package.json ?
  document.addEventListener('DOMContentLoaded', () => {
    inputs.forEach(
      item => {
        const parent = item.parentNode.parentNode.parentNode;
        const max    = item.getAttribute('max');
        const axis   = (max === rows) ? '--posY' : '--posX';
        const value  = localStorage.getItem(item.id);
        if (value !== null) {
          parent.style.setProperty(axis, value);
          item.value = value;
        }

        item.addEventListener('input', event => {
            parent.style.setProperty(axis, event.target.value);
            localStorage.setItem(item.id, event.target.value);
        });
      });
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
            var item = document.querySelector('#' + key);
            if (item) {
              var axis = (item.getAttribute('max') === '16') ? '--posY' : '--posX';
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


  // @todo Partir d’un doc vide, importer un fichier pour mouliner le contenu :
  // @todo documentFragment pour ajouter les éléments de liste, etc.
})();
