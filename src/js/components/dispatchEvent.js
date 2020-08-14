Select.prototype.dispatchEvent = function(element, eventName) {
  if (typeof window.CustomEvent === "function") {
    let evt = new CustomEvent(eventName);
    element.dispatchEvent(evt);
    // console.log(eventName);
  }
};