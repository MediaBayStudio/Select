;(function(func) {
  window.Select = func();
})(function() {
  
  Select = (function() {
    return function(selector, options) {
      let _ = this,
        defaults = {
          openOnHover: false,
          openOnClick: true,
          escToClose: true,
          outsideClickToClose: true,
          scrollToClose: true,
          closeIfAllSelected: true,
          titleTag: 'span',
          listTag: 'ul',
          wrapperTag: 'div',
          listItemTag: 'li',
          wrapperClass: '',
          titleClass: '',
          setListTemplate: null,
          copyAttributes: ['class']
        },
      assign = function(inserted, obj) {
        for (let key in inserted) {
          if (obj[key] === undefined) {
            obj[key] = inserted[key];
          } else if (typeof obj[key] === 'object') {
            assign(inserted[key], obj[key]);
          }
        }
      };

      _.options = options || {};

      

      _.selector = selector;
      _.hint = '';
      _.value = '';
      _.listTemplate = '';
      _.multiple = false;
      _.size = 1;
      _.opened = false;
      _.selectedIndex = -1; // или массив
      _.lastSelectedIndex = -1;
      // _.focusedIndex = -1;
      // _.lastFocusedIndex = -1;

      _.focusedIndex = 0;
      _.lastFocusedIndex = 0;

      _.$select = null;
      _.$options = null;
      _.$wrapper = null;
      _.$button = null;
      _.$list = null;
      _.$listItems = [];
      _.$lastSelectedItem = null;
      _.$selectedItems = null;

       _.openSelectHandler = _.openSelect.bind(_);
       _.closeSelectHandler = _.closeSelect.bind(_);
       _.clickHandler = _.clickHandler.bind(_);
       _.keyHandler = _.keyHandler.bind(_);
       _.isListItem = function(elem, counter) {
        // ограничим проверку глубины вложенности на 4 элемента
        counter = counter ||  0;
        if (elem === null || counter === 3) {
          return false;
        }
        if (elem.dataset.value && elem.tagName === options.listItemTag.toUpperCase()) {
          return elem;
        } else {
          counter++;
          return _.isListItem(elem.parentElement, counter);
        }
      };
      _.isButton = function(elem, counter) {
        // ограничим проверку глубины вложенности на 4 элемента
        counter = counter ||  0;
        if (elem === null || counter === 3) {
          return false;
        }
        if (elem.dataset.hint && elem.tagName === 'BUTTON') {
          return elem;
        } else {
          counter++;
          return _.isButton(elem.parentElement, counter);
        }
      };
      _.getListItemIndex = function(items, item) {
        for (let i = 0; i < items.length; i++) {
          if (item === items[i]) {
            return i;
          } 
        }
        return -1;
      };

      assign(defaults, _.options);

      _.init();

      return _.$select;
    }
  })();

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
  Select.prototype.clickHandler = function(e) {
    let _ = this,
      options = _.options,
      eventTarget = e.target,
      listItems = _.$listItems,
      button = _.isButton(eventTarget);
      listItem = _.isListItem(eventTarget);
  
    if (event.currentTarget === document) {
      /*
        Берем цель клика и ищем в ней селектор нашего блока.
        Если блок найден, значит нужно закрыть окно,
        т.к. клик очевидно произошел на родителе блока
      */
      let selector = _.options.wrapperClass || _.listClassName,
        block = eventTarget.querySelector('.' + selector);
  
      if (block) {
        // console.log('close');
        _.closeSelect(_);
      }
    } else {
      // проверяем на button или list item
      if (button) {
        eventTarget = button;
        if (_.opened) {
          _.closeSelect(_);
        } else {
          _.openSelect(_);
        }
      } else if (listItem) {
        eventTarget = listItem;
        if (_.multiple) {
          // клик по элементу "выбрать все"
          if (eventTarget.dataset.value === 'all') {
            _.$selectedItems = [];
            _.selectedIndex = [];
            _.lastSelectedIndex = -1;
            for (let i = 0; i < listItems.length; i++) {
              listItems[i].classList.remove('selected');
              if (eventTarget !== listItems[i]) {
                _.$selectedItems.push(listItems[i]);
                _.selectedIndex.push(i);
              }
            }
            if (options.closeIfAllSelected) {
              // console.log('close');
              _.closeSelect(_);
            }
          } else {
            // клик по любому другому элементу
              // снять выделение и прервать функцию
            if (eventTarget.classList.contains('selected')) {
              eventTarget.classList.remove('selected');
              // найти и удалить элемент из массива
              let elementIndex = _.$selectedItems.indexOf(eventTarget);
              if (elementIndex !== -1) {
                _.$selectedItems.splice(elementIndex, 1);
                _.selectedIndex.splice(elementIndex, 1);
              }
              return;
            } else {
              // подсчет количества выбранных элементов
              let selectedCounter = 0;
              for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].classList.contains('selected')) {
                  selectedCounter++;
                }
                if (listItems[i].dataset.value === 'all' && listItems[i].classList.contains('selected')) {
                  listItems[i].classList.remove('selected');
                  _.$selectedItems = [];
                  _.selectedIndex = [];
                }
                if (listItems[i] === eventTarget) {
                   _.lastSelectedIndex = i;
                }
              }
              _.selectedIndex.push(_.lastSelectedIndex);
              _.$selectedItems.push(eventTarget);
              
              if (options.closeIfAllSelected && selectedCounter === _.$listItems.length - 2) {
                // console.log('close');
                _.closeSelect(_);
              }
            }
          }
          
        } else {
          // простой одиночный выбор
          for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove('selected');
          }
          _.$selectedItems = eventTarget;
          // console.log('close');
          _.closeSelect(_);
          _.lastSelectedIndex = _.selectedIndex;
          _.selectedIndex = _.getListItemIndex(listItems, eventTarget);
        }
  
        eventTarget.classList.add('selected');
      }
    }
  };
  Select.prototype.keyHandler = function() {
    let _ = this,
      keyCode = event.keyCode;
  
    if (_.opened) {
      if (keyCode === 27) {
        _.closeSelect(_);
      }
    }
  };
  Select.prototype.openSelect = function() {
    let _ = this;
  
    if (!_.opened) {
  
      _.dispatchEvent(_.$select, 'open', _.selectedIndex);
  
      _.$wrapper.classList.add('active');
  
      _.opened = true;
      // _.focusedIndex = _.lastSelectedIndex || -1;
      // _.lastFocusedIndex = _.focusedIndex - 1 || -1;
  
    }
  
    
  };
  Select.prototype.closeSelect = function(e) {
    let _ = this,
      eventType = e.type,
      eventTarget = e.target,
      eventCurrentTarget = e.currentTarget,
      listItems = _.$listItems;
  
    if (_.opened) {
      _.dispatchEvent(_.$select, 'close');
      _.$wrapper.classList.remove('active');
      _.$wrapper.removeEventListener('click', _.closeSelectHandler);
      _.opened = false;
      console.log(_);
    }
  };
  Select.prototype.dispatchEvent = function(element, eventName) {
    if (typeof window.CustomEvent === "function") {
      let evt = new CustomEvent(eventName);
      element.dispatchEvent(evt);
      // console.log(eventName);
    }
  };

  return Select;
});