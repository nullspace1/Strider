<script setup>

import { defineProps, ref } from 'vue';

const props = defineProps(['borrarAtleta', 'empezarCreacionAtleta', 'listaAtletas']);

const idAtleta = ref(null);
const indiceLista = ref(-1);

function atletaEstaSeleccionado(atleta) {
	return idAtleta.value === atleta.id;
}

function seleccionarAtleta(atleta, i) {
	idAtleta.value = atleta.id;
	indiceLista.value = i;
}

function hayAtletaSeleccionado() {
	return idAtleta.value != null;
}

function atletaSeleccionado() {
	for (let i = 0; i < props.listaAtletas.length; i++) {
		if (props.listaAtletas[i].id === idAtleta.value) {
			return props.listaAtletas[i];
		}
	}

}

function borrarAtletaSeleccionado() {
	props.borrarAtleta(idAtleta.value);
	idAtleta.value = null;
	indiceLista.value = -1;
}

const minutos = ref({
	ritmoMaximo: -1,
	ritmoFondo: -1
});
const segundos = ref({
	ritmoMaximo: -1,
	ritmoFondo: -1
});



function minutoDe(segundos) {
	return Math.floor(segundos / 60);
}

function segundoDe(segundos) {
	return Math.floor(segundos % 60);
}

function cambiarMinutos(mins, campo) {
	minutos.value[campo] = parseInt(mins, 10);
	cambiarTiempoAtleta(campo);
}

function cambiarSegundos(segs, campo) {
	segundos.value[campo] = parseInt(segs, 10);
	cambiarTiempoAtleta(campo);
}

function cambiarTiempoAtleta(campo) {
	if (segundos.value[campo] < 0) {
		segundos.value[campo] = segundoDe(atletaSeleccionado()[campo]);
	}
	if (minutos.value[campo] < 0) {
		minutos.value[campo] = minutoDe(atletaSeleccionado()[campo]);
	}
	props.listaAtletas[indiceLista.value][campo] = (minutos.value[campo]) * 60 + segundos.value[campo];
}

function padZero(num) {
	return num.toString().padStart(2, '0');
}
</script>

<template>
	<div class="contenedor atletas">
		<p>Atletas</p>
		<div class="botones">
			<button @click="empezarCreacionAtleta">C</button>
			<button @click="borrarAtletaSeleccionado">D</button>
		</div>
		<ul>
			<li :class="atletaEstaSeleccionado(atleta) ? 'seleccionado' : ''" v-for="(atleta, i) in listaAtletas"
				:key="atleta.nombre" @click="seleccionarAtleta(atleta, i)">
				{{ atleta.nombre }}
			</li>
		</ul>
	</div>
	<div class="contenedor detalle-atletas">
		<p>Detalle atletas</p>
		<div v-if="hayAtletaSeleccionado()" class="info-atleta">
			<h1>{{ atletaSeleccionado().nombre + ' ' + atletaSeleccionado().apellido }}</h1>
			<div class="info-general">
				<h2>Información General</h2>
				<p><b>Edad:</b> {{ atletaSeleccionado().getEdad() }}</p>
				<p><b>Fecha de Nacimiento:</b> {{ atletaSeleccionado().fechaNacimiento }}</p>
				<p><b>Altura:</b> {{ atletaSeleccionado().altura }}</p>
				<p><b>Peso:</b> {{ atletaSeleccionado().peso }}</p>
				<p><b>Sexo:</b> {{ atletaSeleccionado().sexo }}</p>
				<p><b>Ubicación:</b> {{ atletaSeleccionado().ubicacion }}</p>
			</div>
			<div v-if="atletaSeleccionado()" class="info-estadisticas">
				<h2>Estadísticas</h2>
				<p><b>Años de Entrenamiento:</b> {{ atletaSeleccionado().getAniosDeEntrenamiento() || 'N/A' }}</p>
				<p><b>Ritmo 100%:</b>
					<input min="0" type="number" :value="padZero(minutoDe(atletaSeleccionado().ritmoMaximo))"
						@input="cambiarMinutos($event.target.value, 'ritmoMaximo')"> :
					<input min="0" type="number" :value="padZero(segundoDe(atletaSeleccionado().ritmoMaximo))"
						@input="cambiarSegundos($event.target.value, 'ritmoMaximo')">
				</p>
				<p><b>Ritmo 80%:</b>
					{{ padZero(minutoDe(atletaSeleccionado().ritmoMaximo / 0.8)) + ':' +
						padZero(segundoDe(atletaSeleccionado().ritmoMaximo / 0.8))}}
				</p>
				<p><b>Ritmo Fondo:</b>
					<input type="number"
						:value="padZero(minutoDe(atletaSeleccionado().ritmoFondo))"
						@change="cambiarMinutos($event.target.value, 'ritmoFondo')"> :
					<input type="number"
						:value="padZero(segundoDe(atletaSeleccionado().ritmoFondo))"
						@change="cambiarSegundos($event.target.value, 'ritmoFondo')">
				</p>
			</div>
		</div>
	</div>
</template>

<style lang="css">
@import url(../App.css);
</style>
