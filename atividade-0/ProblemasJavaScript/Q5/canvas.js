var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.fillStyle = "#f0e68c";
context.fillRect(0, 0, canvas.width, canvas.height);

// ------------------------ Desenha o GRAMADO ------------------------
context.beginPath();
context.lineWidth = 5;

const GREENLawnHeight = 150;
var x = 0;
var y = GREENLawnHeight;

while (x < canvas.width) {
  context.moveTo(x, y);
  x += 30;
  if (y == GREENLawnHeight) {
    y -= 20;
  }
  else {
    y += 20;
  }
  context.lineTo(x, y);

  context.strokeStyle = '#419D78';
  context.stroke();
}

context.closePath();

// ------------------------ Desenha o primeiro PACMAN1 ------------------------
// Desenha o Círculo do Pacman
context.beginPath();
context.lineWidth = 10;
context.arc(150, 100, 50, 0, 2 * Math.PI);
context.strokeStyle = '#000';
context.fillStyle = '#f0e68c';
context.stroke();
context.fill();
context.closePath();

// Desenha o olho do Pacman
context.beginPath();
context.lineWidth = 2;
context.arc(140, 80, 8, 0, 2 * Math.PI);
context.strokeStyle = '#000';
context.fillStyle = '#000';
context.stroke();
context.fill();
context.closePath();

// Desenha a boca do Pacman
context.beginPath();
context.lineWidth = 5;
context.moveTo(100, 110);
context.lineTo(150, 110);
context.strokeStyle = '#000';
context.stroke();
context.closePath();

// ------------------------ Desenha o segundo PACMAN2 ------------------------
// Desenha o Círculo do Pacman
context.beginPath();
context.lineWidth = 10;
context.arc(320, 100, 50, Math.PI, 0.73 * Math.PI);
context.strokeStyle = '#000';
context.fillStyle = '#f0e68c';
context.stroke();
context.fill();
context.closePath();

// Desenha o olho do Pacman
context.beginPath();
context.lineWidth = 2;
context.arc(310, 80, 8, 0, 2 * Math.PI);
context.strokeStyle = '#000';
context.fillStyle = '#000';
context.stroke();
context.fill();
context.closePath();

// Desenha a boca aberta do Pacman
context.beginPath();
context.lineWidth = 5;
context.moveTo(270, 100);
context.lineTo(320, 110);

context.moveTo(320, 110);
context.lineTo(285, 140);
context.strokeStyle = '#000';
context.stroke();
context.closePath();
