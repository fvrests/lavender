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
			:layout="optionsStore.timeLayout"
			:hour="optionsStore.formattedDate.hour"
			:minute="optionsStore.formattedDate.minute"
			:time="optionsStore.date"
		/>
		<div class="space-small" />
		<div v-if="!optionsStore.use24HourTime" class="descriptor">
			{{ optionsStore.formattedDate.descriptor }}
		</div>
		<div v-else class="italic">today is</div>
		<div class="date">{{ optionsStore.formattedDate.today }}</div>
	</div>
</template>

<style scoped>
.wrapper {
	grid-area: middle;
	text-align: center;
}

.descriptor {
	text-transform: uppercase;
	font-size: 14px;
	font-style: italic;
}

.date {
	font-weight: bold;
}
</style>
