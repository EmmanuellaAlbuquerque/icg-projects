class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calcula a norma ou módulo de um vetor, 
   * que é o número real que representa o 
   * comprimento desse vetor.
   */
  getNorm() {
    var a = Math.pow(this.x, 2);
    var b = Math.pow(this.y, 2);
    var c = Math.pow(this.z, 2);

    return Math.sqrt(a + b + c);
  }
}

class VectorsOperations {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
  }

  /**
   * Vector product
   */
  getCrossProduct() {
    var cx = this.v1.y * this.v2.z - this.v1.z * this.v2.y;
    var cy = this.v1.z * this.v2.x - this.v1.x * this.v2.z;
    var cz = this.v1.x * this.v2.y - this.v1.y * this.v2.x;
    var crossVector = new Vector(cx, cy, cz);

    return crossVector;
  }

  /**
   * Scalar product
   */
  getDotProduct() {
    var ax = this.v1.x * this.v2.x;
    var ay = this.v1.y * this.v2.y;
    var az = this.v1.z * this.v2.z;
    return ax + ay + az;
  }

  setV1(v1) {
    this.v1 = v1;
  }

  setV2(v2) {
    this.v2 = v2;
  }
}

class Matrix {
  constructor(l1, l2, l3) {
    this.line1 = l1;
    this.line2 = l2;
    this.line3 = l3;
  }

  getMatrixDeterminant() {
    var a1 = this.line1.x * (this.line2.y * this.line3.z - this.line2.z * this.line3.y);
    var a2 = this.line1.y * (this.line2.x * this.line3.z - this.line2.z * this.line3.x);
    var a3 = this.line1.z * (this.line2.x * this.line3.y - this.line2.y * this.line3.x);

    return a1 - a2 + a3;
  }

  getTransposeMatrix(matrix) {
    var l1 = new Vector(this.line1.x, this.line2.x, this.line3.x);
    var l2 = new Vector(this.line1.y, this.line2.y, this.line3.y);
    var l3 = new Vector(this.line1.z, this.line2.z, this.line3.z);

    return new Matrix(l1, l2, l3);
  }
}

function getVectorXMatrix(matrix, vector) {
  var vOperations = new VectorsOperations(vector, vector);
  vOperations.setV1(vector);
  vOperations.setV2(matrix.line1);
  var a1 = vOperations.getDotProduct();
  vOperations.setV2(matrix.line2);
  var a2 = vOperations.getDotProduct();
  vOperations.setV2(matrix.line3);
  var a3 = vOperations.getDotProduct();

  return new Vector(a1, a2, a3);
}

function getMatrixXMatrix(matrix1, matrix2) {
  var a11 = matrix1.line1.x * matrix2.line1.x
    + matrix1.line1.y * matrix2.line2.x
    + matrix1.line1.z * matrix2.line3.x;

  var a21 = matrix1.line2.x * matrix2.line1.x
    + matrix1.line2.y * matrix2.line2.x
    + matrix1.line2.z * matrix2.line3.x;

  var a31 = matrix1.line3.x * matrix2.line1.x
    + matrix1.line3.y * matrix2.line2.x
    + matrix1.line3.z * matrix2.line3.x;

  var a12 = matrix1.line1.x * matrix2.line1.y
    + matrix1.line1.y * matrix2.line2.y
    + matrix1.line1.z * matrix2.line3.y;

  var a22 = matrix1.line2.x * matrix2.line1.y
    + matrix1.line2.y * matrix2.line2.y
    + matrix1.line2.z * matrix2.line3.y;

  var a32 = matrix1.line3.x * matrix2.line1.y
    + matrix1.line3.y * matrix2.line2.y
    + matrix1.line3.z * matrix2.line3.y;

  var a13 = matrix1.line1.x * matrix2.line1.z
    + matrix1.line1.y * matrix2.line2.z
    + matrix1.line1.z * matrix2.line3.z;

  var a23 = matrix1.line2.x * matrix2.line1.z
    + matrix1.line2.y * matrix2.line2.z
    + matrix1.line2.z * matrix2.line3.z;

  var a33 = matrix1.line3.x * matrix2.line1.z
    + matrix1.line3.y * matrix2.line2.z
    + matrix1.line3.z * matrix2.line3.z;

  var l1 = new Vector(a11, a12, a13);
  var l2 = new Vector(a21, a22, a23);
  var l3 = new Vector(a31, a32, a33);
  return new Matrix(l1, l2, l3);
}

// Operações com vetores
// const vector1 = new Vector(2, -1, 4);
// const vector2 = new Vector(0, 3, 1);
// const vector3 = new Vector(4, 2, 6);

// const vector1 = new Vector(6, 1, 1);
// const vector2 = new Vector(4, -2, 5);
// const vector3 = new Vector(2, 8, 7);

// const vector1 = new Vector(2, -3, 1);
// const vector2 = new Vector(2, 0, -1);
// const vector3 = new Vector(1, 4, 5);

const vector1 = new Vector(1, 2, 3);
const vector2 = new Vector(4, 5, 6);
const vector3 = new Vector(7, 8, 9);

const vector4 = new Vector(2, 3, 5);

const vector5 = new Vector(1, -2, 0);
const vector6 = new Vector(4, 0, 1);
const vector7 = new Vector(-3, 5, 6);

const matrix1 = new Matrix(vector1, vector2, vector3);
const matrix2 = new Matrix(vector5, vector6, vector7);

// Norma do vetor
console.log("Norma do vetor:", vector1, "=", vector1.getNorm().toFixed(4));

const vOperations = new VectorsOperations(vector1, vector2);

// Produto vetorial 
console.log("Produto Vetorial:", vOperations.getCrossProduct());

// Produto escalar
console.log("Produto Escalar:", vOperations.getDotProduct());

// Produto vetor/matriz
console.log("Produto vetor/matriz:", getVectorXMatrix(matrix1, vector4));

// Produto matriz/matriz
console.log("Produto matriz/matriz:", getMatrixXMatrix(matrix1, matrix2));

// Determinante da matriz
console.log("Determinante da matriz:", matrix1.getMatrixDeterminant());

// Transposta da matriz
console.log("Transposta da matriz:", matrix1.getTransposeMatrix());
