<script setup lang="ts">
import Icon from '../assets/icons/icon.vue'
import OptionToggle from './option-toggle.vue'
import RadioGroup from './radio-group.vue'
import ExternalLink from './external-link.vue'
import ThemeSelect from './theme-select.vue'
import button from '../assets/styles/button.module.css'
import text from '../assets/styles/text.module.css'
import { ref } from 'vue'
import { useDataStore } from '../store/data'

const dataStore = useDataStore()
let isOptionsOpen = ref(false)
let refreshDisabled = ref(false)

let themes = ['lavender', 'rose', 'lemon', 'sea', 'leaf', 'sand']

function toggleOptionsMenu() {
	isOptionsOpen.value = !isOptionsOpen.value
}

function handleFetch() {
	refreshDisabled.value = true
	dataStore.handleFetch()
	setTimeout(function () {
		refreshDisabled.value = false
	}, 15 * 1000)
}
</script>

<template>
	<!-- todo: consider updating typography-->
	<!-- todo: consider adding font selection (sans serif, mono) -->
	<!-- todo: options menu should still display if other errors in options-->
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
				<div class="options-menu--inner">
					<div :class="text.title">Options</div>

					<div :class="text.subtitle">theme</div>

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
					</div>

					<div class="divider" />

					<div :class="text.subtitle">time</div>
					<div :class="text.label">layout:</div>
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

					<div :class="text.subtitle">weather</div>
					<OptionToggle option="weather.useCelsius" label="celsius" />
					<OptionToggle
						option="weather.descriptive"
						label="precise conditions"
					/>

					<div class="row">
						<div :class="text.base">source:</div>
						<ExternalLink url="https://openweathermap.org"
							>OpenWeather</ExternalLink
						>
					</div>

					<div class="divider" />

					<div :class="text.subtitle">location</div>

					<div v-if="dataStore.weather.timestamp" class="row separated">
						<div
							v-if="dataStore.position.fetching == false"
							:class="text.label"
						>
							{{ dataStore.weather.name }},
							{{ dataStore.weather.sys.country }}
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
							<div
								v-if="dataStore.position.fetching == false"
								:class="text.label"
							>
								location disabled.
							</div>
							<div v-else :class="text.label">fetching...</div>
							<div>
								<button
									:class="button.primary"
									style="margin: 0 auto"
									@click="handleFetch"
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

					<!-- todo: section should appears in prod chrome app but not on web -->
					<div v-if="typeof chrome !== undefined">
						<div :class="text.subtitle">Data sync</div>

						<OptionToggle
							option="useChromeStorage"
							label="Sync options with Chrome"
							role="menuitem"
						/>

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
			</div>
		</transition>
	</div>
</template>

<style scoped>
.options {
	position: fixed;
	right: var(--page-padding);
	bottom: var(--page-padding);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.options-menu {
	padding-top: var(--page-padding);
	width: 320px;
	display: flex;
	justify-content: flex-end;
	position: fixed;
	top: 0;
	right: var(--page-padding);
	bottom: calc(var(--page-padding) + 36px + var(--space-small));
	z-index: 10;
	color: var(--ui-fg);
}

.options-menu--inner {
	margin-top: auto;
	padding: var(--space-medium);
	width: 100%;
	height: 100%;
	max-height: 640px;
	background: var(--ui-bg);
	border: var(--border);
	border-radius: var(--rounded);
	overflow-y: scroll;
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

.theme-list {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
}
</style>
