<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { setCorrectingInterval } from '@/utils/helpers'
import Clockface from './clockface.vue'

let store = useStore()
let newDate = ref(new Date())
let today = computed(() => format(newDate.value, 'LLLL do, yyyy'))
let hour = computed(() => {
	let h = ''
	if (store.state.useMilitaryTime) {
		h = format(newDate.value, 'HH')
	} else if (store.state.timeLayout == 'stacked') {
		h = format(newDate.value, 'hh')
	} else {
		h = format(newDate.value, 'h')
	}
	return h
})

let minute = computed(() => format(newDate.value, 'mm'))
let descriptor = computed(() => format(newDate.value, 'B'))

function getTime() {
	newDate.value = new Date()
}

onMounted(() => {
	setCorrectingInterval(() => getTime(), 1000)
})

console.log(store.state.timeLayout)
</script>

<template>
	<div class="wrapper">
		<Clockface
			:layout="store.state.timeLayout"
			:hour="hour"
			:minute="minute"
			:time="newDate"
		/>
		<div class="space-small" />
		<div v-if="!store.state.useMilitaryTime" class="italic">
			{{ descriptor }}
		</div>
		<div v-else class="italic">today is</div>
		<div class="today">{{ today }}</div>
	</div>
</template>

<style scoped>
.wrapper {
	grid-area: middle;
	text-align: center;
}

.italic {
	text-transform: uppercase;
	font-size: 14px;
	font-style: italic;
}

.today {
	font-weight: bold;
}
</style>
