<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['cerrarCreacionAtleta', 'agregarAtleta']);
const nuevoAtleta = ref({
	nombre: '',
	apellido: '',
	fechaNacimiento: ''
})

function completarCreacionAtleta() {
	props.agregarAtleta(nuevoAtleta.value.nombre, nuevoAtleta.value.apellido,nuevoAtleta.value.fechaNacimiento);
	nuevoAtleta.value = {
		nombre: '',
		apellido: '',
		fechaNacimiento: ''
	}
	props.cerrarCreacionAtleta();
}


</script>

<template>
	<div class="ventana">
		<p> Nuevo Atleta </p>
		<button class="cerrar" @click="cerrarCreacionAtleta">X</button>
		<div class="input">
			<label>Nombre</label>
			<input type="text" v-model="nuevoAtleta.nombre" />
		</div>
		<div class="input">
			<label>Apellido</label>
			<input type="text" v-model="nuevoAtleta.apellido" />
		</div>
		<div class="input">
			<label>Fecha de Nacimiento</label>
			<input type="date" v-model="nuevoAtleta.fechaNacimiento" />
		</div>
		<button @click="completarCreacionAtleta()">Crear</button>
	</div>
</template>

<style lang="css">
@import url('../App.css');
</style>
