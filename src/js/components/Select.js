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

  //=include init.js
  //=include clickHandler.js
  //=include keyHandler.js
  //=include openSelect.js
  //=include closeSelect.js
  //=include dispatchEvent.js

  return Select;
});