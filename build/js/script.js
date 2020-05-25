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

var accordions = document.getElementsByClassName("accordion");
var open = document.getElementsByClassName('accordion-open');
for (var i = 0; i < accordions.length; i++) {
  accordions[i].onclick = function() {
    if (open.length > 0 && open[0] !== this)
      open[0].classList.remove('accordion-open');
      this.classList.toggle('accordion-open');
  }
}

var onToggleSlider = function(classNameSlide, classNameButton) {
  var active = 0, prev = 0;
  var slides = document.getElementsByClassName(classNameSlide);
  var arrows = document.getElementsByClassName(classNameButton);

  for(var i=0; i<arrows.length; i++) {
    arrows[i].addEventListener('click', function(e) {
      prev = active;
      if(!!~e.target.classList[1].indexOf('left')) {
        active-1 >= 0 ? --active : active = slides.length-1;
      } else {
        active+1 <= slides.length-1 ? ++active : active = 0;
      }
      changeActiveSlide(prev);
    });
  }
  var changeActiveSlide = function(prev) {
    slides[prev].classList.remove('show');
    slides[active].classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  onToggleSlider('comments__slide', 'comments__button');
});
