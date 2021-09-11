let color_buffer = new Canvas("canvas");
let canvasXCenter = color_buffer.getWidth() / 2;
let canvasYCenter = color_buffer.getHeight() / 2;

color_buffer.clear();

/**
 * Get the linear color interpolation
 * @param {Array} color_0 - the initial color
 * @param {Array} color_1 - the final color
 * @param {int} delta - dx or dy variation
 * @returns Object
 */
function getDeltaColors(color_0, color_1, delta) {

  var deltaColors = {
    dRed: (color_1[0] - color_0[0]) / delta,
    dGreen: (color_1[1] - color_0[1]) / delta,
    dBlue: (color_1[2] - color_0[2]) / delta
  }

  return deltaColors;
}

function MidPointXdiff(x0, y0, x1, y1, color_0, color_1) {

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

  var { dRed, dGreen, dBlue } = getDeltaColors(color_0, color_1, dx);

  color_buffer.putPixel(x, y, new_color);

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

    color_buffer.putPixel(x, y, new_color);
  }

}

function MidPointYdiff(x0, y0, x1, y1, color_0, color_1) {

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

  var { dRed, dGreen, dBlue } = getDeltaColors(color_0, color_1, dy);

  color_buffer.putPixel(x, y, new_color);

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

    color_buffer.putPixel(x, y, new_color);
  }
}

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {

  var dx = x1 - x0;
  var dy = y1 - y0;

  if (Math.abs(dy) < Math.abs(dx)) {

    if (x0 > x1) {
      MidPointXdiff(x1, y1, x0, y0, color_0, color_1);
    }
    else { // x1 > x0 - normal case
      MidPointXdiff(x0, y0, x1, y1, color_0, color_1);
    }
  }
  else {

    if (y0 > y1) {
      MidPointYdiff(x1, y1, x0, y0, color_0, color_1);
    }
    else { // y1 > y0 - normal case
      MidPointYdiff(x0, y0, x1, y1, color_0, color_1);
    }

  }
}

function randomRGBA() {
  return Math.round(Math.random() * 255);
}

function getNewColor() {
  return [randomRGBA(),
  randomRGBA(), randomRGBA(), randomRGBA()];
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
  MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1);
  MidPointLineAlgorithm(x1, y1, x2, y2, color_2, color_1);
  MidPointLineAlgorithm(x2, y2, x0, y0, color_0, color_2);
}

// ------------------------------------------------- USAGE EXAMPLES --------------------------------------------------
function DrawLinePortrait() {
  color_buffer.clear();
  MidPointLineAlgorithm(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
}

function DrawTrianglePortrait() {
  color_buffer.clear();
  DrawTriangle(25, 30, 50, 100, 100, 15, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);
}

function DrawLightPortrait(increment) {
  color_buffer.clear();
  var xi = canvasXCenter;
  var yi = canvasYCenter;
  var minX = 0;
  var maxX = color_buffer.getWidth();
  var minY = 0;
  var maxY = color_buffer.getHeight();
  var incr = increment || 10;

  for (var xf = 0; xf < color_buffer.getWidth(); xf += incr) {
    MidPointLineAlgorithm(xi, yi, xf, maxY, getNewColor(), getNewColor());
    MidPointLineAlgorithm(xi, yi, xf, minY, getNewColor(), getNewColor());
  }

  for (var yf = 0; yf < color_buffer.getHeight(); yf += incr) {
    MidPointLineAlgorithm(xi, yi, minX, yf, getNewColor(), getNewColor());
    MidPointLineAlgorithm(xi, yi, maxX, yf, getNewColor(), getNewColor());
  }
}

function DrawFullLightPortrait() {
  DrawLightPortrait(3);
}

function DrawFreeThemePortrait() {
  color_buffer.clear();

  // x rectangle kite
  MidPointLineAlgorithm(64, 30, 88, 64, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(64, 30, 100, 30, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(100, 30, 57, 70, [255, 0, 0, 255], [255, 255, 0, 255]);

  MidPointLineAlgorithm(57, 70, 64, 30, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(88, 65, 57, 70, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(88, 65, 100, 30, [255, 0, 0, 255], [255, 255, 0, 255]);

  // kite line
  MidPointLineAlgorithm(100, 30, 106, 28, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(106, 28, 103, 21, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(103, 21, 112, 18, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(112, 18, 111, 10, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(111, 10, 117, 6, [255, 0, 0, 255], [255, 255, 0, 255]);
  MidPointLineAlgorithm(117, 6, 127, 0, [255, 0, 0, 255], [255, 255, 0, 255]);

  // diamond kite
  DrawTriangle(14, 72, 26, 54, 11, 52, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);

  DrawTriangle(26, 94, 39, 72, 45, 93, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);
  DrawTriangle(26, 94, 14, 72, 10, 93, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);
  DrawTriangle(39, 72, 26, 54, 44, 51, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);

  DrawTriangle(14, 72, 39, 72, 26, 94, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);
  DrawTriangle(14, 72, 39, 72, 26, 54, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255]);

  // kite line
  MidPointLineAlgorithm(26, 54, 30, 46, [255, 0, 0, 255], [0, 0, 255, 255]);
  MidPointLineAlgorithm(30, 46, 26, 41, [255, 0, 0, 255], [0, 0, 255, 255]);
  MidPointLineAlgorithm(26, 41, 29, 37, [255, 0, 0, 255], [0, 0, 255, 255]);
  MidPointLineAlgorithm(29, 37, 25, 34, [255, 0, 0, 255], [0, 0, 255, 255]);
  MidPointLineAlgorithm(25, 34, 30, 29, [255, 0, 0, 255], [0, 0, 255, 255]);
  MidPointLineAlgorithm(30, 29, 43, 0, [255, 0, 0, 255], [0, 0, 255, 255]);

  // little sun
  for (var i = 2; i < 23; i += 5) {
    for (var j = 107; j < color_buffer.getHeight(); j += 5) {
      MidPointLineAlgorithm(0, 126, i, j, [255, 255, 0, 255], [255, 255, 0, 255]);
    }
  }
}

MidPointLineAlgorithm(61, 120, 61, 29, [153, 51, 0, 0], [122, 41, 122, 0]);
DrawTriangle(9, 29, 113, 29, 61, 121, [153, 51, 0, 0], [122, 41, 122, 0], [153, 51, 0, 0]);
