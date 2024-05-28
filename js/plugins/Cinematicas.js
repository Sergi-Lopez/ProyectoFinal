var Cinematicas = Cinematicas || {};

// Método para mover al personaje en el mapa con diálogos cada 5 pasos
Cinematicas.mapa3 = async function() {
    AudioManager.playBgm({ name: "Town1", volume: 35, pitch: 100 });
    var actor = $gameParty.members()[0]; // Neia siempre es la primera del grupo por lo que se moverá ella

    if (!actor) {
        console.error("No se encontró al personaje Neia en el grupo");
        return;
    }

    // Obtiene el evento asociado a Neia
    var character = $gamePlayer;

    // Función para mover al personaje y esperar el tiempo necesario para completar el movimiento, de esta forma no se ve mal o a tirones
    const moverYEsperar = async (x, y, dialogo) => {
        character.moveStraight(x);
        await Cinematicas.wait(y * 15); // Cambiando el multiplicador se puede ajustar el tiempo de espera
        if (dialogo) {
            $gameMessage.add(dialogo);
            await Cinematicas.esperarMensaje(); // Esperar a que se cierre el mensaje
        }
    };

    // 12 pasos a la izquierda
    var mensaje;
    for (let i = 0; i < 12; i++) {
        if (i === 5) {
            mensaje = "Este lugar te trae recuerdos...";
        }
        if (i === 10) {
            mensaje = "Las tumbas de algunos antiguos compañeros.";
        }
        await moverYEsperar(4, 1, mensaje);
        mensaje = null;
    }

    // 9 pasos hacia arriba
    for (let i = 0; i < 9; i++) {
        if (i === 5) {
            mensaje = "No te sientes del todo bien, no es agradable.";
        }
        await moverYEsperar(8, 1, mensaje);
        mensaje = null;
    }

    // 4 pasos hacia la derecha
    for (let i = 0; i < 4; i++) {
        await moverYEsperar(6, 1, null);
    }

    // 9 pasos más hacia arriba
    for (let i = 0; i < 9; i++) {
        if (i === 1) {
            mensaje = "Aquí fue donde los tuviste que enterrar.\nDespués de tanto tiempo encerrada, parecía que\nesos recuerdos habían desaparecido.";
        }
        if (i === 6) {
            mensaje = "Pero estar aquí te lo ha recordado todo...\nTambién lo que más querías hace años.";
        }
        await moverYEsperar(8, 1, mensaje);
        mensaje = null;
    }

    // 2 pasos hacia la derecha
    for (let i = 0; i < 2; i++) {
        await moverYEsperar(6, 1, null);
    }

    // 3 pasos hacia arriba
    for (let i = 0; i < 2; i++) {
        await moverYEsperar(8, 1, null);
    }

    // Diálogo final
    $gameMessage.add('Por fin, después de mucho tiempo puedes salir.\nY cumplir con tu venganza contra quien hizo esto.');
    await Cinematicas.esperarMensaje();
};

// Función para esperar hasta que se cierre el mensaje, de esta manera no continuará moviendose el personaje
Cinematicas.esperarMensaje = function() {
    return new Promise(resolve => {
        const check = setInterval(() => {
            if (!$gameMessage.isBusy()) {
                clearInterval(check);
                resolve();
            }
        }, 100);
    });
};

// Función wait, hace que el juego espere antes de continuar con la ejecución del código
Cinematicas.wait = function(frames) {
    return new Promise(resolve => setTimeout(resolve, frames * 16.67));
};