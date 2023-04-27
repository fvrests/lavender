<script>
import { toggleTheme, previewTheme } from '../utils/theme'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
	props: {
		theme: { type: Array, required: true },
		colors: { type: Array, required: true },
		split: { type: Boolean, default: false },
	},
	setup() {
		let store = useStore()
		let storedTheme = computed(() => store.state.themeColor)
		return {
			toggleTheme,
			previewTheme,
			storedTheme,
		}
	},
}
</script>

<template>
	<button
		class="color-toggle"
		:class="storedTheme === theme ? 'selected' : null"
		:style="{
			background: split
				? `linear-gradient(to right, var(--color-${colors[0]}) 50%, var(--color-${colors[1]}) 50%)`
				: `var(--color-${colors[0]})`,
		}"
		:aria-label="theme"
		@click="toggleTheme(theme)"
		@mouseenter="previewTheme(theme)"
		@mouseleave="toggleTheme()"
	></button>
</template>
<style scoped>
button {
	height: 28px;
	width: 28px;
	border-radius: var(--rounded-full);
	cursor: pointer;
	border: var(--border);
}

/* todo: add checkmark or other active style. need to differentiate hue*/
button.selected {
	border-color: red;
	background: red;
}
</style>
