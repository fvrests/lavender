import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { setCorrectingInterval, fetchWeather } from '../utils/helpers'
import { toggleTheme, previewTheme } from '../utils/theme.js'
import conditions from '../utils/weather-conditions'
import errorCodes from '../utils/error-codes.json'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		date: new Date(),
		timeLayout: 'default',
		use24HourTime: false,
		useCelsius: false,
		isDaytime: true,
		useDescriptiveWeather: false,
		themeColor: 'lavender',
		position: {
			hasData: true,
			latitude: '43.20894621999999',
			longitude: '12.072502129999997',
			timestamp: 1684846736645, // null
			fetching: false,
			declined: false,
		},
		weather: {
			hasData: false,
			timestamp: null,
		},
		errors: {
			weather: '',
			location: '',
		},
	}),
	getters: {
		formattedDate(state) {
			let hour = ''
			if (state.use24HourTime) {
				hour = format(state.date, 'HH')
			} else if (state.timeLayout == 'stacked') {
				hour = format(state.date, 'hh')
			} else {
				hour = format(state.date, 'h')
			}
			return {
				today: format(state.date, 'LLLL do, yyyy'),
				hour: hour,
				minute: format(state.date, 'mm'),
				descriptor: format(state.date, 'B'),
			}
		},
		weatherIconClass: (state) => {
			if (state.weather.hasData) {
				let day = true
				day = !!(
					state.date / 1000 > state.weather.sys.sunrise &&
					state.date / 1000 < state.weather.sys.sunset
				)
				let iconClass = day
					? `wi wi-owm-day-${state.weather.weather[0].id}`
					: `wi wi-owm-night-${state.weather.weather[0].id}`
				return iconClass
			}
		},
		formattedTemp: (state) => {
			if (state.weather.hasData) {
				let celsiusTemp = (state.weather?.main.temp - 273.15).toFixed()
				let fahrenheitTemp = (celsiusTemp * (9 / 5) + 32).toFixed()
				return state.useCelsius ? celsiusTemp : fahrenheitTemp
			} else {
				return 'Please click the cloud to get data!'
			}
		},
		weatherConditions: (state) => {
			if (state.weather.hasData) {
				let condition = state.useDescriptiveWeather
					? conditions[state.weather.weather[0].id][0]
					: conditions[state.weather.weather[0].id][1]
				return condition
			} else {
				return 'No weather data available!'
			}
		},
	},
	actions: {
		toggleTheme(theme: string) {
			toggleTheme(theme)
			this.$patch({ themeColor: theme })
		},
		previewTheme(theme: string) {
			previewTheme(theme)
		},
		getTime() {
			setCorrectingInterval(() => (this.date = new Date()), 1000)
		},
		toggleOption(option) {
			this[option] = !this[option]
		},
		fetchPosition() {
			this[position] = { ...this.position, fetching: true }
			async function fetchNewPosition() {
				// console.log('attempting fetch')
				await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							this.$patch({
								position: {
									...this.position,
									hasData: true,
									timestamp: Date.now(),
									fetching: false,
								},
							})
							resolve()
						},
						(err) => {
							console.log(
								errorCodes.position[err.code] ||
									'😱oh no! an unknown error has occurred.'
							)
							reject(err)
						},
						{ timeout: 5000, enableHighAccuracy: false }
					)
				})
			}
			let error = fetchNewPosition().catch((err) => {
				this.$patch({
					position: {
						...this.position,
						fetching: false,
					},
				})
				return err
			})
			return error
		},
		refreshWeather() {
			console.log('refreshing weather')
			let invalidated =
				!this.weather.timestamp ||
				Date.now() - this.weather.timestamp >= 30 * 60 * 1000
			// don't fetch if recent data exists or no location data
			if (!invalidated || !this.position.hasData) {
				console.log('continuing')
				return
			}
			// fetch new weather using last known position
			const weather = fetchWeather(
				this.position.latitude,
				this.position.longitude
			)
			this.$patch({
				weather: { ...weather, hasData: true, timestamp: Date.now() },
			})

			// const weather = fetchWeather(...)
			// this.weather = weather
			// update weather if position changes
			this.$subscribe((mutation) => {
				console.log('mutation', mutation)
				if (mutation.payload.some((el) => (el.key = 'position'))) {
					if (
						this.position.latitude !== mutation.payload.latitude ||
						this.position.longitude !== mutation.payload.longitude
					)
						fetchWeather(this.position.latitude, this.position.longitude)
					// const weather = fetchWeather(...)
					// this.weather = weather
				}
			})
			setCorrectingInterval(() => {
				this.refreshWeather()
			}, 5 * 60 * 1000)
		},
	},
})
