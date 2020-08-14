Select.prototype.init = function() {
  let _ = this,
    options = _.options,
    wrapperClass = options.wrapperClass,
    q = function(selector, element) {
      element = element || document.body;
      return element.querySelector(selector);
    },
    createElement = function(tag) {
      return document.createElement(tag);
    },
    buttonClass = options.buttonClass;


  _.$select = q(_.selector);

  _.$options = _.$select.options;
  _.multiple = _.$select.hasAttribute('multiple');
  _.size = _.$select.getAttribute('size') || 1;

  _.$wrapper = createElement(options.wrapperTag);
  _.$button = createElement('button');
  _.$list = createElement(options.listTag);

  // _.$button.setAttribute('tabindex', '0')
  _.$button.setAttribute('type', 'button');
  _.$wrapper.appendChild(_.$button);

  if (_.multiple) {
    _.selectedIndex = [];
    _.$selectedItems = [];
    _.selectedIndex = [];
  }

  // создаем элементы списка
  // значение с атрибутом selected пропускаем
  for (let i = 0, j = 0; i < _.$options.length; i++) {
    let option = _.$options[i];

    if (_.multiple && option.hasAttribute('disabled') || !_.multiple && option.selected) {
      _.hint = option.label || option.textContent;
      continue;
    } else {
      let item = createElement(options.listItemTag),
        itemClassName = option.className;

      if (itemClassName) {
        item.classList.add(itemClassName);
      }

      if (_.multiple && option.selected) {
        item.classList.add('selected');
      }

      item.innerHTML = option.label || option.textContent;
      item.dataset.value = option.value;
      // item.setAttribute('tabindex', '0');

      _.$listItems[j] = item;
      _.$list.appendChild(item);
      j++;
    }   
  }

  _.$button.textContent = _.hint;
  _.$button.dataset.hint = _.hint;

  if (wrapperClass) {
    _.$wrapper.classList.add(wrapperClass);
  }

  if (buttonClass) {
    _.$button.classList.add(buttonClass);
  }

  options.copyAttributes.forEach(function(attr) {
    if (_.$select.hasAttribute(attr)) {
      _.$list.setAttribute(attr, _.$select.getAttribute(attr));
    }
  });

  _.listClassName = _.$list.classList[0];
  _.listSelector = options.listTag + '.' + _.listClassName;

  let listHTML = _.$list.outerHTML;

  if (typeof options.setListTemplate === 'function') {
    _.listTemplate = options.setListTemplate(_.$list.outerHTML);
  } else {
    _.listTemplate = _.$list.outerHTML;
  }

  _.$wrapper.insertAdjacentHTML('beforeend', _.listTemplate);
  _.$select.insertAdjacentElement('beforebegin', _.$wrapper);
  _.$wrapper.insertAdjacentElement('beforeend', _.$select);
  _.$select.style.display = 'none';
  

  _.$list = q(_.listSelector, _.$wrapper);
  _.$listItems = _.$list.children;

  _.$wrapper.addEventListener('click', _.clickHandler);
  document.addEventListener('click', _.clickHandler);
  document.addEventListener('keydown', _.keyHandler);


};