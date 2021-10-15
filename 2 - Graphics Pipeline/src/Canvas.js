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
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }

  setWidth(width) {
    return this.canvas.width = width;
  }

  setHeight(height) {
    return this.canvas.height = height;
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

      console.log("x:", Math.floor(x), "& y:", Math.floor(y));
    }, false);
  }

  /**
   * Get the linear color interpolation
   * @param {Array} color_0 - the initial color
   * @param {Array} color_1 - the final color
   * @param {int} delta - dx or dy variation
   * @returns Object
   */
  getDeltaColors(color_0, color_1, delta) {

    var deltaColors = {
      dRed: (color_1[0] - color_0[0]) / delta,
      dGreen: (color_1[1] - color_0[1]) / delta,
      dBlue: (color_1[2] - color_0[2]) / delta
    }

    return deltaColors;
  }

  randomRGBA() {
    return Math.round(Math.random() * 255);
  }

  getNewColor() {
    return [this.randomRGBA(),
      this.randomRGBA(), this.randomRGBA(), this.randomRGBA()];
  }

  MidPointXdiff(x0, y0, x1, y1, color_0, color_1) {

    var x = x0;
    var y = y0;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var y_incr = 1;
    var new_color = [...color_0];

    if (dy < 0) {
      y_incr = -1;
      dy = Math.abs(dy);
    }

    var d = (2 * dy) - dx;

    var { dRed, dGreen, dBlue } = this.getDeltaColors(color_0, color_1, dx);

    this.putPixel(x, y, new_color);

    while (x < x1) {
      x++;

      if (d <= 0) {
        d += 2 * dy;
      }
      else {
        y += y_incr;
        d += 2 * (dy - dx);
      }

      new_color[0] += dRed;
      new_color[1] += dGreen;
      new_color[2] += dBlue;

      this.putPixel(x, y, new_color);
    }

  }

  MidPointYdiff(x0, y0, x1, y1, color_0, color_1) {

    var x = x0;
    var y = y0;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var x_incr = 1;
    var new_color = [...color_0]

    if (dx < 0) {
      x_incr = -1;
      dx = Math.abs(dx);
    }

    var d = (2 * dx) - dy;

    var { dRed, dGreen, dBlue } = this.getDeltaColors(color_0, color_1, dy);

    this.putPixel(x, y, new_color);

    while (y < y1) {
      y++;

      if (d <= 0) {
        d += 2 * dx;
      }
      else {
        x += x_incr;
        d += 2 * (dx - dy);
      }

      new_color[0] += dRed;
      new_color[1] += dGreen;
      new_color[2] += dBlue;

      this.putPixel(x, y, new_color);
    }
  }

  drawLine(x0, y0, x1, y1, color_0, color_1) {

    var dx = x1 - x0;
    var dy = y1 - y0;

    if (Math.abs(dy) < Math.abs(dx)) {

      if (x0 > x1) {
        this.MidPointXdiff(x1, y1, x0, y0, color_1, color_0);
      }
      else { // x1 > x0 - normal case
        this.MidPointXdiff(x0, y0, x1, y1, color_0, color_1);
      }
    }
    else {

      if (y0 > y1) {
        this.MidPointYdiff(x1, y1, x0, y0, color_1, color_0);
      }
      else { // y1 > y0 - normal case
        this.MidPointYdiff(x0, y0, x1, y1, color_0, color_1);
      }

    }
  }

  /**
   * Tool for testing purposes.
   */
  DrawLightPortrait(increment) {
    this.clear()
    var canvasWidth = this.getWidth();
    var canvasHeight = this.getHeight();

    var xi = canvasWidth/2;
    var yi = canvasHeight/2;
    var minX = 0;
    var maxX = canvasWidth;
    var minY = 0;
    var maxY = canvasHeight;
    var incr = increment || 10;
  
    for (var xf = 0; xf < canvasWidth; xf += incr) {
      this.drawLine(xi, yi, xf, maxY, [255, 0, 0, 255], [255, 255, 0, 255]);
      this.drawLine(xi, yi, xf, minY, [255, 0, 0, 255], [255, 255, 0, 255]);
    }
  
    for (var yf = 0; yf < canvasHeight; yf += incr) {
      this.drawLine(xi, yi, minX, yf, [255, 0, 0, 255], [255, 255, 0, 255]);
      this.drawLine(xi, yi, maxX, yf, [255, 0, 0, 255], [255, 255, 0, 255]);
    }
  }
}
