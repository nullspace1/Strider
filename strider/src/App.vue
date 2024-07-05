<script setup>
import { ref } from 'vue';

const mesociclos = ref([]);
const atletas = ref([]);
const creandoMesociclo = ref(false);
const nuevoMesociclo = ref({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
});

const indiceMesocicloSeleccionado = ref(-1);
const indiceMicrocicloSeleccionado = ref(-1);
const indiceEntrenamientoSeleccionado = ref(-1);

function microciclo(){
    return mesociclos.value[indiceMesocicloSeleccionado.value].microciclos[indiceMicrocicloSeleccionado.value];
}

function entrenamiento(){
    return microciclo().entrenamientos[indiceEntrenamientoSeleccionado.value];
}

function empezarCreacionMesociclo() {
    creandoMesociclo.value = true;
}

function cerrarCreacionMesociclo() {
    creandoMesociclo.value = false;
}

function agregarMesociclo() {
    if (
        nuevoMesociclo.value.nombre &&
        nuevoMesociclo.value.fechaInicio &&
        nuevoMesociclo.value.fechaFin &&
        nuevoMesociclo.value.fechaInicio < nuevoMesociclo.value.fechaFin
    ) {
        let microciclos = calcularMicrociclos(nuevoMesociclo.value);
        mesociclos.value.push({
            nombre: nuevoMesociclo.value.nombre,
            fechaInicio: new Date(nuevoMesociclo.value.fechaInicio),
            fechaFin: new Date(nuevoMesociclo.value.fechaFin),
            microciclos: microciclos
        });
        nuevoMesociclo.value = { nombre: '', fechaInicio: '', fechaFin: '' };
        cerrarCreacionMesociclo();
    }
} 

function calcularMicrociclos(nuevoMesociclo) {
    let microciclos = [];
    let milliToWeek = 1000 * 60 * 60 * 24 * 7;
    let milliToDay = milliToWeek / 7;

    let agregarSemanaAFecha = (date, i) => new Date(new Date(date).getTime() + i * milliToWeek)
    let agregarDiaAFecha = (date, i) => new Date(new Date(date).getTime() + i * milliToDay)


    let diasDeSemana = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado'
    ]

    for (let i = 0; agregarSemanaAFecha(nuevoMesociclo.fechaInicio, i).getTime() < new Date(nuevoMesociclo.fechaFin).getTime(); i++) {
        let fechaInicio = agregarSemanaAFecha(nuevoMesociclo.fechaInicio, i);
        microciclos.push({
            semana: calcularSemanaDelAño(fechaInicio),
            fechaInicio: fechaInicio,
            fechaFin: agregarSemanaAFecha(fechaInicio, 1),
            entrenamientos: [1, 2, 3, 4, 5, 6, 7].map(n => {
                return {
                    'dia': diasDeSemana[agregarDiaAFecha(fechaInicio, n).getDay()],
                    'numero': n,
                    'lapMaximo': 0,
                    'laps': {}
                }
            }
            )
        });
    }
    return microciclos;
}

function calcularSemanaDelAño(fecha) {
    let anio = fecha.getFullYear();
    let fechaPrimerDiaDelAño = new Date(anio, 0, 2);
    return Math.floor((fecha.getTime() - fechaPrimerDiaDelAño.getTime()) / (1000 * 60 * 60 * 24 * 7));
}

function seleccionarMesociclo(mesocicloID) {
    indiceMesocicloSeleccionado.value = mesocicloID;
    indiceMicrocicloSeleccionado.value = -1;
    indiceEntrenamientoSeleccionado.value = -1;
}

function seleccionarMicrociclo(microcicloID) {
    indiceMicrocicloSeleccionado.value = microcicloID;
    indiceEntrenamientoSeleccionado.value = -1;
}

function seleccionarEntrenamiento(entrenamientoID) {
    indiceEntrenamientoSeleccionado.value = entrenamientoID;
}

function borrarMesocicloSeleccionado() {
    if (indiceMesocicloSeleccionado.value > -1) {
        mesociclos.value.splice(indiceMesocicloSeleccionado.value, 1);
        indiceMesocicloSeleccionado.value = -1;
        indiceMicrocicloSeleccionado.value = -1;
        indiceEntrenamientoSeleccionado.value = -1;
    }
}

function obtenerArray1aN(n){
    var arr = [];
    for (let i = 0; i < n; i++){
        arr.push(i + 1);
    }
    return arr;
}

</script>

<template>
    <div class="main">
        <div v-if="creandoMesociclo" class="ventana-crear-mesociclo">
            <p> Nuevo Mesociclo </p>
            <button class="cerrar-crear-mesociclo" @click="cerrarCreacionMesociclo">X</button>
            <div class="input-crear-mesociclo">
                <label>Nombre</label>
                <input type="text" v-model="nuevoMesociclo.nombre" />
            </div>
            <div class="input-crear-mesociclo">
                <label>Fecha de Inicio</label>
                <input type="date" v-model="nuevoMesociclo.fechaInicio" />
            </div>
            <div class="input-crear-mesociclo">
                <label>Fecha de Finalización</label>
                <input type="date" v-model="nuevoMesociclo.fechaFin" />
            </div>
            <button @click="agregarMesociclo">Crear</button>
        </div>
        <div class="contenedor mesociclos">
            <p>Mesociclos</p>
            <div class="botones">
                <button @click="empezarCreacionMesociclo">C</button>
                <button @click="borrarMesocicloSeleccionado">D</button>
            </div>
            <ul>
                <li :class="id === indiceMesocicloSeleccionado ? 'mesociclo seleccionado' : ''"
                    v-for="(mesociclo, id) in mesociclos" :key="mesociclo.nombre" @click="seleccionarMesociclo(id)">
                    {{ mesociclo.nombre }}
                </li>
            </ul>
        </div>
        <div class="contenedor microciclos">
            <p> Microciclo de Mesociclo </p>
            <div class="listado-items" v-if="indiceMesocicloSeleccionado > -1">
                <div :class="i == indiceMicrocicloSeleccionado ? 'calendario-microciclo seleccionado' : 'calendario-microciclo'"
                    v-for="(microciclo, i) in mesociclos[indiceMesocicloSeleccionado].microciclos"
                    :key="microciclo.fechaInicio" @click="seleccionarMicrociclo(i)">
                    {{ microciclo.semana }}
                </div>
            </div>
        </div>
        <div class="contenedor entrenamientos">
            <p> Dia de Microciclo </p>
            <div class="listado-items" v-if="indiceMicrocicloSeleccionado > -1">
                <div :class="i == indiceEntrenamientoSeleccionado ? 'calendario-entrenamiento seleccionado' : 'calendario-entrenamiento'"
                    v-for="(entrenamiento, i) in microciclo().entrenamientos"
                    :key="entrenamiento.dia"
                    @click="seleccionarEntrenamiento(i)">
                    {{ entrenamiento.dia }}
                </div>
            </div>
        </div>
        <div class="contenedor tabla-entrenamiento">
            <p>Entrenamiento del dia</p>
            <table v-if="indiceEntrenamientoSeleccionado > -1">
                <thead>
                    <tr class="cabezera">
                        <th class="cabezera-comienzo">Atleta</th>
                        <th v-for="l in obtenerArray1aN(entrenamiento().lapMaximo + 1)">
                            Lap {{l}}
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="contenedor atletas">
            <p>Atletas</p>
            <div class="botones">
                <button>C</button>
                <button>D</button>
            </div>
            <ul>

            </ul>
        </div>
        <div class="contenedor detalle-atletas">
            <p>Detalle atletas</p>
        </div>
    </div>
</template>

<style scoped>

p {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: #e0e0e0;
}

.main {
    background-color: #1e1e1e;
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    grid-template-rows: repeat(30, 1fr);
    min-height: 100vh;
}

.contenedor {
    background-color: #282828;
    border: 0.3vh solid #fff;
    padding: 0.1vh;
    border-radius: 8px;
}

.contenedor p {
    transform: translate(-0.1%,-60%);
}

.contenedor.mesociclos {
    grid-row: 1 / 14;
    grid-column: 1 / 6;
}

.contenedor.atletas {
    grid-row: 15 / 30;
    grid-column: 1 / 6;
}



.contenedor.mesociclos ul li {
    padding: 2vh;
}

.botones {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 2vh;
    gap: 1vh; /* Add gap for better spacing between buttons */
}

.botones button {
    width: 5vh; /* Increased button size for better touch targets */
    padding: 1vh; /* Add padding inside buttons */
    border: none; /* Remove default border */
    border-radius: 4px; /* Rounded corners */
    background-color: #606060; /* Button background color */
    color: #fff; /* Button text color */
    cursor: pointer; /* Change cursor to pointer */
    transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.botones button:hover {
    background-color: #808080; /* Lighter background on hover */
}

.ventana-crear-mesociclo {
    position: absolute;
    width: 40%;
    height: 35%;
    background-color: #505050;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-evenly;
    border: 0.3vh solid #000;
    border-radius: 8px; /* Rounded corners */
    padding: 2vh;
    transform: translate(90%, 70%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add shadow for better focus */
}

.ventana-crear-mesociclo button {
    align-self: center;
    margin-top: 1vh;
}

.cerrar-crear-mesociclo {
    position: absolute;
    right: 2vh;
    top: 2vh;
    cursor: pointer; /* Change cursor to pointer */
    color: #fff; /* White color for close button */
    font-size: 2vh; /* Increase font size */
}

.input-crear-mesociclo {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1vh; /* Increased margin for better spacing */
}

.input-crear-mesociclo label {
    margin-right: 1vh;
    color: #e0e0e0; /* Light text color for labels */
}

.seleccionado {
    font-weight: bold;
    color: #ffcc00; /* Highlight color for selected items */
}

.contenedor.microciclos {
    grid-row: 1 / 5;
    grid-column: 7 / 20;
}

.contenedor.entrenamientos {
    grid-row: 1 / 5;
    grid-column: 21 / 29;
}

.contenedor.detalle-atletas {
    grid-row: 17 / 30;
    grid-column: 7 / 29;
}

.contenedor p {
    margin-left: 1.5vh;
}

.listado-items {
    display: flex;
    flex-direction: row;
    gap: 2vh;
    margin: 2vh;
    flex-wrap: wrap;
    height: 10vh;
    overflow-y: scroll;
    scrollbar-width: thin; /* Thin scrollbar for better aesthetics */
    scrollbar-color: #606060 #282828; /* Custom scrollbar colors */
}

.listado-items::-webkit-scrollbar {
    width: 0.5em;
}

.listado-items::-webkit-scrollbar-track {
    background: #282828;
}

.listado-items::-webkit-scrollbar-thumb {
    background-color: #606060;
    border-radius: 10px;
    border: 3px solid #282828;
}

.calendario-microciclo,
.calendario-entrenamiento {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3c3c3c;
    border-radius: 4px; /* Rounded corners */
    color: #fff; /* White text color */
}

.calendario-microciclo {
    width: 5vh;
    height: 5vh;
}

.calendario-entrenamiento {
    width: 20vh;
    height: 5vh;
}

.contenedor.tabla-entrenamiento {
    grid-row: 6 / 16;
    grid-column: 7 / 29;
    overflow-x: scroll;
}

table {
    margin: 1vh;
}

tr {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 0.3vh solid #fff;
}

th {
    display: flex;
    width: 8vh;
    height: 5vh;
    align-items: center;
    justify-content: center;
    border: 0.1vh solid #fff;
}


</style>
