import { calcularSemanaDelAño } from "@/Utils";

class Atleta {

    constructor(nombre, apellido, fechaNacimiento) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.id = Math.random().toString(16).slice(8);
    }

}

class Mesociclo {


    static calcularMicrociclos(nuevoMesociclo) {
    
        const microciclos = [];
        const milliToWeek = 1000 * 60 * 60 * 24 * 7;
        const agregarSemanaAFecha = (date, i) => new Date(new Date(date).getTime() + i * milliToWeek);
        const fechaFin = new Date(nuevoMesociclo.fechaFin);

        for (let i = 0; agregarSemanaAFecha(nuevoMesociclo.fechaInicio, i).getTime() < fechaFin.getTime(); i++) {
            const fechaInicio = agregarSemanaAFecha(nuevoMesociclo.fechaInicio, i);
            const semana = calcularSemanaDelAño(fechaInicio);
            microciclos.push(new Microciclo(semana, new Date(fechaInicio), new Date(fechaFin)));
        }

        return microciclos;
    }


    constructor(nombre, fechaInicio, fechaFin) {
        this.nombre = nombre;
        this.fechaInicio = new Date(fechaInicio);
        this.fechaFin = new Date(fechaFin);
        this.microciclos = Mesociclo.calcularMicrociclos(this);
        this.id = Math.random().toString(16).slice(8);
    }

    microcicloPorID(id) {
        for (let i = 0; i < this.microciclos.length; i++) {
            if (this.microciclos[i].id === id) {
                return this.microciclos[i];
            }
        }
    }

}

class Microciclo {

    calcularEntrenamientos() {

        const milliToDay = 1000 * 60 * 60 * 24;
        const agregarDiaAFecha = (date, i) => new Date(new Date(date).getTime() + i * milliToDay);

        return [0, 1, 2, 3, 4, 5, 6].map((i) => new Entrenamiento(agregarDiaAFecha(this.fechaInicio, i)))
    }

    constructor(semana, fechaInicio, fechaFin) {
        this.semana = semana;
        this.fechaInicio = new Date(fechaInicio);
        this.fechaFin = new Date(fechaFin);
        this.entrenamientos = this.calcularEntrenamientos();
        this.id = Math.random().toString(16).slice(8);
    }

    entrenamientoPorID(id){
        for (let i = 0; i < this.entrenamientos.length; i++) {
            if (this.entrenamientos[i].id === id) {
                return this.entrenamientos[i];
            }
        }
    }

}

class Entrenamiento {

    constructor(fecha) {
        this.fecha = new Date(fecha);
        this.id = Math.random().toString(16).slice(8);
        this.laps = [];
        this.lapMaximo = 0;
    }

    dia() {
        const dias = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miercoles',
            'Jueves',
            'Viernes',
            'Sabado'
        ];
        return dias[new Date(this.fecha).getDay()];
    }
}



export { Atleta, Mesociclo, Entrenamiento }