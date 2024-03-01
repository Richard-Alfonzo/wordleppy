let intentos = 6;
let intentosRealizados = 0;
let juegoTerminado = false;

const URL_API = 'https://clientes.api.greenborn.com.ar/public-random-word';

let palabra = '';

const input = document.getElementById("guess-input");
const button = document.getElementById("guess-button");
const restartButton = document.getElementById("restart-button");
const MENSAJE = document.getElementById("mensaje");
const GRID = document.getElementById("grid");
let mensajeError = document.getElementById("mensaje-error");

window.addEventListener('load', init);

function init() {
    obtenerPalabraDeAPI();
    restartButton.style.display = "none";
    restartButton.addEventListener("click", reiniciarJuego);
    input.disabled = false;
    input.focus();

    input.addEventListener("input", function () {
        if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
        }

        if (this.value.length === 5) {
            button.disabled = false;
            mensajeError.innerHTML = "";
            mensajeError.style.display = "none";
        } else {
            button.disabled = true;
            mensajeError.innerHTML = "¡Faltan letras! Ingresa las 5 letras.";
            mensajeError.style.display = "block";
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

    if (INTENTO.length !== 5) {
        mostrarMensajeError("¡Faltan letras! Ingresa las 5 letras.");
        return;
    }

    const ROW = document.createElement('div');
    ROW.className = 'row';
    GRID.appendChild(ROW);

    let todasEnVerde = true;

    for (let i in palabra) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';

        if (INTENTO[i] === palabra[i]) {
            SPAN.innerHTML = INTENTO[i];
            SPAN.classList.add('verde');
        } else if (palabra.includes(INTENTO[i]) && !letraEnVerde(INTENTO[i])) {
            SPAN.innerHTML = INTENTO[i];
            SPAN.classList.add('amarillo');
            todasEnVerde = false;
        } else {
            SPAN.innerHTML = INTENTO[i];
            SPAN.classList.add('gris');
            todasEnVerde = false;
        }

        ROW.appendChild(SPAN);
        setTimeout(() => SPAN.style.opacity = 1, 100 * i);
    }

    if (todasEnVerde) {
        mostrarMensaje("¡Ganaste! Has completado la palabra correctamente.");
        finalizarJuego();
        return;
    }

    if (intentosRealizados === intentos) {
        mostrarMensaje("¡Perdiste! Se alcanzó el límite de intentos.");
        finalizarJuego();
    }

    intentosRealizados++;
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

function mostrarMensajeError(mensaje) {
    mensajeError.innerHTML = mensaje;
    mensajeError.style.display = "block";
}

function mostrarMensaje(mensaje) {
    MENSAJE.innerHTML = mensaje;
}

function finalizarJuego() {
    juegoTerminado = true;
    input.disabled = true;
    restartButton.style.display = "inline-block";
    actualizarBoton();
}

function reiniciarJuego() {
    juegoTerminado = false;
    intentosRealizados = 0;
    obtenerPalabraDeAPI();
    input.disabled = false;
    restartButton.style.display = "none";
    MENSAJE.innerHTML = "";
    mensajeError.innerHTML = "";
    mensajeError.style.display = "none";
    input.value = "";
    
    // Eliminar todas las filas existentes en el GRID
    while (GRID.firstChild) {
        GRID.removeChild(GRID.firstChild);
    }

    actualizarBoton();
}

function actualizarBoton() {
    button.innerHTML = juegoTerminado ? "Volver a Jugar" : "Intentar";
}

function obtenerPalabraDeAPI() {
    mostrarMensaje("Cargando...");
    fetch(URL_API)
        .then(response => response.json())
        .then(data => {
            const palabraAPI = data[0].toUpperCase();
            if (palabraAPI.length === 5) {
                palabra = palabraAPI;
                mensajeError.style.display = "none"; 
                MENSAJE.innerHTML = ""; 
            } else {
                obtenerPalabraDeAPI(); 
            }
        })
        .catch(error => {
            console.error('Error al obtener la palabra de la API:', error);
            alert('Error al obtener la palabra. Por favor, recarga la página.');
        });
}
