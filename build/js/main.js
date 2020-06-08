'use strict';

// Попап форма

var ESC_KEYCODE = 27;
var renderModal = function (classPopup, classClosed, classOpen, overlay, buttonClosed, buttonOk) {
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

  document.addEventListener('click', function (evt) {
    if (evt.target.matches(overlay)) {
      modal.classList.remove(classOpen);
      overflow.classList.remove('scroll-hidden');
      modal.classList.add(classClosed);
    }
  });

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
};

var removeModal = function () {
  var overflow = document.querySelector('body');
  var modal = document.querySelector('.modal');
  if (modal.classList.contains('modal__open')) {
    modal.classList.remove('modal__open');
    modal.classList.add('modal__closed');
    overflow.classList.remove('scroll-hidden');
  }
};

var openModal = document.querySelector('.page-header__button');
openModal.addEventListener('click', function (evt) {
  evt.preventDefault();
  renderModal('.modal', 'modal__closed', 'modal__open', '.modal__overlay', '.modal__close');

  var form = document.querySelector('.modal__form');
  var inputName = document.querySelector('.form__input--name-modal');
  var inputPhone = document.querySelector('.form__input--phone-modal');

  inputName.value = localStorage.getItem('inputName');
  inputPhone.value = addMask(removeMask(localStorage.getItem('inputPhone')));

  validationName(inputName);
  validationPhone(inputPhone);

  form.addEventListener('submit', function (event) {
    if (inputPhone.value.length !== 16) {
      event.preventDefault();
      inputPhone.focus();
      inputPhone.style.borderColor = 'red';
    } else {
      event.preventDefault();
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

// Табы в блоке Программы

var tabs = document.querySelectorAll('.tabs__title');

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var id = this.getAttribute('data-item');
    var content = document.querySelector('.tabs__item[data-item="' + id + '"]');
    var activeTab = document.querySelector('.tabs__title.is-active');
    var activeContent = document.querySelector('.tabs__item.is-active');

    activeTab.classList.remove('is-active');
    tab.classList.add('is-active');

    activeContent.classList.remove('is-active');
    content.classList.add('is-active');
  });
});

// Аккордеон блок Частые вопросы

var accordions = document.getElementsByClassName('accordion');
var open = document.getElementsByClassName('accordion-open');
for (var i = 0; i < accordions.length; i++) {
  accordions[i].onclick = function () {
    if (open.length > 0 && open[0] !== this) {
      open[0].classList.remove('accordion-open');
    }
    this.classList.toggle('accordion-open');
  };
}

// Слайдер блок Отзывы

document.addEventListener('DOMContentLoaded', function () {
  var active = 0;
  var early = 0;
  var slides = document.getElementsByClassName('comments__slide');
  var arrows = document.getElementsByClassName('comments__button');
  var amount = document.querySelector('.comments__amount');
  var count = document.querySelector('.comments__count');

  amount.textContent = slides.length;

  for (var n = 0; n < arrows.length; n++) {
    arrows[n].addEventListener('click', function (e) {
      early = active;
      if (!!~e.target.classList[1].indexOf('left')) {
        active - 1 >= 0 ? --active : active = slides.length - 1;
      } else {
        active + 1 <= slides.length - 1 ? ++active : active = 0;
      }
      changeActiveSlide(early);
      count.textContent = active + 1;
    });
  }

  var changeActiveSlide = function (before) {
    slides[before].classList.remove('show');
    slides[active].classList.add('show');
  };
});

// Валидация полей формы

var validationName = function (inputName) {
  inputName.oninput = function () {
    localStorage.setItem('inputName', inputName.value);
  };

  inputName.addEventListener('invalid', function () {
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
  };
};

var removeMask = function (input) {
  if (input === null || input === '') {
    return '';
  }
  if (input.substring(0, 3) === '+7(') {
    input = input.substring(3);
  }
  var res = '';
  for (var l = 0; l < input.length; l++) {
    if (input[l] >= '0' && input[l] <= '9') {
      res += input[l];
    }
  }
  return res;
};

var addMask = function (input) {
  var mask = ['+', '7', '(', ' ', ' ', ' ', ')', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' '];
  var k = 0;
  for (var m = 0; m < input.length; m++) {
    for (var j = 0; j < mask.length; j++) {
      if (mask[j] === ' ') {
        mask[j] = input[m];
        k = j;
        break;
      }
    }
  }
  return k === 0 ? '' : mask.join('').substring(0, k + 1);
};

var validationPhone = function (inputPhone) {
  inputPhone.onfocus = function () {
    inputPhone.placeholder = '+7(932)421';
    if (inputPhone.value === '') {
      inputPhone.value = '+7(';
    }
  };
  inputPhone.oninput = function () {
    inputPhone.value = addMask(removeMask(inputPhone.value));
    inputPhone.style.borderColor = '#484848';
    localStorage.setItem('inputPhone', removeMask(inputPhone.value));
  };
};

// Валидация формы в футере

var form = document.querySelector('.form');
var inputName = document.querySelector('.form__input--name');
var inputPhone = document.querySelector('.form__input--phone');

inputName.value = localStorage.getItem('inputName');
inputPhone.value = addMask(removeMask(localStorage.getItem('inputPhone')));

validationName(inputName);
validationPhone(inputPhone);

form.addEventListener('submit', function (evt) {
  if (inputPhone.value.length !== 16) {
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

// Валидация формы Хочу поехать


document.addEventListener('DOMContentLoaded', function () {
  var callback = document.querySelector('.callback__form');
  var inputTel = document.querySelector('.callback__input');

  validationPhone(inputTel);

  callback.addEventListener('submit', function (evt) {
    if (inputTel.value.length !== 16) {
      evt.preventDefault();
      inputTel.focus();
      inputTel.style.borderColor = 'red';
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

// Слайдер блок Жизнь в Израиле

document.addEventListener('DOMContentLoaded', function () {
  var active = 0;
  var prev = 0;
  var slides = document.getElementsByClassName('advantages__unit');
  var navs = document.getElementsByClassName('advantages__dot');
  for (var j = 0; j < navs.length; j++) {
    (function (k) {
      navs[k].addEventListener('click', function () {
        prev = active;
        active = k;
        changeActiveSlide(prev);
      });
    })(j);
  }

  var changeActiveSlide = function (before) {

    slides[before].classList.remove('show');
    slides[active].classList.add('show');

    navs[before].classList.remove('show-dot');
    navs[active].classList.add('show-dot');
  };
});

// Ссылка в option select

document.querySelector('select').onchange = function(){
  window.location = this.value
}
