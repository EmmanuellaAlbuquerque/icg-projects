let color_buffer = new Canvas("canvas");
color_buffer.clear();

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {

  var dx = x1 - x0;
  var dy = y1 - y0;
  var d = 2 * dy - dx;
  var incrE = 2 * dy;
  var incrNE = 2 * (dy - dx);
  var x = x0;
  var y = y0;

  color_buffer.putPixel(x, y, color_0);

  while (x < x1) {
    x++;
    if (d <= 0) {
      d += incrE;
    }
    else {
      d += incrNE;
      y++;
    }
    color_buffer.putPixel(x, y, color_0);
  }

}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
  MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1);
  MidPointLineAlgorithm(x1, y1, x2, y2, color_0, color_1);
  MidPointLineAlgorithm(x2, y2, x0, y0, color_0, color_1);
}

// MidPointLineAlgorithm(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
DrawTriangle(25, 30, 50, 100, 100, 15, [255, 0, 0, 255], [0, 0, 255, 255], [0, 255, 0, 255])
