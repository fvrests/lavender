<script setup lang="ts">
import Weather from './components/weather.vue'
import Options from './components/options.vue'
import Clock from './components/clock.vue'
import './assets/styles/normalize.css'
import './assets/styles/weather-icons.min.css'
import './assets/styles/global.css'
import { useOptionsStore } from './store/options'
import { useDataStore } from './store/data'

let optionsStore = useOptionsStore()
let dataStore = useDataStore()

optionsStore.initialize()
dataStore.initialize()

// todo: remove if not using
// fix: prevent multiple instances from accessing weather API
// or: use external API to prevent API key logging & keep track of requests per minute (firebase etc)
// const channel = new BroadcastChannel('tab')
//
// channel.postMessage('another-tab')
// // note that listener is added after posting the message
//
// channel.addEventListener('message', (msg) => {
// 	if (msg.data === 'another-tab') {
// 		// message received from 2nd tab
// 		alert('Cannot open multiple instances')
// 		// do something
// 	}
// })
</script>

<template>
	<div class="app-wrapper">
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
	padding: var(--space-medium);
}
</style>
