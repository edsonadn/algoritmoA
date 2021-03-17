// declaracion de variables

var canvas, ctx;                // variables del canvas

var columnas = 50,
  filas = 50,
  escenario;                    // variables del escenario matriz

var anchoT, largoT;             // variables para tamaño de pixel

var fps = 1;                    // variable de tiempo

var color = "negro";            // variables de dibujo

//declaracion de objetos;
var edson;
var casa;

// * ################################### funcion principal #########################################

//funcion main: aqui va la inicializacion de los objetos y variables
function main() {
  //inicializacion del canvas
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  //calculamos el tamaño de los tiles
  anchoT = parseInt(canvas.width / columnas);
  largoT = parseInt(canvas.height / filas);

  //creamos la matriz del escenario
  escenario = Matriz2d(filas, columnas);

  //iniciamon el ancho de los tiles
  largoT = 10;
  anchoT = 10;

  //creamos un aldeano
  edson = new aldeano(0, 0, ctx);
  casa = new edificio(1, 1, ctx);

  // ^ ejecucion del loop principal
  setInterval(function () {
    loop();
  }, 1000 / fps);
}

// ^ loop principal de ejecucion
function loop() {
  clean();
  draw();
  logic();
}

// * ########################################## funciones ###########################################

//aqui van las funciones draw de los objetos
function draw() {
  casa.draw();
  edson.draw();
}
//aqui van las funciones logic de los objetos
function logic() {
  edson.logic();
  casa.logic();
}
//funcion para limpiar el canvas
function clean() {
  canvas.width = canvas.width;
}
// funcion para crear matrizes
function Matriz2d(f, c) {
  //crea la matriz de manera dinamica
  var obj = new Array(f);
  for (i = 0; i < f; i++) {
    obj[i] = new Array(c);
  }
  //incializa la matriz con ceros
  for (var i = 0; i < filas; i++) {
    for (var j = 0; j < columnas; j++) {
      obj[i][j] = 0;
    }
  }

  return obj;
}
//funcion de visualizacion de matrizes 
//! codigo experimental (No se recomienda su uso en implementacion de ejecucion)
function visualizacionMatriz() {
  for (var i = 0; i < filas; i++) {
    for (var j = 0; j < columnas; j++) {
      document.write(escenario[j][i]);
    }
    document.write("<br>");
  }
}

// * ########################################### clases #############################################

class aldeano {
  // constructor
  constructor(x, y, c) {
    //posiciones del objeto
    this.x = x;
    this.xLate = x;
    this.y = y;
    this.yLate = y;
    //contexto: para el dibujo
    this.c = c;
    //Estados:( 0 = quieto; 1 = arriba; 2 =abajo; 3 = izquierda; 4 = Derecha )

    this.pasos = 0;
    //? modificacion dependiendo el objeto
    this.ancho = 10;
    this.largo = 10;
    // estados del objeto
    this.estado = 0;
    this.estadoMove = true;
  }
  //metodo de estados
  draw() {
    this.c.strokeStyle = "000000";
    this.c.strokeRect(this.x, this.y, this.largo, this.ancho);
  }
  //metodo de logicas
  logic() {
    this.afectarEscenario();
    this.mover();
    //bucle de movimineto
    this.afectarEstado();
  }
  //cambia el estado de manera automatica //!experimental
  afectarEstado() {
    if (this.pasos == 10) {
      this.estado = this.estado + 1;
      if (this.estado >= 5) {
        this.estado = 0;
      }
      this.pasos = 0;
    }
  }
  //metodo para mover el personaje
  mover() {
    this.xLate = this.x;
    this.yLate = this.y;
    if (this.estado == 1) {
      this.x = this.x + anchoT;
      this.estadoMove = true;
    } else if (this.estado == 2) {
      this.x = this.x - anchoT;
      this.estadoMove = true;
    } else if (this.estado == 3) {
      this.y = this.y + largoT;
      this.estadoMove = true;
    } else if (this.estado == 4) {
      this.y = this.y - largoT;
      this.estadoMove = true;
    } else {
      console.log("se detuvo");
      this.estadoMove = false;
    }
    this.pasos = this.pasos + 1;
  }
  //metodo para canviar el estado de manera manual
  cambioEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }
  //metodo que mapea la matriz del escenario
  afectarEscenario() {
    if (this.estadoMove == true) {
      //borra donde se encontraba el objeto en la matriz
      for (var i = 0; i < this.ancho / 10; i++) {
        for (var j = 0; j < this.largo / 10; j++) {
          console.log(
            "(" +
              (i + this.xLate / 10) +
              "," +
              (j + this.yLate / 10) +
              "):borrando"
          );
          escenario[i + this.xLate / 10][j + this.yLate / 10] = 0;
        }
      }
      //dibuja en la matriz la posicion del objeto
      for (var i = 0; i < this.ancho / 10; i++) {
        for (var j = 0; j < this.largo / 10; j++) {
          console.log(
            "(" + (i + this.x / 10) + "," + (j + this.y / 10) + "):pintando"
          );
          escenario[i + this.x / 10][j + this.y / 10] = 1;
        }
      }
    }
  }
}
class edificio {
  // constructor
  constructor(x, y, c) {
    this.x = x * largoT;
    this.y = y * anchoT;
    this.c = c;
    this.ancho = 20;
    this.largo = 20;
    this.estadoMove = true;
  }
  //metodo de dibujado del objeto
  draw() {
    this.c.strokeStyle = "#FF0000";
    this.c.strokeRect(this.x, this.y, this.ancho, this.largo);
  }
  //metodo de logica del objeto //!contiene codigo experimental
  logic() {
    this.afectarEscenario();
    this.estadoMove = false;
  }
  //metodo de dibujado en la matriz //!metodo incompleto
  afectarEscenario() {
    if (this.estadoMove == true) {
      // for de dibujado de matriz
      for (var i = 0; i < this.ancho / 10; i++) {
        for (var j = 0; j < this.largo / 10; j++) {
          console.log("(" + (i + this.x / 10) + "," + (j + this.y / 10) + ")");
          escenario[i + this.x / 10][j + this.y / 10] = 1;
        }
      }
      // falta el metodo de borrado de la matriz
    }
  }
}
