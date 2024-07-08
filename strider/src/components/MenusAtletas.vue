<script setup>

import { defineProps, ref } from 'vue';

const props = defineProps(['borrarAtleta','empezarCreacionAtleta','listaAtletas']);

const idAtleta = ref(null);

function atletaEstaSeleccionado(atleta) {
	return idAtleta.value === atleta.id;
}

function seleccionarAtleta(atleta) {
	idAtleta.value = atleta.id;
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
			<li :class="atletaEstaSeleccionado(atleta) ? 'seleccionado' : ''" v-for="(atleta) in listaAtletas"
				:key="atleta.nombre" @click="seleccionarAtleta(atleta)">
				{{atleta.nombre }}
			</li>
		</ul>
	</div>
	<div class="contenedor detalle-atletas">
		<p>Detalle atletas</p>
		<div v-if="hayAtletaSeleccionado()">
			<h1>{{atletaSeleccionado().nombre}}</h1>
		</div>
	</div>
</template>

<style lang="css">
@import url(../App.css);
</style>
