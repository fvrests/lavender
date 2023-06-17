<script setup lang="ts">
import { computed } from 'vue'
import text from '../assets/styles/text.module.css'
import { useOptionsStore } from '../store/options'
const optionsStore = useOptionsStore()

const props = withDefaults(
	defineProps<{
		label: string
		option: string
		sublabel: string
		selected: boolean
	}>(),
	{ sublabel: '' }
)

const optionNodes = props.option.split('.')
const handleOption = (toggle = false) =>
	optionNodes.reduce((prev, cur, index) => {
		if (toggle && index === optionNodes.length - 1) {
			prev[cur] = !prev[cur]
		}
		return prev ? prev[cur] : null
	}, optionsStore)
const selected = computed(() => handleOption())
</script>

<template>
	<button class="item-wrapper" @click="() => handleOption(true)">
		<div class="row">
			<div :class="text.label">{{ props.label }}</div>
			<div :class="text.sublabel">{{ props.sublabel }}</div>
		</div>
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
/* general styling */
.item-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto;
	border-radius: var(--rounded);
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
