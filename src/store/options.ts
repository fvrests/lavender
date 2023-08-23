import { defineStore } from 'pinia'
import { useDataStore } from './data'
// import { useLocalStorage } from '@vueuse/core'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		useChromeStorage: false,
		theme: {
			color: 'lavender',
		},
		time: {
			layout: 'default',
			use24Hour: false,
		},
		weather: {
			useCelsius: false,
			descriptive: false,
		},
		position: {
			declined: false,
		},
	}),
	actions: {
		initializeStore() {
			async function getLocalData() {
				return localStorage.getItem('lavender')
			}
			getLocalData().then(
				(data) => {
					if (data) {
						const localOptions = JSON.parse(data)
						this.$patch(localOptions)
					}
					this.init = true
				},
				(err) => {
					console.log(err)
				}
			)
			this.init = true
			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('lavender', JSON.stringify(state))
				}
			})
		},
		initializeTheme() {
			window.themeColor = 'lavender'
			try {
				const storedOptions =
					JSON.parse(window.localStorage.getItem('lavender')) ?? null
				const storedColor = (storedOptions && storedOptions.theme.color) ?? null
				if (storedColor) {
					document.querySelector('html').className = storedColor
				} else {
					document.querySelector('html').className = 'lavender'
				}
			} catch (err) {
				console.warn(err)
			}
		},
		readChromeStorage() {
			chrome.storage.sync.get().then(
				(value) => {
					if (value) {
						const syncOptions = JSON.parse(value.lavender)
						this.$patch({ ...syncOptions, init: true })
						document.querySelector('html').className = syncOptions.theme.color
					}
				},
				(err) => {
					console.log(err)
				}
			)
		},
		initializeChromeStorage() {
			// pull options on app load
			if (this.init && useDataStore().isChrome && this.useChromeStorage) {
				this.readChromeStorage()
			}

			this.$subscribe(() => {
				if (this.init && useDataStore().isChrome && this.useChromeStorage) {
					// push options on change
					chrome.storage.sync.set({
						...localStorage,
						lastSynced: Date.now(),
					})
				}
			})
		},
		clearChromeStorage() {
			chrome.storage.sync.clear()
		},
		setTheme(theme: string) {
			this.$patch({ theme: { color: theme } })
			document.documentElement.className = theme
		},
		previewTheme(theme: string) {
			document.documentElement.className = theme
		},
	},
})
