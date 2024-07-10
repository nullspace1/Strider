<script setup>

import { ref } from 'vue';
import {Atleta, Mesociclo} from './model'
import VentanaCreacionMesociclo from './components/VentanaCreacionMesociclo.vue'
import VentanaCreacionAtleta from './components/VentanaCreacionAtleta.vue'
import MenusMesociclos from './components/MenusMesociclos.vue'
import MenusAtletas from './components/MenusAtletas.vue';


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

function agregarAtleta(nombre, apellido, fechaNacimiento, altura, peso, sexo, ubicacion, fechaComienzo) {
    if (
        nombre &&
        apellido &&
        fechaNacimiento &&
        altura &&
        peso &&
        sexo &&
        ubicacion &&
        fechaComienzo
    ) {
        atletas.value.push(new Atleta(nombre, apellido, fechaNacimiento, altura, peso, sexo, ubicacion, fechaComienzo));
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

function borrarAtleta(idAtleta){
    atletas.value = atletas.value.filter(atleta => atleta.id !== idAtleta);
}



</script>

<template>
    <div class="main">
        <VentanaCreacionMesociclo v-if="creandoMesociclo" :agregar-mesociclo="agregarMesociclo"
            :cerrar-creacion-mesociclo="cerrarCreacionMesociclo"/>
        <VentanaCreacionAtleta v-if="creandoAtleta" :agregarAtleta="agregarAtleta"
            :cerrarCreacionAtleta="cerrarCreacionAtleta" />
        <MenusMesociclos :empezarCreacionMesociclo="empezarCreacionMesociclo" :listaMesociclos="mesociclos" :borrarMesociclo="borrarMesociclo"/>
        <MenusAtletas :borrarAtleta="borrarAtleta" :empezarCreacionAtleta="empezarCreacionAtleta" :listaAtletas="atletas"/>
    </div>
</template>


<style scoped>
@import url(App.css);
</style>
