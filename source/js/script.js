'use strict';

//Попап форма

var ESC_KEYCODE = 27;
var renderModal = function (classPopup, classClosed, classOpen, overlay, buttonClosed, buttonOk=null) {
  var overflow = document.querySelector('body');
  var modal = document.querySelector(classPopup);
  if (modal.classList.contains(classClosed)) {
    modal.classList.remove(classClosed);
    modal.classList.add(classOpen);
    overflow.classList.add('scroll-hidden');
  } else {
    modal.classList.add(classClosed);
    modal.classList.remove(classOpen);
    overflow.classList.remove('scroll-hidden');
  }
  var closedModal = modal.querySelector(buttonClosed);
  closedModal.addEventListener('click', function (evt) {
    evt.preventDefault();
    modal.classList.remove(classOpen);
    overflow.classList.remove('scroll-hidden');
    modal.classList.add(classClosed);
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      modal.classList.remove(classOpen);
      overflow.classList.remove('scroll-hidden');
      modal.classList.add(classClosed);
    }
  });
  if (!!window.MSInputMethodContext && !!document.documentMode) {
    true;
  } else {
    document.addEventListener('click', function (evt) {
      if (evt.target.matches(overlay)) {
        modal.classList.remove(classOpen);
        overflow.classList.remove('scroll-hidden');
        modal.classList.add(classClosed);
      }
    });
  }
  if (buttonOk != null) {
    var closedOk = modal.querySelector(buttonOk);
    closedOk.addEventListener('click', function (evt) {
      evt.preventDefault();
      modal.classList.remove(classOpen);
      overflow.classList.remove('scroll-hidden');
      modal.classList.add(classClosed);
      window.location.reload();
    });
  }
}

var removeModal = function () {
  var overflow = document.querySelector('body');
  var modal = document.querySelector('.modal');
  if (modal.classList.contains('modal__open')) {
    modal.classList.remove('modal__open');
    modal.classList.add('modal__closed');
    overflow.classList.remove('scroll-hidden');
  }
}

var openModal = document.querySelector('.page-header__button');
openModal.addEventListener('click', function (evt) {
  evt.preventDefault();
  renderModal('.modal', 'modal__closed', 'modal__open', '.modal__overlay', '.modal__close');

  var form = document.querySelector('.modal__form');
  var inputName = document.querySelector('.form__input--name-modal');
  var inputPhone = document.querySelector('.form__input--phone-modal');

  if (!!window.MSInputMethodContext && !!document.documentMode) {
    true;
  } else {
    inputName.value = localStorage.getItem('inputName');
    inputPhone.value = addMask(removeMask(localStorage.getItem('inputPhone')));
  }

  validationName(inputName);
  validationPhone(inputPhone);

  form.addEventListener('submit', function (evt) {
    if (inputPhone.value.length != 16) {
      evt.preventDefault();
      inputPhone.focus();
      inputPhone.style.borderColor = 'red';
    } else {
      evt.preventDefault();
      renderModal('.success', 'success__closed', 'success__open', '.success__overlay', '.success__close', '.success__ok');
    }
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      form.reset();
    } else {
      localStorage.setItem('inputName', '');
      localStorage.setItem('inputPhone', '');
      form.reset();
    }
    removeModal();
  });
});

//Табы в блоке Программы

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

//Аккордеон блок Частые вопросы

var accordions = document.getElementsByClassName("accordion");
var open = document.getElementsByClassName('accordion-open');
for (var i = 0; i < accordions.length; i++) {
  accordions[i].onclick = function() {
    if (open.length > 0 && open[0] !== this)
      open[0].classList.remove('accordion-open');
      this.classList.toggle('accordion-open');
  }
}

//Слайдер блок Отзывы

document.addEventListener('DOMContentLoaded', function () {
  var active = 0, prev = 0;
  var slides = document.getElementsByClassName('comments__slide');
  var arrows = document.getElementsByClassName('comments__button');
  var amount = document.querySelector('.comments__amount');
  var count = document.querySelector('.comments__count');

  amount.textContent = slides.length;

  for(var i=0; i<arrows.length; i++) {
    arrows[i].addEventListener('click', function(e) {
      prev = active;
      if(!!~e.target.classList[1].indexOf('left')) {
        active-1 >= 0 ? --active : active = slides.length-1;
      } else {
        active+1 <= slides.length-1 ? ++active : active = 0;
      }
      changeActiveSlide(prev);
      count.textContent = active+1;
    });
  }

  var changeActiveSlide = function(prev) {
    slides[prev].classList.remove('show');
    slides[active].classList.add('show');
  }
});

//Валидация полей формы

var validationName = function (inputName) {
  if (!!window.MSInputMethodContext && !!document.documentMode) {
    true;
  } else {
    inputName.oninput = function () {
      localStorage.setItem('inputName', inputName.value);
    }
  }
  inputName.addEventListener('invalid', function (evt) {
    if (inputName.validity.tooShort) {
      inputName.setCustomValidity('Имя должно быть не менее 3-х символов');
    } else if (inputName.validity.tooLong) {
      inputName.setCustomValidity('Имя не должно быть больше 20-ти символов');
    } else if (inputName.validity.valueMissing) {
      inputName.setCustomValidity('Поле обязательно для заполнения');
    } else {
      inputName.setCustomValidity('');
    }
  });
  inputName.onblur = function () {
    inputName.style.borderColor = '#484848';
  }
}

var removeMask = function (input) {
  if (input == null || input == '') {
    return '';
  }
  if (input.substring(0, 4) == '+7(') {
    input = input.substring(4);
  }
  var res = '';
  for (var i = 0; i < input.length; i++) {
    if (input[i] >= '0' && input[i] <= '9') {
      res += input[i];
    }
  }
  return res;
}

var addMask = function (input) {
  var mask = ['+', '7',  '(', ' ', ' ', ' ', ')',  ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' '];
  var k = 0;
  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < mask.length; j++) {
      if (mask[j] == ' ') {
        mask[j] = input[i];
        k = j;
        break;
      }
    }
  }
  return k == 0 ? '' : mask.join('').substring(0, k+1);
}

var validationPhone = function (inputPhone) {
  inputPhone.onfocus = function () {
    if (inputPhone.value == '') {
      inputPhone.value = '+7(923)41';
    }
  }
  inputPhone.oninput = function () {
    inputPhone.value = addMask(removeMask(inputPhone.value));
    inputPhone.style.borderColor = '#484848';
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      true;
    } else {
      localStorage.setItem('inputPhone', removeMask(inputPhone.value));
    }
  }
}

//Валидация формы в футере

var form = document.querySelector('.form');
var inputName = document.querySelector('.form__input--name');
var inputPhone = document.querySelector('.form__input--phone');

if (!!window.MSInputMethodContext && !!document.documentMode) {
  true;
} else {
  inputName.value = localStorage.getItem('inputName');
  inputPhone.value = addMask(removeMask(localStorage.getItem('inputPhone')));
}

validationName(inputName);
validationPhone(inputPhone);

form.addEventListener('submit', function (evt) {
  if (inputPhone.value.length != 16) {
    evt.preventDefault();
    inputPhone.focus();
    inputPhone.style.borderColor = 'red';
  } else {
    evt.preventDefault();
    renderModal('.success', 'success__closed', 'success__open', '.success__overlay', '.success__close', '.success__ok');
  }
  if (!!window.MSInputMethodContext && !!document.documentMode) {
    form.reset();
  } else {
    localStorage.setItem('inputName', '');
    localStorage.setItem('inputPhone', '');
    form.reset();
  }
});

//Валидация формы Хочу поехать


document.addEventListener('DOMContentLoaded', function() {
  var callback = document.querySelector('.callback__form');
  var inputPhone = document.querySelector('.callback__input');

  validationPhone(inputPhone);

  callback.addEventListener('submit', function (evt) {
    if (inputPhone.value.length != 16) {
      evt.preventDefault();
      inputPhone.focus();
      inputPhone.style.borderColor = 'red';
    } else {
      evt.preventDefault();
      renderModal('.success', 'success__closed', 'success__open', '.success__overlay', '.success__close', '.success__ok');
    }
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      callback.reset();
    } else {
      localStorage.setItem('inputPhone', '');
      callback.reset();
    }
  });
});

//Слайдер блок Жизнь в Израиле

document.addEventListener('DOMContentLoaded', function() {
  var active = 0, prev = 0;
  var slides = document.getElementsByClassName('advantages__unit');
  var navs = document.getElementsByClassName('advantages__dot');
  for(var i=0; i<navs.length; i++) {
    (function(i) {
      navs[i].addEventListener('click', function() {
        prev = active;
        active = i;
        changeActiveSlide(prev);
      });
    })
  (i);
  }

  var changeActiveSlide = function(prev) {

    slides[prev].classList.remove('show');
    slides[active].classList.add('show');

    navs[prev].classList.remove('show-dot');
    navs[active].classList.add('show-dot');
  }
});
