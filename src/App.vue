<script setup lang="ts">
import Weather from './components/weather.vue'
import Options from './components/options.vue'
import Clock from './components/clock.vue'
import './assets/styles/normalize.css'
import './assets/styles/weather-icons.min.css'
import './assets/styles/global.css'
import { useOptionsStore } from './store/options'
import { useDataStore } from './store/data'
import Alert from './components/alert.vue'

let optionsStore = useOptionsStore()
let dataStore = useDataStore()

optionsStore.initialize()
dataStore.initialize()
</script>

<template>
	<div class="app-wrapper">
		<Alert />
		<Clock v-if="optionsStore.init && dataStore.init" />
		<Weather />
		<Options />
	</div>
</template>

<style scoped>
.app-wrapper {
	display: grid;
	grid-template-areas:
		'top top top'
		'left middle right'
		'bottom bottom bottom';
	justify-items: center;
	align-items: center;
	min-height: 100vh;
	min-height: 100dvh;
	padding: var(--space-medium);
}
</style>
