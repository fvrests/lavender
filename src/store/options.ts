import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		useChromeStorage: useLocalStorage('options/useChromeStorage', false),
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
			declined: useLocalStorage('options/position/declined', false),
		},
	}),
	actions: {
		// fix: wip finish setup of store initialization
		// re-initialize if chrome storage turned on
		initializeStore() {
			this.init = true
		},
		initializeChromeStore() {
			if (chrome !== undefined && this.useChromeStorage) {
				chrome.storage.sync.get(null, (value) => {
					if (value) {
						this.$patch({ ...value, init: true })
					} else {
						this.init = true
					}
				})
				// todo: localStorage is set before mutation is incorporated - out of sync
				this.$subscribe(
					(mutation, state) => {
						console.log('mut', mutation)
						if (
							this.init &&
							typeof chrome !== undefined &&
							this.useChromeStorage
						) {
							chrome.storage.sync.set({
								...localStorage,
								lastSynced: Date.now(),
							})
							console.log('chrome sync', state)
						}
					},
					{ sync: true }
				)
			}
		},
		toggleTheme(theme: string) {
			this.$patch({ theme: { color: theme } })
		},
		previewTheme(theme: string) {
			document.documentElement.className = theme
		},
	},
})
