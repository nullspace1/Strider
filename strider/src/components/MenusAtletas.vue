<script setup>

import { defineProps } from 'vue';

defineProps(['empezarCreacionAtleta','listaAtletas']);

</script>

<template>
	<div class="contenedor atletas">
		<p>Atletas</p>
		<div class="botones">
			<button @click="props.empezarCreacionAtleta">C</button>
			<button>D</button>
		</div>
		<ul>
			<li :class="atletaEstaSeleccionado(id) ? 'seleccionado' : ''" v-for="(atleta, id) in listaAtletas"
				:key="atleta.nombre" @click="seleccionarAtleta(id)">
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
