<script setup lang="ts">
const props = withDefaults(
	defineProps<{ url: string; underline?: boolean }>(),
	{
		underline: false,
	},
)
const { url, underline } = props
</script>

<template>
	<a :href="url" target="_blank">
		<div class="row">
			<div class="text" :class="{ underline: underline }">
				<slot />
			</div>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--ui-fg)"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-external-link"
					style="height: 10px; width: 10px"
				>
					<path
						d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
					></path>
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
			</div>
		</div>
	</a>
</template>

<style scoped>
a {
	padding: 0px 4px;
}
a:focus {
	outline: none;
}
a:focus .text {
	box-shadow: var(--ui-focus-box);
}

.text {
	font-size: 11px;
	padding: 1px 1px;
	border-radius: var(--rounded-slight);
	position: relative;
	display: block;
	text-align: center;
}
.text.underline {
	font-weight: bold;
	margin-bottom: -4px;
	padding-bottom: 4px;
}
.text.underline::after {
	content: '';
	position: absolute;
	height: 2px;
	width: calc(100% - 4px);
	left: 2px;
	bottom: 10%;
	background-color: var(--theme-bg);
}
.text.underline:hover::after,
.text.underline:focus::after {
	content: '';
	position: absolute;
	height: 4px;
	width: calc(100% - 4px);
	left: 2px;
	bottom: 10%;
	background-color: var(--theme-bg);
	visibility: visible;
}

svg {
	margin-left: 6px;
}
</style>
