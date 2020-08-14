Select.prototype.keyHandler = function() {
  let _ = this,
    keyCode = event.keyCode;

  if (_.opened) {
    if (keyCode === 27) {
      _.closeSelect(_);
    }
  }
};