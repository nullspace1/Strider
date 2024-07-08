<script setup>
import {ref, defineProps} from 'vue'

const props = defineProps(['cerrarCreacionMesociclo', 'agregarMesociclo']);

const nuevoMesociclo = ref({
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
});

</script>

<template>
	<div class="ventana">
	            <p> Nuevo Mesociclo </p>
	            <button class="cerrar" @click="cerrarCreacionMesociclo">X</button>
	            <div class="input">
	                <label>Nombre</label>
	                <input type="text" v-model="nuevoMesociclo.nombre" />
	            </div>
	            <div class="input">
	                <label>Fecha de Inicio</label>
	                <input type="date" v-model="nuevoMesociclo.fechaInicio" />
	            </div>
	            <div class="input">
	                <label>Fecha de Finalización</label>
	                <input type="date" v-model="nuevoMesociclo.fechaFin" />
	            </div>
	            <button @click="agregarMesociclo(nuevoMesociclo.nombre, nuevoMesociclo.fechaInicio, nuevoMesociclo.fechaFin)">Crear</button>
	        </div>
</template>

<style lang="css">
@import url('../App.css');
</style>