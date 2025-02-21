import { defineStore } from 'pinia'
import { isColorDark } from '../utils/helpers'
import { useDataStore } from './data'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		useChromeStorage: false,
		theme: {
			color: 'lavender',
			customColor: '',
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
							const localOptions = JSON.parse(options)
							document.documentElement.style.setProperty(
								'--color-custom',
								localOptions.theme.customColor ?? '#3a3441',
							)
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
					this.setCustomColor(this.theme.customColor)
					this.$subscribe((_, state) => {
						localStorage.setItem('options', JSON.stringify({ ...state }))
					})
				})
		},
		readChromeStorage() {
			chrome.storage.sync.get().then(
				(value) => {
					if (value && value.options) {
						const syncOptions = JSON.parse(value.options)
						this.$patch({ ...syncOptions, init: true })
						document.documentElement.className = syncOptions.theme.color
					} else return null
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
					console.warn('error reading Chrome storage', err)
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
		setCustomColor(colorHex: string, enable = false) {
			const isDark = isColorDark(colorHex)
			const theme = isDark ? 'custom-dark' : 'custom'
			document.documentElement.style.setProperty('--color-custom', colorHex)
			if (enable) {
				this.$patch({ theme: { color: theme, customColor: colorHex } })
				document.documentElement.className = theme
			}
		},
		previewTheme(theme: string) {
			document.documentElement.className = theme
		},
		reset() {
			this.$reset()
		},
	},
})
