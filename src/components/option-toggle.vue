<script setup lang="ts">
import { computed } from 'vue'
import text from '../assets/styles/text.module.css'
import { useOptionsStore } from '../store/options'
const optionsStore = useOptionsStore()

const props = withDefaults(
	defineProps<{ label: string; option: string; sublabel: string }>(),
	{ sublabel: '' }
)

let selected = computed(() => optionsStore[props.option])
</script>

<template>
	<button class="item-wrapper" @click="optionsStore.toggleOption(props.option)">
		<div class="row">
			<div :class="text.label">{{ props.label }}</div>
			<div :class="text.sublabel">{{ props.sublabel }}</div>
		</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="toggle"
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
}
svg.toggle {
	color: var(--ui-fg);
}
svg.toggle > rect,
svg.toggle > circle {
	transition: all 200ms ease-in-out;
}
svg.toggle.selected > circle {
	fill: var(--ui-bg);
}
svg.toggle > circle {
	fill: var(--theme-bg);
}
svg.toggle > rect {
	fill: var(--ui-bg);
}
svg.toggle.selected > rect {
	fill: var(--theme-bg);
}
</style>
