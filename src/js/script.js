(function () {
  'use strict';

  const room = document.getElementById('main');
  const rows = room.style.getPropertyValue('--rows');
  const cols = room.style.getPropertyValue('--cols');
  const inputs = document.querySelectorAll('[type="number"]');

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

  /*document.querySelector('a[download]').addEventListener('click', function() {
    this.href = 'data:text/json,' + JSON.stringify(localStorage);
  });*/

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

  /*document.querySelector('input[type="reset"]') → vider localStorage*/
})();
