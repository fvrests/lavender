<script setup lang="ts">
import { useOptionsStore } from '../store/options'
import { useInstanceStore } from '../store/instance'
import Clockface from './clockface.vue'

const optionsStore = useOptionsStore()
const instanceStore = useInstanceStore()
</script>

<template>
	<div class="wrapper">
		<Clockface
			:layout="optionsStore.time.layout"
			:hour="instanceStore.formattedDate.hour"
			:minute="instanceStore.formattedDate.minute"
			:date="instanceStore.date"
			v-if="instanceStore.init && optionsStore.init"
		/>
		<div class="space-small" />
		<div class="context-label" v-if="!optionsStore.time.use24Hour">
			{{ instanceStore.formattedDate.descriptor }}
		</div>
		<div v-else class="context-label">today is</div>
		<div class="date">{{ instanceStore.formattedDate.today }}</div>
	</div>
</template>

<style scoped>
.wrapper {
	grid-area: middle;
	text-align: center;
	user-select: none;
	-webkit-user-select: none; /* Safari */
	-webkit-touch-callout: none; /* iOS Safari */
	cursor: default; /* prevents text cursor in Safari */
}

.context-label {
	text-transform: uppercase;
	font-size: 14px;
	font-style: italic;
}

.date {
	font-weight: bold;
}
</style>
