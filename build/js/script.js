'use strict';

var tabs = document.querySelectorAll('.tabs__title');

tabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    var id = this.getAttribute('data-item');
    var content = document.querySelector('.tabs__item[data-item="'+id+'"]');
    var activeTab = document.querySelector('.tabs__title.is-active');
    var activeContent = document.querySelector('.tabs__item.is-active');

    activeTab.classList.remove('is-active');
    tab.classList.add('is-active');

    activeContent.classList.remove('is-active');
    content.classList.add('is-active');
  });
});
