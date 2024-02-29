let intentos = 6;
let intentosRealizados = 0;
let juegoTerminado = false;

let diccionario = ['APPLE', 'HURLS', 'WINGS', 'YOUTH'];
let palabra = diccionario[Math.floor(Math.random() * diccionario.length)];

const input = document.getElementById("guess-input");
const button = document.getElementById("guess-button");
const restartButton = document.getElementById("restart-button");
const MENSAJE = document.getElementById("mensaje");
const GRID = document.getElementById("grid");

window.addEventListener('load', init);

function init() {
    restartButton.addEventListener("click", reiniciarJuego);
    input.disabled = false;
    input.focus();

    input.addEventListener("input", function () {
        if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
        }
    });
}

button.addEventListener("click", intentar);

function intentar() {
    if (juegoTerminado) {
        alert("El juego ha terminado. Por favor, inicia un nuevo juego.");
        return;
    }

    const INTENTO = leerIntento();
    console.log(INTENTO);

    const ROW = document.createElement('div');
    ROW.className = 'row';
    GRID.appendChild(ROW);
    
    let letrasCorrectas = 0;
    let letrasAmarillas = 0;

    for (let i in palabra) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';

        if (INTENTO[i] === palabra[i]) {
            SPAN.innerHTML = INTENTO[i];
            SPAN.classList.add('verde');
            letrasCorrectas++;
        } else if (palabra.includes(INTENTO[i]) && !letraEnVerde(INTENTO[i])) {
            letrasAmarillas++;
            SPAN.innerHTML = INTENTO[i];
            SPAN.classList.add('amarillo');
        } else {
            SPAN.innerHTML = '_';
            SPAN.classList.add('gris');
        }

        ROW.appendChild(SPAN);
    }

    if (letrasCorrectas === palabra.length) {
        mostrarMensaje("¡Ganaste! Has adivinado la palabra correctamente.");
        finalizarJuego();
    }

    intentosRealizados++;

    if (intentosRealizados === intentos) {
        mostrarMensaje("¡Perdiste! Se alcanzó el límite de intentos.");
        finalizarJuego();
    }

    input.value = "";
    input.disabled = juegoTerminado;
    actualizarBoton();
}

function letraEnVerde(letra) {
    const filas = GRID.children;
    for (let i = 0; i < intentosRealizados; i++) {
        const letrasVerdes = filas[i].getElementsByClassName("verde");
        for (let j = 0; j < letrasVerdes.length; j++) {
            if (letrasVerdes[j].innerHTML === letra) {
                return true;
            }
        }
    }
    return false;
}

function leerIntento() {
    let intento = input.value;
    intento = intento.toUpperCase(); 
    return intento;
}

function mostrarMensaje(mensaje) {
    MENSAJE.innerHTML = mensaje;
}

function finalizarJuego() {
    juegoTerminado = true;
    input.disabled = true;
    actualizarBoton();
}

function reiniciarJuego() {
    juegoTerminado = false;
    intentosRealizados = 0;
    palabra = diccionario[Math.floor(Math.random() * diccionario.length)];
    input.disabled = false;
    MENSAJE.innerHTML = "";
    input.value = "";
    Array.from(GRID.children).forEach(row => (row.innerHTML = ""));
    actualizarBoton();
}

function actualizarBoton() {
    button.innerHTML = juegoTerminado ? "Volver a Jugar" : "Intentar";
}
