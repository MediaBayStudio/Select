Select.prototype.closeSelect = function(e) {
  let _ = this;

  if (_.opened) {
    _.dispatchEvent(_.$select, 'close');
    _.$wrapper.classList.remove('active');
    _.opened = false;
  }
};