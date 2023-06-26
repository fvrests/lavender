import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { setTheme, applyTheme } from '../utils/theme'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		useChromeStorage: false,
		theme: {
			color: useLocalStorage('options/theme/color', 'lavender'),
		},
		time: {
			layout: useLocalStorage('options/time/layout', 'default'),
			use24Hour: useLocalStorage('options/time/use-24-hour', false),
		},
		weather: {
			useCelsius: useLocalStorage('options/weather/use-celsius', false),
			descriptive: useLocalStorage('options/weather/descriptive', false),
		},
		position: {
			declined: false,
		},
	}),
	actions: {
		// fix: wip finish setup of store initialization
		// maybe don't even need this? see https://pinia.vuejs.org/cookbook/composables.html#option-stores
		initializeStore() {
			// if (this.useChromeStorage) {
			// fix: can't find chrome
			// chrome.storage.sync.get(null, (value) => {
			// 	if (value) {
			// 		this.$state = { ...value, init: true }
			// 	} else {
			// 		this.init = true
			// 	}
			// })
			// }
			this.init = true
		},
		toggleTheme(theme: string) {
			setTheme(theme)
			this.$patch({ theme: { color: theme } })
		},
		previewTheme(theme: string) {
			applyTheme(theme)
		},
	},
})
