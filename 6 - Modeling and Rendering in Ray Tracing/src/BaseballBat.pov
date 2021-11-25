///////////////////////////////////////////////////////////////////////////////
// Baseball Bat Script (pov)
// Cena: Taco de Beisebol com textura de Madeira e uma Bola de Beisebol.
///////////////////////////////////////////////////////////////////////////////

#include "colors.inc"

camera {
  location <1, 1, -40>
  look_at <1, 1, 0>
  angle 15
}

light_source {
  <4, 1.5, -60>, White
  shadowless
}

light_source {
  <3, 3, -60>, White
  shadowless
}

sky_sphere {
  pigment {
    gradient y
    color_map {
      [0 color White]
      [1 color Black]
    }

    scale 2
    translate <0, 1, 0>
  }
}

///////////////////////////////////////////////////////////////////////////////
// FIRST STEP: Definindo os pontos.
// (i.e as esferas que irão compor o taco)
///////////////////////////////////////////////////////////////////////////////

/*
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
  <1, 1, 0>, .5
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}

sphere {
  <3, 3, 0>, .6
  pigment { Black }
  finish { ambient .4} // define light to sphere between 0, 1
}
*/

///////////////////////////////////////////////////////////////////////////////
// SECOND STEP:
// Definindo a bola de Beisebol e aplicando a textura.
///////////////////////////////////////////////////////////////////////////////
sphere {
  <0, 0, 0>, .6
  pigment {
     image_map {
      jpeg "images/Ball-Texture.jpg"
      map_type 1 // spherical mapping
    }
   }

  rotate <0, 45, 0>
  translate <4, 1.5, 0>
  finish { ambient .4} // define light to sphere between 0, 1
}

///////////////////////////////////////////////////////////////////////////////
// THIRD STEP:
// Definindo o Taco de Beisebol e aplicando a textura.
///////////////////////////////////////////////////////////////////////////////
sphere_sweep {
  linear_spline // linear(straight) path
  4, // positions

  <-2, -2, 0>, .2 // start position, radius
  <-1, -1, 0>, .2
  <1, 1, 0>, .5
  <3, 3, 0>, .6 // end position, radius

  pigment {
    image_map {
      jpeg "images/Wood-Texture.jpg"
      map_type 1
    }
  }

  finish { ambient .4}
}
