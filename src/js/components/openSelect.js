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