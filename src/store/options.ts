import { defineStore } from 'pinia'
import { useDataStore } from './data'
import { useInstanceStore } from './instance'

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
			getLocalOptions()
				.then(
					// set localStore options into store
					(options) => {
						if (options) {
							const localOptions = JSON.parse(options.toString())
							this.$patch(localOptions)
						}
					},
					(err) => {
						console.warn(err)
					},
				)
				.then(() => {
					this.init = true
					this.initializeChromeStorage()
				})
				.then(() => {
					this.setTheme(this.theme.color)
					this.$subscribe((_, state) => {
						localStorage.setItem('options', JSON.stringify(state))
					})
				})
		},
		readChromeStorage() {
			chrome.storage.sync.get().then(
				(value) => {
					if (value) {
						const syncOptions = JSON.parse(value.options.toString())
						this.$patch({ ...syncOptions, init: true })
						document.documentElement.className = syncOptions.theme.color
					}
				},
				(err) => {
					console.warn(err)
				},
			)
		},
		initializeChromeStorage() {
			// pull options on app load
			if (
				this.init &&
				useDataStore().isChromeExtension &&
				this.useChromeStorage
			) {
				try {
					this.readChromeStorage()
				} catch (err) {
					console.warn('Error reading Chrome storage', err)
				}
			}
			this.$subscribe(() => {
				if (
					this.init &&
					useDataStore().isChromeExtension &&
					this.useChromeStorage
				) {
					// push options on change
					chrome.storage.sync.set({
						options: JSON.stringify(this.$state),
						lastSynced: Date.now(),
					})
				}
			})
		},
		initialize() {
			this.initializeStore()
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
			localStorage.clear()
			if (useDataStore().isChromeExtension) chrome?.storage?.sync?.clear()
			this.$reset()
			useInstanceStore().clearInterval('weather')
			useInstanceStore().clearInterval('time')
			useInstanceStore().$reset()
			useDataStore().$reset()
			this.initialize()
			useDataStore().initialize()
			useInstanceStore().initialize()
		},
	},
})
