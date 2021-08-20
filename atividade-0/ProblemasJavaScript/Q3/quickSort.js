function quicksort(sequence, start, end) {
  if (start < end) {
    // [menores <- esquerda, pivot, maiores -> direita]
    let j = partition(sequence, start, end);
    quicksort(sequence, start, j - 1);
    quicksort(sequence, j + 1, end);
  }
}

function partition(sequence, start, end) {
  let pivot = sequence[start];
  let i = start + 1;
  let j = end;

  while (i <= j) {
    if (sequence[i] <= pivot) {
      i += 1;
    }
    else if (sequence[j] > pivot) {
      j -= 1;
    }
    else if (i <= j) {
      swap(sequence, i, j);
      i += 1;
      j -= 1;
    }
  }

  swap(sequence, start, j);
  return j;
}

function swap(sequence, i, j) {
  let aux = sequence[i];
  sequence[i] = sequence[j];
  sequence[j] = aux;
}

let sequence = [10, 1, 5, 12, 15, 3, 0, -1, -9, 100, 1, 2, 50];

alertInfo = `Initial sequence: ${sequence}\n`;
quicksort(sequence, 0, sequence.length - 1);
alertInfo += `Result sequence: ${sequence}`;

alert(alertInfo);
console.log(sequence);
