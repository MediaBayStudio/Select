Select.prototype.openSelect = function() {
  let _ = this;

  if (!_.opened) {
    _.dispatchEvent(_.$select, 'open', _.selectedIndex);
    _.$wrapper.classList.add('active');
    _.opened = true;
  }
};