<script setup>

import { ref } from 'vue';
import {Atleta, Mesociclo} from './model'
import VentanaCreacionMesociclo from './components/VentanaCreacionMesociclo.vue'
import VentanaCreacionAtleta from './components/VentanaCreacionAtleta.vue'
import MenusMesociclos from './components/MenusMesociclos.vue'


const mesociclos = ref([]);
const atletas = ref([]);

const creandoMesociclo = ref(false);
const creandoAtleta = ref(false);


function empezarCreacionMesociclo() {
    creandoMesociclo.value = true;
    creandoAtleta.value = false;
}
function empezarCreacionAtleta() {
    creandoAtleta.value = true;
    creandoMesociclo.value = false;
}
function cerrarCreacionAtleta() {
    creandoAtleta.value = false;
}
function cerrarCreacionMesociclo() {
    creandoMesociclo.value = false;
}

function agregarAtleta(nombre, apellido, fechaNacimiento) {
    if (
        nombre &&
        apellido &&
        fechaNacimiento
    ) {
        atletas.value.push(new Atleta(nombre, apellido, fechaNacimiento));
        cerrarCreacionAtleta();
    }
}

function agregarMesociclo(nombre, fechaInicio, fechaFin) {
    if (
        nombre &&
        fechaInicio &&
        fechaFin &&
        fechaInicio < fechaFin
    ) {
        mesociclos.value.push(new Mesociclo(nombre, fechaInicio, fechaFin))
        cerrarCreacionMesociclo();
    }

}

function borrarMesociclo(idMesociclo){
    mesociclos.value = mesociclos.value.filter(mesociclo => mesociclo.id !== idMesociclo);
}



</script>

<template>
    <div class="main">
        <VentanaCreacionMesociclo v-if="creandoMesociclo" :agregar-mesociclo="agregarMesociclo"
            :cerrar-creacion-mesociclo="cerrarCreacionMesociclo"/>
        <VentanaCreacionAtleta v-if="creandoAtleta" :agregar-atleta="agregarAtleta"
            :cerrar-creacion-atleta="cerrarCreacionAtleta" />
        <MenusMesociclos :empezarCreacionMesociclo="empezarCreacionMesociclo" :listaMesociclos="mesociclos" :borrarMesociclo="borrarMesociclo"/>
    </div>
</template>


<style scoped>
@import url(App.css);
</style>
