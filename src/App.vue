<script setup lang="ts">
import Weather from './components/weather.vue'
import Options from './components/options.vue'
import Clock from './components/clock.vue'
import './assets/styles/normalize.css'
import './assets/styles/weather-icons.min.css'
import './assets/styles/global.css'

// fix: remove if not needed, ensure functionality -- maybe contain in main.js
import { useOptionsStore } from './store/options'
let optionsStore = useOptionsStore()
optionsStore.initializeStore()

// fix: doesn't set into chrome storage?
// optionsStore.$subscribe((_, state) => {
// 	if (state.init)
// 		chrome.storage.sync.set({
// 			...state,
// 			lastSynced: Date.now(),
// 		})
// fix: ? - updating state every second as time changes
// console.log('sync set', state)
// })
</script>

<template>
	<div class="app-wrapper">
		<Clock v-if="optionsStore.init" />
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
