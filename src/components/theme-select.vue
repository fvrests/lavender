<script setup lang="ts">
import { useOptionsStore } from '../store/options'

const optionsStore = useOptionsStore()

const props = withDefaults(
	defineProps<{
		theme: string
		colors: string[]
		split?: boolean
		dark?: boolean
	}>(),
	{ split: false, dark: false }
)
</script>

<template>
	<button
		v-bind:class="[
			optionsStore.theme.color === props.theme ? 'selected' : '',
			dark ? 'dark' : '',
			split ? 'split' : '',
		]"
		:style="{
			background: props.split
				? `linear-gradient(to right, var(--color-${props.colors[0]}) 50%, transparent 50%), repeating-linear-gradient(to right, var(--color-${props.colors[0]}), var(--color-${props.colors[0]}) 1px, var(--color-${props.colors[1]}) 1px, var(--color-${props.colors[1]}) 2px)`
				: `var(--color-${props.colors[0]})`,
		}"
		:aria-label="props.theme"
		@click="optionsStore.toggleTheme(props.theme)"
		@mouseenter="optionsStore.previewTheme(props.theme)"
		@mouseleave="optionsStore.toggleTheme(optionsStore.theme.color)"
	>
		<svg
			v-if="optionsStore.theme.color === props.theme"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke-width="4"
			stroke="currentColor"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="check"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<path d="M5 12l5 5l10 -10"></path>
		</svg>
	</button>
</template>
<style scoped>
button {
	height: 30px;
	width: 30px;
	border-radius: var(--rounded-full);
	cursor: pointer;
	border: var(--border);
	position: relative;
}
button:focus {
	outline: none;
	box-shadow: var(--ui-focus-box);
}
.check {
	color: var(--ui-fg);
	scale: 60%;
}
.dark .check {
	color: var(--ui-bg);
}
.split .check {
	color: var(--ui-fg);
}
</style>
