<script setup>
import VIcon from '../assets/icons/icon.vue'
import VOptionToggle from './option-toggle.vue'
import VRadioGroup from './radio-group.vue'
import VExternalLink from './external-link.vue'
import VThemeSelect from './theme-select.vue'
import button from './button.module.css'
import text from './text.module.css'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

let store = useStore()
let storedWeather = computed(() => store.state.weather)
let storeInitialized = computed(() => store.state.init)
let storedTheme = computed(() => store.state.themeColor)
let timeLayout = computed(() => store.state.timeLayout)
let fetchingPosition = computed(() => store.state.position.fetching)
let isOptionsOpen = ref(false)
let positionDeclined = computed(() => store.state.position.declined)
let refreshDisabled = ref(false)

let themes = ['lavender', 'rose', 'lemon', 'sea', 'leaf', 'sand']

function toggleProperty(property) {
	store.commit('toggleProperty', property)
}
function toggleOptionsMenu() {
	isOptionsOpen.value = !isOptionsOpen.value
}
function handleFetch() {
	refreshDisabled.value = true
	store.dispatch('fetchPosition')
	setTimeout(function () {
		refreshDisabled.value = false
	}, 15 * 1000)
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
			<v-icon class="options-icon" />
		</button>
		<div v-if="isOptionsOpen" class="overlay" @click="toggleOptionsMenu" />
		<transition name="optionsMenu">
			<div v-show="isOptionsOpen" class="options-menu" role="menu">
				<div class="options-menu--inner">
					<div :class="text.title">Options</div>

					<!-- todo: separate options by theme collection: lavender, nightshade? classic, dark?-->
					<div :class="text.subtitle">theme</div>
					<div class="row">
						<div :class="text.label">selected:</div>
						<div :class="text.sublabel">{{ storedTheme }}</div>
					</div>

					<div style="padding: 6px 0px">
						:
						<ul class="theme-list">
							<li v-for="theme in themes">
								<VThemeSelect :theme="theme" :colors="[theme]" />
							</li>
						</ul>
						<ul class="theme-list">
							<li v-for="theme in themes">
								<VThemeSelect
									:theme="theme + '-dark'"
									:colors="[theme + '-dark']"
								/>
							</li>
						</ul>
						<ul class="theme-list">
							<li v-for="theme in themes">
								<VThemeSelect
									:theme="theme + '-system'"
									split
									:colors="[theme, `${theme}-dark`]"
								/>
							</li>
						</ul>
					</div>

					<div class="divider" />

					<div :class="text.subtitle">time</div>
					<div :class="text.label">layout:</div>
					<v-radio-group
						property="timeLayout"
						:options="['default', 'stacked']"
					>
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
					</v-radio-group>

					<v-option-toggle
						option="useMilitaryTime"
						label="24 hour format"
						role="menuitem"
					/>

					<div class="divider" />

					<div :class="text.subtitle">weather</div>
					<v-option-toggle option="useCelsius" label="celsius" />
					<v-option-toggle
						option="useDescriptiveWeather"
						label="precise conditions"
					/>

					<div class="row">
						<div :class="text.base">source:</div>
						<v-external-link url="https://openweathermap.org"
							>OpenWeather</v-external-link
						>
					</div>

					<div class="divider" />

					<div :class="text.subtitle">location</div>

					<div v-if="storedWeather.hasData" class="row separated">
						<div v-if="fetchingPosition == false" :class="text.label">
							{{ storedWeather.name }},
							{{ storedWeather.sys.country }}
						</div>

						<div v-else :class="text.label">Fetching...</div>
						<div>
							<button
								:class="button.primary"
								style="margin: 0 auto"
								:disabled="refreshDisabled"
								@click="handleFetch"
							>
								{{ !refreshDisabled ? 'Refresh' : 'Please wait 15s' }}
							</button>
						</div>
					</div>
					<div v-else>
						<div class="row separated">
							<div v-if="fetchingPosition == false" :class="text.label">
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
							Please click 'enable' to enable location access.
						</div>
					</div>

					<div class="divider" />

					<div class="row even">
						<v-external-link
							url="https://github.com/fvrests/lavender/blob/main/privacy-policy.md"
							>Privacy Policy</v-external-link
						>
						<v-external-link
							url="https://github.com/fvrests/lavender/blob/main/terms-of-use.md"
							>Terms of Use</v-external-link
						>
					</div>

					<div class="space-small" />

					<div class="row even">
						<v-external-link url="https://fvrests.dev" :underline="true"
							>fvrests</v-external-link
						>

						<v-external-link url="https://ko-fi.com/fvrests" :underline="true"
							>donate ♥</v-external-link
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
	gap: 12px;
}
</style>
