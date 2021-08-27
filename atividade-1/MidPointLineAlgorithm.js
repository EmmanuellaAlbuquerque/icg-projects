let color_buffer = new Canvas("canvas");
color_buffer.clear();

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {

  color_buffer.putPixel(x0, x1, color_0);
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {

}

MidPointLineAlgorithm(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
DrawTriangle();
