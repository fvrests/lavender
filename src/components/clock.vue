<script setup lang="ts">
import { onMounted } from 'vue'
import { useOptionsStore } from '../store/options'
import { useDataStore } from '../store/data'
import Clockface from './clockface.vue'

const optionsStore = useOptionsStore()
const dataStore = useDataStore()

onMounted(() => {
	dataStore.getTime()
})
</script>

<template>
	<div class="wrapper">
		<Clockface
			:layout="optionsStore.time.layout"
			:hour="dataStore.formattedDate.hour"
			:minute="dataStore.formattedDate.minute"
			:time="dataStore.data.date"
		/>
		<div class="space-small" />
		<div class="context-label" v-if="!optionsStore.time.use24Hour">
			{{ dataStore.formattedDate.descriptor }}
		</div>
		<div v-else class="context-label">today is</div>
		<div class="date">{{ dataStore.formattedDate.today }}</div>
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
