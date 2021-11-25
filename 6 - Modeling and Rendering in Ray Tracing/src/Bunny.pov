///////////////////////////////////////////////////////////////////////////////
// Bunny Script (.pov) POV-Ray
// Cena: 
///////////////////////////////////////////////////////////////////////////////

#include "colors.inc"
#include "include/bunny.inc"

camera {
  location <0, 1, -4>
  look_at <0, 2, 0>
  angle 80
}

light_source { 
  <10, 10, -10> White 
}

sky_sphere {
  pigment {
    gradient y
    color_map {
      [0.000 0.002 color rgb <1.0, 0.0, 0.0>
                    color rgb <0.9, 0.0, 0.0>]
      [0.002 0.200 color rgb <0.8, 0.0, 0.0>
                    color rgb <1.0, 1.0, 1.0>]
    }
    scale 2
    translate -1
  }
  rotate -135*x
}

plane {
  y, 0
  pigment {
    checker
    pigment { Red }
    pigment { White }
    turbulence 0.5
    lambda 1.5
    omega 0.8
    octaves 5
    frequency 3
  }
  finish { ambient .3 diffuse .7 }
}

Bunny