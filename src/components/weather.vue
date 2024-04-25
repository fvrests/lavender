<script setup lang="ts">
import { useOptionsStore } from '../store/options'
import { useDataStore } from '../store/data'
import text from '../assets/styles/text.module.css'
import button from '../assets/styles/button.module.css'
import Alert from '../assets/icons/alert.vue'

const optionsStore = useOptionsStore()
const dataStore = useDataStore()

function handleDecline() {
	optionsStore.$patch({
		position: { declined: true },
	})
}
</script>

<!--todo: EITHER check for focused tab before requesting (prevent inactive tabs / windows from refreshing) or add external API to keep track of requests per minute (firebase etc)-->
<template>
	<div v-if="dataStore.weather?.timestamp" class="wrapper">
		<div class="weather-items">
			<p class="temp" :class="text.subtitle">
				{{ dataStore.formattedTemp }} degrees
			</p>
			<div class="wi-bg">
				<i :class="dataStore.weatherIconClass" />
			</div>
			<p class="conditions" :class="text.subtitle">
				{{ dataStore.weatherConditions }}
			</p>
		</div>
	</div>
	<transition name="prompt">
		<div
			v-if="
				dataStore.init &&
				optionsStore.init &&
				!dataStore.position.latitude &&
				!dataStore.position.fetching &&
				!optionsStore.position.declined
			"
			class="location-prompt"
		>
			<div class="row">
				<div class="alert-container" style="margin-right: var(--space-small)">
					<Alert style="width: 24px; height: 24px; color: var(--theme-fg)" />
				</div>

				<p :class="text.label">
					{{
						!dataStore.errors.location
							? 'Lavender needs permission to fetch your location.'
							: 'Error fetching location.'
					}}
				</p>
			</div>

			<!--todo: consider adding custom error messages-->
			<p :class="text.base" style="padding-left: 38px">
				{{
					!dataStore.errors.location
						? 'Location is used to fetch local weather data. You can always enable this later in options.'
						: `There's been an error (${dataStore.errors.location.toLowerCase()}). Please check your browser settings and try again.`
				}}
			</p>
			<div class="space-small"></div>
			<div class="row" style="justify-content: center; gap: 14px">
				<button :class="button.primary" @click="dataStore.handleInitialFetch()">
					{{ !dataStore.errors.location ? 'Fetch location' : 'Try again' }}
				</button>
				<div>
					<!--todo: look at bottom padding / gap -- too big compared to other secondary buttons?  -->
					<button :class="button.secondary" @click="handleDecline">
						Not now
					</button>
				</div>
			</div>
			<div class="space-small" />
		</div>
	</transition>
</template>

<style scoped>
.wrapper {
	grid-area: bottom;
	text-align: center;
}

.wi {
	font-size: var(--text-large);
	color: var(--theme-fg);
	background-color: var(--theme-bg);
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
	z-index: 10;
	background-color: var(--ui-bg);
	color: var(--ui-fg);
	padding: var(--space-small);
	border-radius: var(--rounded);
	border: var(--border);
	width: 320px;
}

.prompt-enter-active,
.prompt-leave-active {
	transition: ease-in-out all 200ms;
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
