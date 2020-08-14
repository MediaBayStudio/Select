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