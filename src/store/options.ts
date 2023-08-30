import { defineStore } from 'pinia'
import { useDataStore } from './data'

declare global {
	interface Window {
		themeColor: any
	}
}

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
			async function getLocalOptions() {
				return localStorage.getItem('options')
			}
			getLocalOptions().then(
				(options) => {
					if (options) {
						const localOptions = JSON.parse(options)
						this.$patch(localOptions)
					}
				},
				(err) => {
					console.warn(err)
				}
			)
			this.init = true
			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('options', JSON.stringify(state))
				}
			})
		},
		initializeTheme() {
			window.themeColor = 'lavender'
			try {
				const storedOptions =
					JSON.parse(window.localStorage.getItem('options')) ?? null
				const storedColor = (storedOptions && storedOptions.theme.color) ?? null
				if (storedColor) {
					document.documentElement.className = storedColor
				} else {
					document.documentElement.className = 'options'
				}
			} catch (err) {
				console.warn(err)
			}
		},
		readChromeStorage() {
			chrome.storage.sync.get().then(
				(value) => {
					if (value) {
						const syncOptions = JSON.parse(value.options)
						this.$patch({ ...syncOptions, init: true })
						document.documentElement.className = syncOptions.theme.color
					}
				},
				(err) => {
					console.warn(err)
				}
			)
		},
		initializeChromeStorage() {
			// pull options on app load
			if (this.init && useDataStore().isChrome && this.useChromeStorage) {
				this.readChromeStorage()
			}

			// todo: can push value of store or only localStorage?
			this.$subscribe(() => {
				if (this.init && useDataStore().isChrome && this.useChromeStorage) {
					// const localOptions = localStorage.getItem('options')
					// push options on change
					chrome.storage.sync.set({
						// options: localOptions?.toString() ?? null,
						options: this.toString() ?? null,
						lastSynced: Date.now(),
					})
				}
			})
		},
		initialize() {
			this.initializeStore()
			this.initializeTheme()
			this.initializeChromeStorage()
		},
		setTheme(theme: string) {
			this.$patch({ theme: { color: theme } })
			document.documentElement.className = theme
		},
		previewTheme(theme: string) {
			document.documentElement.className = theme
		},
		clearData() {
			// todo: prevent error on chrome undefined
			localStorage.clear()
			if (useDataStore().isChrome) chrome?.storage.sync.clear()
			this.$reset()
			useDataStore().$reset()
			this.initialize()
			useDataStore().initialize()
		},
	},
})
