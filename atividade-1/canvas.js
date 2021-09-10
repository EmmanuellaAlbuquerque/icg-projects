class Canvas {
  constructor(canvas_id) {
    this.canvas = document.getElementById(canvas_id);
    this.context = this.canvas.getContext("2d");
    this.clear_color = 'rgba(0,0,0,255)';
    this.showMousePosition();
  }

  clear() {
    this.context.fillStyle = this.clear_color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  putPixel(x, y, color) {
    this.context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    this.context.fillRect(x, (this.canvas.height - 1) - y, 1, 1);
  }

  getWidth() {
    return this.canvas.height;
  }

  getHeight() {
    return this.canvas.width;
  }

  /**
   * Useful tool to find the mouse position 
   * on the canvas and help creating drawings.
   */
  showMousePosition() {
    this.canvas.addEventListener('click', function (event) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;

      var x = (event.clientX - rect.left) * scaleX;
      var y = Math.abs(((event.clientY - rect.top) * scaleY) - canvas.height);

      console.log(Math.floor(x), Math.floor(y));
    }, false);
  }
}
