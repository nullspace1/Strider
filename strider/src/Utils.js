function obtenerArray1aN(n) {
    var arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(i + 1);
    }
    return arr;
}

function calcularSemanaDelAño(fecha) {
    let anio = fecha.getFullYear();
    let fechaPrimerDiaDelAño = new Date(anio, 0, 2);
    return Math.floor((fecha.getTime() - fechaPrimerDiaDelAño.getTime()) / (1000 * 60 * 60 * 24 * 7));
}

export {obtenerArray1aN, calcularSemanaDelAño}