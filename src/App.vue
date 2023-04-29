<script setup>
import Weather from './components/weather.vue'
import Options from './components/options.vue'
import Clock from './components/clock.vue'
import store from '@/store'
import { onBeforeUnmount, computed } from 'vue'
import './assets/styles/normalize.css'
import './assets/styles/weather-icons.min.css'
import './assets/styles/global.css'

store.commit('initializeStore')
let storeInitialized = computed(() => store.state.init)

store.subscribe((_, state) => {
	if (state.init)
		chrome.storage.sync.set({
			...state,
			lastSynced: Date.now(),
		})
})

onBeforeUnmount(() => {
	store.unsubscribe()
})
</script>

<template>
	<div class="app-wrapper">
		<Clock v-if="storeInitialized" />
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
