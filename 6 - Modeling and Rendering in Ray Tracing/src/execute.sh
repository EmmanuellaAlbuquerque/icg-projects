#!/bin/sh
echo "what is your name?"
read name
echo "How do you do, $name? I will run the files now for you!"

povray scripts/Scene1-BaseballBat/BaseballBat.pov && povray scripts/Scene2-Bunny/Bunny.pov

# povray BaseballBat.pov -W1280 -H720
# povray BaseballBat.pov -W1920 -H1080
