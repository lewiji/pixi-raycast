var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
    if (event.keyCode == this.LEFT || 
        event.keyCode == this.UP || 
        event.keyCode == this.RIGHT || 
        event.keyCode == this.DOWN ||
        event.keyCode == this.SPACE) {
      event.preventDefault();
    }
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

module.exports = Key;