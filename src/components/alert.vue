<script setup lang="ts">
import { useOptionsStore } from '../store/options'
import { useDataStore } from '../store/data'
import text from '../assets/styles/text.module.css'
import button from '../assets/styles/button.module.css'
import Alert from '../assets/icons/alert.vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const optionsStore = useOptionsStore()
const dataStore = useDataStore()

let { errors }: any = storeToRefs(dataStore)

// location not available, user has not denied access & no errors have occurred fetching
let shouldPromptForLocation = computed(() => {
	return (
		!optionsStore.position.declined &&
		(!dataStore.position.latitude || !dataStore.position.longitude) &&
		!dataStore.position.fetching &&
		errors.value.location === ''
	)
})

// error fetching location or weather data. only show if error has blocked successful data fetch
let shouldPromptWithError = computed(() => {
	return (
		(!dataStore.position.latitude ||
			!dataStore.position.longitude ||
			!dataStore.weather?.weather) &&
		(errors.value.weather !== '' || errors.value.location !== '')
	)
})

let enablePrompt = computed(() => {
	return (
		dataStore.init &&
		optionsStore.init &&
		!dataStore.position.fetching &&
		(shouldPromptForLocation.value || shouldPromptWithError.value)
	)
})

function handleDecline() {
	optionsStore.$patch({
		position: { declined: true },
	})
	dataStore.errors.weather = ''
	dataStore.errors.location = ''
}
</script>

<template>
	<transition name="prompt">
		<div v-if="enablePrompt" class="prompt">
			<div class="row">
				<div class="alert-container" style="margin-right: var(--space-small)">
					<Alert style="width: 24px; height: 24px; color: var(--theme-fg)" />
				</div>

				<p :class="text.label">
					{{
						shouldPromptForLocation
							? 'Lavender needs permission to fetch your location.'
							: 'Error fetching location or weather data.'
					}}
				</p>
			</div>

			<p :class="text.base" style="padding-left: 38px">
				{{
					shouldPromptForLocation
						? 'Location is used to fetch local weather data. You can always enable this later in options.'
						: `There's been an error (${errors.location.toLowerCase() || errors.weather.toLowerCase() || 'unknown error'}).
				Please check your browser settings and try again.`
				}}
			</p>
			<div class="space-small"></div>
			<div class="row" style="justify-content: center; gap: 14px">
				<button :class="button.primary" @click="dataStore.handleInitialFetch()">
					{{ shouldPromptForLocation ? 'Fetch location' : 'Try again' }}
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
.prompt {
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
