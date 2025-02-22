<script setup lang="ts">
import { useDataStore } from '../store/data'
import text from '../assets/styles/text.module.css'

const dataStore = useDataStore()
</script>

<template>
	<div v-if="dataStore.weather?.timestamp" class="wrapper">
		<div class="weather-items">
			<p class="temp" :class="text.detail">
				{{ dataStore.formattedTemp }} degrees
			</p>
			<div class="wi-bg">
				<i :class="dataStore.weatherIconClass" />
			</div>
			<p class="conditions" :class="text.detail">
				{{ dataStore.weatherConditions }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	grid-area: bottom;
	text-align: center;
	user-select: none;
	-webkit-user-select: none; /* Safari */
	-webkit-touch-callout: none; /* iOS Safari */
	cursor: default; /* prevents text cursor in Safari */
}

.wi {
	font-size: var(--text-large);
	color: var(--theme-fg);
	background-color: transparent;
	height: var(--space-large);
	width: var(--space-large);
	border-radius: var(--rounded-full);
	line-height: 64px;
}

.weather-items {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 8px;
	align-items: center;
}

.temp {
	grid-column: 1;
	justify-self: right;
}

.wi-bg {
	display: flex;
	grid-column: 2;
	justify-self: center;
}

.conditions {
	grid-column: 3;
	justify-self: left;
}

.location-prompt {
	position: fixed;
	top: var(--page-padding);
	left: 50%;
	margin-left: -160px;
	background-color: var(--ui-bg);
	color: var(--ui-fg);
	padding: var(--space-small);
	border-radius: var(--rounded);
	border: var(--border);
	width: 320px;
}

.prompt-enter-active,
.prompt-leave-active {
	transition: var(--transition-motion);
}

.prompt-enter-from,
.prompt-leave-to {
	opacity: 0;
	top: -20%;
}

.prompt-enter-to,
.prompt-leave-from {
	opacity: 1;
	top: var(--page-padding);
}

.alert-container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: var(--rounded-full);
	background-color: var(--theme-bg);
}
</style>
