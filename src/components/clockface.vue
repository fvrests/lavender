<script setup lang="ts">
const props = defineProps<{
	layout: string
	hour: string
	minute: string
	date: Date
}>()
</script>

<template>
	<time v-if="props.layout == 'default'" :datetime="props.date.toString()">
		<div>{{ props.hour }}:{{ props.minute }}</div>
	</time>
	<time
		v-if="props.layout == 'stacked'"
		:datetime="props.date.toString()"
		class="outline"
	>
		<div>
			<span>{{ props.hour[0] }}</span>
			<span>{{ props.hour[1] }}</span>
		</div>
		<div>
			<span>{{ props.minute[0] }}</span>
			<span>{{ props.minute[1] }}</span>
		</div>
	</time>
</template>

<style scoped>
time {
	font-size: 96px;
	line-height: 96px;
	font-weight: bold;
	text-align: center;
}

.outline {
	display: flex;
	flex-direction: column;
	border: 3px solid var(--theme-fg);
	padding: var(--space-small);
}

.outline div {
	display: flex;
}

.outline span {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1ch;
}
</style>
