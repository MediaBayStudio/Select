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