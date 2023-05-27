<script setup lang="ts">
import { useOptionsStore } from '../store/options'

const optionsStore = useOptionsStore()

const props = withDefaults(
	defineProps<{
		theme: string
		colors: string[]
		split?: boolean
		dark: boolean
	}>(),
	{ split: false }
)
</script>

<template>
	<button
		class="color-toggle"
		:class="optionsStore.themeColor === props.theme ? 'selected' : null"
		:style="{
			background: props.split
				? `linear-gradient(to right, var(--color-${props.colors[0]}) 50%, var(--color-${props.colors[1]}) 50%)`
				: `var(--color-${props.colors[0]})`,
		}"
		:aria-label="props.theme"
		@click="optionsStore.toggleTheme(props.theme)"
		@mouseenter="optionsStore.previewTheme(props.theme)"
		@mouseleave="optionsStore.toggleTheme(optionsStore.themeColor)"
	></button>
</template>
<style scoped>
button {
	height: 26px;
	width: 26px;
	border-radius: var(--rounded-full);
	cursor: pointer;
	border: var(--border);
	position: relative;
}

/* todo: add checkmark or other active style*/
button.selected::after {
	content: '';
	position: absolute;
	top: -6px;
	right: -6px;
	height: 34px;
	width: 34px;
	border: var(--border);
	border-radius: var(--rounded-full);
}
</style>
