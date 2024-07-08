<script setup>

import { ref } from 'vue';
import { obtenerArray1aN } from '@/Utils';
import { defineProps } from 'vue';

const props = defineProps(['empezarCreacionMesociclo', 'listaMesociclos', 'borrarMesociclo']);

const anioMesociclo = ref(new Date().getFullYear());

const idMesociclo = ref(null);
const idMicrociclo = ref(null);
const idEntrenamiento = ref(null);

function mesocicloSeleccionado() {
	for (let i = 0; i < props.listaMesociclos.length; i++) {
		if (props.listaMesociclos[i].id === idMesociclo.value) {
			return props.listaMesociclos[i];
		}
	}
}

function listaMicrociclos() {
	return mesocicloSeleccionado().microciclos;
}

function microcicloEstaSeleccionado(microciclo) {
	return idMicrociclo.value === microciclo.id;
}

function seleccionarMicrociclo(microciclo) {
	idMicrociclo.value = microciclo.id;
}

function hayMesocicloSeleccionado() {
	return idMesociclo.value != null;
}

function hayMicrocicloSeleccionado() {
	return idMicrociclo.value != null;
}

function hayEntrenamientoSeleccionado() {
	return idEntrenamiento.value != null;
}

function entrenamientoSeleccionado() {
	return mesocicloSeleccionado().microcicloPorID(idMicrociclo.value).entrenamientoPorID(idEntrenamiento.value);
}

function listaEntrenamientos() {
	return mesocicloSeleccionado().microcicloPorID(idMicrociclo.value).entrenamientos;
}

function seleccionarMesociclo(mesociclo) {
	idMesociclo.value = mesociclo.id;
	idMicrociclo.value = null;
	idEntrenamiento.value = null;
}

function borrarMesocicloSeleccionado(){
	if(!hayMesocicloSeleccionado()) return;
	const idABorrar = mesocicloSeleccionado().id;
	idMesociclo.value = null;
	idMicrociclo.value = null;
	idEntrenamiento.value = null;;
	props.borrarMesociclo(idABorrar);	

}


</script>

<template>
	<div class="contenedor mesociclos">
		<p>Mesociclos</p>
		<input type="number" :min="new Date().getFullYear() - 2" :max="new Date().getFullYear() + 10"
			v-model="anioMesociclo"> </input>
		<div class="botones">
			<button @click="empezarCreacionMesociclo">C</button>
			<button @click="borrarMesocicloSeleccionado">D</button>
		</div>
		<ul>
			<li :class="mesociclo.id === idMesociclo ? 'seleccionado' : ''" v-for="(mesociclo) in listaMesociclos.filter((mesociclo) => mesociclo.fechaInicio.getFullYear() === anioMesociclo)"
				:key="mesociclo.id" @click="seleccionarMesociclo(mesociclo)">
				{{ mesociclo.nombre }}
			</li>
		</ul>
	</div>
	<div class="contenedor microciclos">
		<p> Microciclo de Mesociclo </p>
		<div class="listado-items" v-if="hayMesocicloSeleccionado()">
			<div :class="microcicloEstaSeleccionado(microciclo) ? 'calendario-microciclo seleccionado' : 'calendario-microciclo'"
				v-for="(microciclo) in listaMicrociclos()"
				:key="microciclo.id" @click="seleccionarMicrociclo(microciclo)">
				{{ microciclo.semana }}
			</div>
		</div>
	</div>
	<div class="contenedor entrenamientos">
		<p> Dia de Microciclo </p>
		<div class="listado-items" v-if="hayMicrocicloSeleccionado()">
			<div :class="entrenamientoSeleccionado(entrenamiento) ? 'calendario-entrenamiento seleccionado' : 'calendario-entrenamiento'"
				v-for="(entrenamiento) in listaEntrenamientos()" :key="entrenamiento.id"
				@click="idEntrenamiento = entrenamiento.id">
				{{ entrenamiento.dia() }}
			</div>
		</div>
	</div>
	<div class="contenedor tabla-entrenamiento">
		<p>Entrenamiento del dia</p>
		<table v-if="hayEntrenamientoSeleccionado()">
			<thead>
				<tr class="cabezera">
					<th class="cabezera-comienzo">Atleta</th>
					<th v-for="l in obtenerArray1aN(entrenamientoSeleccionado().lapMaximo + 1)">
						Lap {{ l }}
					</th>
				</tr>
			</thead>
		</table>
	</div>
</template>

<style lang="css">
@import url('../App.css');
</style>