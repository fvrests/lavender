<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../assets/icons/icon.vue'
import button from '../assets/styles/button.module.css'
import text from '../assets/styles/text.module.css'
import { useDataStore } from '../store/data'
import { useInstanceStore } from '../store/instance'
import { useOptionsStore } from '../store/options'
import { isColorDark } from '../utils/helpers'
import ExternalLink from './external-link.vue'
import OptionToggle from './option-toggle.vue'
import RadioGroup from './radio-group.vue'
import ThemeSelect from './theme-select.vue'

const dataStore = useDataStore()
const optionsStore = useOptionsStore()
const instanceStore = useInstanceStore()
let isOptionsOpen = ref(false)
let refreshDisabled = ref(false)

let themes = ['lavender', 'rose', 'lemon', 'sea', 'leaf', 'sand']

function toggleOptionsMenu() {
	isOptionsOpen.value = !isOptionsOpen.value
}

const isCustomColorDark = computed(() =>
	isColorDark(optionsStore.theme.customColor),
)
const customColorScheme = computed(() =>
	isCustomColorDark.value ? 'custom-dark' : 'custom',
)

function handleCustomColorChange(e: Event) {
	const target = e.target as HTMLInputElement
	let color = target.value
	if (color && !color.startsWith('#')) {
		color = '#' + color
	}

	if (
		color.length > 1 &&
		color.at(0) === '#' &&
		!/^#([0-9A-F]{3}){1,2}$/i.test(color)
	) {
		return
	}

	optionsStore.setCustomColor(color)
}

function handleFetch() {
	refreshDisabled.value = true
	optionsStore.$patch({
		position: { declined: false },
	})
	dataStore.handleInitialFetch().catch((error) => {
		console.error(error)
	})
	setTimeout(function () {
		refreshDisabled.value = false
	}, 15 * 1000)
}
function handleClearData() {
	instanceStore.clearData(true)
	isOptionsOpen.value = false
}
</script>

<template>
	<!-- todo: consider updating typography-->
	<!-- todo: consider adding font selection (sans serif, mono) -->
	<div class="options" @keyup.esc="isOptionsOpen = false">
		<button
			:class="{ open: isOptionsOpen }"
			class="options-button"
			@click="toggleOptionsMenu"
		>
			<Icon class="options-icon" />
		</button>
		<div v-if="isOptionsOpen" class="overlay" @click="toggleOptionsMenu" />
		<transition name="optionsMenu">
			<div v-show="isOptionsOpen" class="options-menu" role="menu">
				<div :class="text.title">Options</div>

				<div :class="text.subtitle">Theme</div>

				<div style="padding: 6px 0px">
					<div :class="text.label">Lavender collection</div>
					<div class="space-xsmall" />
					<ul class="theme-list">
						<li v-for="theme in themes">
							<ThemeSelect :theme="theme" :colors="[theme]" />
						</li>
					</ul>
					<div class="space-xsmall" />
					<div :class="text.label">Nightshade collection</div>
					<div class="space-xsmall" />
					<ul class="theme-list">
						<li v-for="theme in themes">
							<ThemeSelect
								:theme="theme + '-dark'"
								:colors="[theme + '-dark']"
								dark
							/>
						</li>
					</ul>
					<div class="space-xsmall" />
					<div :class="text.label">Responsive (follow system theme)</div>
					<div class="space-xsmall" />
					<ul class="theme-list">
						<li v-for="theme in themes">
							<ThemeSelect
								:theme="theme + '-system'"
								split
								:colors="[theme, `${theme}-dark`]"
								dark
							/>
						</li>
					</ul>
					<div class="space-xsmall" />
					<div :class="text.label">Custom</div>
					<div class="space-xsmall" />
					<ul class="custom-theme-menu">
						<ThemeSelect
							:theme="customColorScheme"
							:dark="isCustomColorDark"
							:colors="['custom', 'custom-dark']"
						/>
						<input
							type="text"
							:value="optionsStore.theme.customColor"
							@input="handleCustomColorChange"
							placeholder="#3a3441"
							maxlength="7"
							:class="text.title"
						/>
					</ul>
				</div>

				<div class="divider" />

				<div :class="text.subtitle">Time</div>
				<div :class="text.label">Layout:</div>
				<RadioGroup option="time.layout" :choices="['default', 'stacked']">
					<template #default>
						<div class="time">
							<div>9:41</div>
						</div>
					</template>

					<template #stacked>
						<div class="time">
							<div class="outline">
								<div :class="text.monospaced">
									<span>0</span>
									<span>9</span>
								</div>
								<div :class="text.monospaced">
									<span>4</span>
									<span>1</span>
								</div>
							</div>
						</div>
					</template>
				</RadioGroup>

				<OptionToggle
					option="time.use24Hour"
					label="24-hour format"
					role="menuitem"
				/>

				<div class="divider" />

				<div :class="text.subtitle">Weather</div>
				<OptionToggle option="weather.useCelsius" label="Celsius" />
				<OptionToggle option="weather.descriptive" label="Precise conditions" />

				<div class="row">
					<div :class="text.base">Source:</div>
					<ExternalLink url="https://openweathermap.org"
						>OpenWeather</ExternalLink
					>
				</div>

				<div class="divider" />

				<div :class="text.subtitle">Location</div>

				<div v-if="dataStore.weather?.timestamp" class="row separated">
					<div v-if="dataStore.position.fetching == false" :class="text.label">
						{{ dataStore.weather?.name }},
						{{ dataStore.weather?.sys.country }}
					</div>
					<div v-else :class="text.label">Fetching...</div>
					<div>
						<button
							:class="button.primary"
							style="margin: 0 auto"
							:disabled="refreshDisabled"
							@click="handleFetch()"
						>
							{{ !refreshDisabled ? 'Refresh' : 'Please wait 15s' }}
						</button>
					</div>
				</div>
				<div v-else>
					<div class="row separated">
						<div :class="text.label">
							{{
								!dataStore.position.fetching
									? 'Location disabled.'
									: 'Fetching...'
							}}
						</div>
						<div>
							<button
								:class="button.primary"
								style="margin: 0 auto"
								@click="handleFetch()"
							>
								Enable
							</button>
						</div>
					</div>

					<div :class="text.base">
						Lavender will never access your location without your permission.
						Please click 'enable' to allow location access.
					</div>
				</div>

				<div class="divider" />

				<div v-if="optionsStore.init && dataStore.isChromeExtension">
					<div :class="text.subtitle">Data sync</div>

					<OptionToggle
						option="useChromeStorage"
						label="Sync with Chrome"
						role="menuitem"
						:onChange="
							() =>
								!optionsStore.useChromeStorage &&
								optionsStore.readChromeStorage()
						"
					/>
					<div :class="text.base">
						Persist options across your Chrome browsers (overrides your current
						options). Your location is not synced and will remain on-device.
					</div>
					<div class="divider" />
				</div>
				<div>
					<div :class="text.subtitle">Reset data</div>
					<div :class="text.base">
						Erase everything, including location and weather data, and restore
						default options.
					</div>
					<div class="row separated">
						<button :class="button.tertiary" @click="handleClearData">
							Reset all data
						</button>
					</div>
					<div class="divider" />
				</div>

				<div class="row even">
					<ExternalLink
						url="https://github.com/fvrests/lavender/blob/main/privacy-policy.md"
						>Privacy Policy
					</ExternalLink>
					<ExternalLink
						url="https://github.com/fvrests/lavender/blob/main/terms-of-use.md"
						>Terms of Use</ExternalLink
					>
				</div>

				<div class="space-small" />

				<div class="row even">
					<ExternalLink url="https://fvrests.dev" :underline="true"
						>fvrests</ExternalLink
					>

					<ExternalLink url="https://ko-fi.com/fvrests" :underline="true"
						>donate ♥</ExternalLink
					>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.options {
	position: fixed;
	top: var(--page-padding);
	right: var(--page-padding);
	bottom: var(--page-padding);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.options-menu {
	--_space-around: var(--page-padding);
	--_space-around-bottom: calc(
		var(--_space-around) + 36px + var(--space-small)
	);

	margin-top: var(--_space-around);
	color: var(--ui-fg);
	position: fixed;
	right: var(--page-padding);
	bottom: var(--_space-around-bottom);
	z-index: 10;
	max-width: 320px;
	padding: var(--space-medium);
	width: 100%;
	height: 640px;
	max-height: calc(100vh - var(--_space-around) - var(--_space-around-bottom));
	background: var(--ui-bg);
	border: var(--border);
	border-radius: var(--rounded);
	overflow-y: auto;
}

.options-button {
	width: 36px;
	height: 36px;
	background: transparent;
	position: fixed;
	bottom: var(--page-padding);
	right: var(--page-padding);
	color: var(--theme-fg);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--rounded-full);
	user-select: none;
}

.options-button:hover,
.options-button:focus {
	color: var(--ui-fg);
	background-color: var(--ui-bg);
	border: 2px solid var(--ui-fg);
}

.options-button:focus {
	outline: none;
}

.options-icon {
	width: 20px;
	height: 20px;
}

.optionsMenu-enter-active,
.optionsMenu-leave-active {
	transition: ease-in-out all 100ms;
}

.optionsMenu-enter-from,
.optionsMenu-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

.overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: transparent;
	z-index: 9;
}

.time {
	font-size: 24px;
	line-height: 24px;
	font-weight: bold;
	color: var(--theme-fg);
}

.outline {
	border: 2px solid var(--theme-fg);
	padding: 4px;
}

.custom-theme-menu {
	display: flex;
	align-items: center;
	gap: var(--space-xsmall);
}

input {
	width: 100%;
	height: 30px;
	border: var(--border);
	border-radius: var(--rounded-full);
	padding: 0 var(--space-xsmall);
}

input:focus {
	outline: none;
	box-shadow: var(--ui-focus-box);
}

.theme-list {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
}

.theme-list > * {
	margin-right: auto;
	display: inline-flex;
}
</style>
