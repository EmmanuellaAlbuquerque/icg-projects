// Baseball Bat Script (pov)

#include "colors.inc"

camera {
  location <1, 1, -40>
  look_at <1, 1, 0>
  angle 15
}

light_source {
  <20, 13, -60>, White
  shadowless
}

sky_sphere {
  pigment {
    gradient y
    color_map {
      [0 color White]
      [1 color Blue]
    }

    scale 2
    translate <0, 1, 0>
  }
}

// /* =-=-==-=-= FIRST STEP =-=-==-=-= */
// Definindo os pontos
sphere {
  <-2, -2, 0>, .2
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}

sphere {
  <-1, -1, 0>, .2
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}

sphere {
  <1, 1, 0>, .6
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}

sphere {
  <3, 3, 0>, .6
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}

sphere {
  <4, 1.5, 0>, .6
  pigment { White }
  finish { ambient .4} // define light to sphere between 0, 1
}

/* =-=-==-=-= SECOND STEP =-=-==-=-= */
sphere_sweep {
  linear_spline // linear(straight) path
  // cubic_spline // linear(straight) path
  4, // positions

  <-2, -2, 0>, .2 // start position, radius
  <-1, -1, 0>, .2
  <1, 1, 0>, .6
  <3, 3, 0>, .6 // end position, radius

  pigment {
    image_map {
      // jpeg "images/Baseball-Bat-Texture.jpg"
      jpeg "images/Wood-Texture.jpg"
      map_type 1
    }
  }

  finish { ambient .4}
}
