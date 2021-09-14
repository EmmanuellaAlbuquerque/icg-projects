var sequence = [];
var countEven = 0;

// Gera os números inteiros aleatórios de 0 à 100 e realiza a contagem.
for (var i = 0; i < 10; i++) {
  generatedNumber = Math.floor(Math.random() * 100);
  if (generatedNumber % 2 === 0) {
    countEven += 1;
  }
  sequence.push(generatedNumber);
}

console.log("Array:", sequence);
console.log("Quantidade de números pares:", countEven);