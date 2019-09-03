(function () {
  'use strict';

  /*document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[type="number"]').forEach(
      function(item){
        var axis  = (item.getAttribute('max') === '16') ? '--posY' : '--posX';
        var value = localStorage.getItem(item.id);
        item.parentNode.parentNode.parentNode.style.setProperty(axis, value);
        item.value = value;
      });
  });

  document.querySelectorAll('[type="number"]').forEach(
    function(item, i){
      item.addEventListener('input', function(event) {
          var axis = (item.getAttribute('max') === '16') ? '--posY' : '--posX';
          item.parentNode.parentNode.parentNode.style.setProperty(axis, event.target.value);
          localStorage.setItem(item.id, event.target.value);
      });
    });*/

  document.querySelector('a[download]').addEventListener('click', function() {
    this.href = 'data:text/json,' + JSON.stringify(localStorage);
  });

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
})();
