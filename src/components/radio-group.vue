<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOptionsStore } from '../store/options'
import text from '../assets/styles/text.module.css'
const props = defineProps<{ property: string; options: string[] }>()

let selected = ref('')
let optionsStore = useOptionsStore()

selected.value = optionsStore[props.property]

watch(selected, () => {
	optionsStore[props.property] = selected.value
})
</script>

<template>
	<div class="grid">
		<div v-for="n in options" :key="n">
			<input
				:id="n"
				v-model="selected"
				:name="property"
				type="radio"
				:value="n"
				:checked="selected == n"
			/>
			<div class="column" role="“radiogroup”">
				<label
					:for="n"
					:class="n"
					tabindex="0"
					role="“radio”"
					:aria-checked="selected == n ? 'true' : 'false'"
					@keyup.enter="selected = n"
					@keyup.space="selected = n"
				>
					<div
						class="dot"
						:class="selected == n ? 'filled' : null"
						:alt="selected == n ? 'selected' : 'not-selected'"
					/>
					<slot :name="n" />
				</label>
				<div :class="selected == n ? text.label : text.base">
					{{ n }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
input {
	position: absolute;
	visibility: hidden;
	opacity: 0;
	width: 1px;
	height: 1px;
	left: -1;
	z-index: -1;
}

label {
	position: relative;
	width: 96px;
	height: 124px;
	border: var(--border);
	border-radius: var(--rounded);
	background-color: var(--theme-bg);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
label:focus {
	outline: none;
	box-shadow: var(--ui-focus-box);
}
.dot {
	position: absolute;
	top: 8px;
	left: 8px;
	height: 12px;
	width: 12px;
	box-shadow: 0px 0px 0px 2px var(--ui-fg);
	border: 2px solid var(--ui-bg);
	border-radius: var(--rounded-full);
	background-color: var(--ui-bg);
	cursor: pointer;
}

.filled {
	background-color: var(--ui-fg);
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(96px, max-content));
	justify-content: center;
	grid-gap: var(--space-small);
	padding: 6px 0px;
}

/* input:focus + label, */
/* input:active + label { */
/* 	border: 2px solid var(--theme-bg); */
/* } */
</style>
