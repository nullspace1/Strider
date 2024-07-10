<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['cerrarCreacionAtleta', 'agregarAtleta']);
const nuevoAtleta = ref({
	nombre: '',
	apellido: '',
	fechaNacimiento: '',
	altura: 0,
	peso: 0,
	sexo: '',
	ubicacion: '',
	fechaComienzo: '',
})

function completarCreacionAtleta() {
	props.agregarAtleta(
		nuevoAtleta.value.nombre,
		nuevoAtleta.value.apellido,
		nuevoAtleta.value.fechaNacimiento,
		nuevoAtleta.value.altura,
		nuevoAtleta.value.peso,
		nuevoAtleta.value.sexo,
		nuevoAtleta.value.ubicacion,
	nuevoAtleta.value.fechaComienzo);

	nuevoAtleta.value = {
		nombre: '',
		apellido: '',
		fechaNacimiento: '',
		altura: 0,
		peso: 0,
		sexo: '',
		ubicacion: '',
		fechaComienzo: '',
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
		<div class="input">
			<label>Altura (cm)</label>
			<input type="number" min="0" max="250" v-model="nuevoAtleta.altura" />
		</div>
		<div class="input">
			<label>Peso (kg)</label>
			<input type="number" min="0" max="250" v-model="nuevoAtleta.peso" />
		</div>
		<div class="input">
			<label>Sexo</label>
			<select v-model="nuevoAtleta.sexo">
				<option value="Masculino">Masculino</option>
				<option value="Femenino">Femenino</option>
			</select>
		</div>
		<div class="input">
			<label>Fecha de Comienzo</label>
			<input type="date" v-model="nuevoAtleta.fechaComienzo" />
		</div>
		<div class="input">
			<label>Ubicacion</label>
			<input type="text" v-model="nuevoAtleta.ubicacion" />
		</div>
		<button @click="completarCreacionAtleta()">Crear</button>
	</div>
</template>

<style lang="css">
@import url('../App.css');
</style>
