<script setup lang="ts">
import { computed } from 'vue'
import text from '../assets/styles/text.module.css'
import { useOptionsStore } from '../store/options'
const optionsStore = useOptionsStore()

const props = withDefaults(
	defineProps<{
		label: string
		option: string
		onChange?: () => void
	}>(),
	{ onChange: () => {} },
)

// allow passing nested options (convert to store entry reference)
const optionNodes = props.option.split('.')

const handleOption = (toggle = false) => {
	return optionNodes.reduce((prev: any, cur: string, index) => {
		// if toggle is set, toggle stored value
		if (toggle && index === optionNodes.length - 1) {
			prev[cur] = !prev[cur]
		}
		return prev ? prev[cur] : null
	}, optionsStore)
}
const selected = computed(() => handleOption())
</script>

<template>
	<button
		class="item-wrapper"
		@click="
			() => {
				props.onChange && props.onChange()
				handleOption(true)
			}
		"
	>
		<div :class="text.label">{{ props.label }}</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="16"
			viewBox="4 4 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			:class="selected ? 'selected' : ''"
		>
			<rect x="1" y="5" width="22" height="14" rx="7" ry="7" />

			<circle :cx="selected ? 16 : 8" cy="12" r="4" />
		</svg>
	</button>
</template>

<style scoped>
.item-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto;
	border-radius: var(--rounded);
	/* prevent cutoff of svg shadow on safari */
	outline: 4px solid transparent;
}
svg {
	color: var(--ui-fg);
	border-radius: var(--rounded);
}
.item-wrapper:focus {
	outline: none;
}
.item-wrapper:focus svg {
	box-shadow: var(--ui-focus-box);
}
svg > rect,
svg > circle {
	transition: all 200ms ease-in-out;
}
svg.selected > circle {
	fill: var(--ui-bg);
}
svg > circle {
	fill: var(--theme-bg);
}
svg > rect {
	fill: var(--ui-bg);
}
svg.selected > rect {
	fill: var(--theme-bg);
}
</style>
