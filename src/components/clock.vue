<script setup lang="ts">
import { onMounted } from 'vue'
import { useOptionsStore } from '../store/options'
import Clockface from './clockface.vue'

const optionsStore = useOptionsStore()

onMounted(() => {
	optionsStore.getTime()
})
</script>

<template>
	<div class="wrapper">
		<Clockface
			:layout="optionsStore.time.layout"
			:hour="optionsStore.formattedDate.hour"
			:minute="optionsStore.formattedDate.minute"
			:time="optionsStore.data.date"
		/>
		<div class="space-small" />
		<div class="context-label" v-if="!optionsStore.time.use24Hour">
			{{ optionsStore.formattedDate.descriptor }}
		</div>
		<div v-else class="context-label">today is</div>
		<div class="date">{{ optionsStore.formattedDate.today }}</div>
	</div>
</template>

<style scoped>
.wrapper {
	grid-area: middle;
	text-align: center;
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
