import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { fetchWeather } from '../utils/helpers'
import conditions from '../utils/weather-conditions'
import { useOptionsStore } from './options'
import { useInstanceStore } from './instance'
import errorCodes from '../utils/error-codes.json'

interface Weather extends OpenWeatherResponse {
	timestamp: number | null
}
let weatherIntervalIds: number[] = []

export const useDataStore = defineStore('data', {
	state: () => ({
		init: false,
		date: new Date(),
		isChromeExtension: false,
		weather: null as Weather | null,
		position: {
			latitude: null as number | null,
			longitude: null as number | null,
			timestamp: null as number | null,
			fetching: false,
		},
		errors: {
			weather: '',
			location: '',
		},
	}),
	getters: {
		useOptionsStore() {
			return useOptionsStore()
		},
		formattedDate(state) {
			let hour = ''
			let date = new Date(state.date)
			if (useOptionsStore().time.use24Hour) {
				hour = format(date, 'HH')
			} else if (useOptionsStore().time.layout == 'stacked') {
				hour = format(date, 'hh')
			} else {
				hour = format(date, 'h')
			}
			return {
				today: format(date, 'LLLL do, yyyy'),
				hour: hour,
				minute: format(date, 'mm'),
				descriptor: format(date, 'B'),
			}
		},
		weatherIconClass: (state) => {
			let iconClass = 'wi wi-cloud-refresh'
			if (state.weather?.timestamp) {
				let day = true
				day = !!(
					Number(state.date) / 1000 > state.weather.sys.sunrise &&
					Number(state.date) / 1000 < state.weather.sys.sunset
				)
				iconClass = day
					? `wi wi-owm-day-${state.weather.weather[0].id}`
					: `wi wi-owm-night-${state.weather.weather[0].id}`
			}
			return iconClass
		},
		formattedTemp: (state) => {
			if (!state.weather?.timestamp) {
				return 'No weather data available'
			}
			let celsiusTemp = (state.weather.main.temp - 273.15).toFixed()
			let fahrenheitTemp = (Number(celsiusTemp) * (9 / 5) + 32).toFixed()
			return useOptionsStore().weather.useCelsius ? celsiusTemp : fahrenheitTemp
		},
		weatherConditions: (state) => {
			if (!state.weather?.timestamp || !state.weather.weather.length) {
				return 'No weather data available'
			}

			let conditionCode = state.weather.weather[0].id
			let conditionText: string = ''
			if (conditionCode in conditions) {
				conditionText = useOptionsStore().weather.descriptive
					? conditions[conditionCode as keyof typeof conditions][0]
					: conditions[conditionCode as keyof typeof conditions][1]
			} else {
				conditionText = 'Conditions unknown'
			}
			return conditionText
		},
		weatherInvalidated: (state) => {
			let invalidated =
				!state.weather?.timestamp ||
				Number(Date.now()) - state.weather?.timestamp >= 30 * 60 * 1000
			return invalidated
		},
	},
	actions: {
		startClock() {
			this.date = new Date()
			useInstanceStore().setCorrectingInterval(
				() => {
					console.log('setting time')
					return (this.date = new Date())
				},
				1000,
				'time',
			)
		},
		refreshWeatherWithStoredPosition() {
			if (!this.position.latitude || !this.position.longitude) {
				return console.warn(
					'No location data available -- skipping weather fetch',
				)
			}
			this.refreshWeatherIfInvalidated(
				this.position.latitude,
				this.position.longitude,
			)
		},
		pauseWeatherFetchWhenHidden() {
			document.addEventListener('visibilitychange', () => {
				if (this.init && document.hidden) {
					// page became hidden. pausing weather fetch interval
					console.log('page hidden -- clearing weather interval')
					useInstanceStore().clearInterval('weather')
					console.log('weather intervals', useInstanceStore().intervalIds)
				} else {
					// page became visible. restarting weather fetch interval
					console.log('page visible -- restarting weather interval')
					this.refreshWeatherWithStoredPosition()
					this.subscribeToWeather()
				}
			})
		},
		initialize() {
			this.startClock()
			async function getLocalData() {
				return localStorage.getItem('data')
			}
			getLocalData().then(
				(data) => {
					if (data && data !== '') {
						const localData = JSON.parse(data)
						localData.date = new Date()
						this.$patch(localData)
						if (localData.position.latitude && localData.position.longitude) {
							this.refreshWeatherWithStoredPosition()
							this.subscribeToWeather()
							this.pauseWeatherFetchWhenHidden()
						}
					}
				},
				(err) => {
					console.warn(err)
				},
			)
			this.isChromeExtension = !!(
				window.chrome &&
				chrome.runtime &&
				chrome.runtime.id
			)
			this.init = true
			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('data', JSON.stringify(state))
				}
			})
		},
		async fetchPosition() {
			const getPosition = new Promise<GeolocationPosition>(
				(resolve, reject) => {
					this.$patch({
						position: { fetching: true },
					})
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							this.errors.location = ''
							setTimeout(() => {
								this.$patch({
									position: {
										fetching: false,
									},
								})
							}, 1000)
							resolve(pos)
						},
						(err) => {
							console.warn('Error fetching position', err)
							if (err.code in errorCodes) {
								this.errors.location =
									errorCodes.location[
										err.code.toString() as keyof typeof errorCodes.location
									]
							} else {
								this.errors.location = err.message ?? 'Unknown error'
							}
							console.log('set into storage', this.errors.location)
							this.$patch({
								position: {
									fetching: false,
								},
							})
							reject(err)
						},
					)
				},
			)
			setTimeout(() => {
				if (this.position.fetching) {
					this.$patch({
						position: {
							fetching: false,
						},
						errors: { location: 'Location fetch timed out' },
					})
				}
			}, 5 * 1000)
			return getPosition.then((pos) => {
				this.$patch({
					position: {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						timestamp: Number(Date.now()),
					},
				})
				return pos
			})
		},
		refreshWeatherIfInvalidated(latitude: number, longitude: number) {
			// don't fetch if no location data or recent data exists
			let invalidated =
				!this.weather?.timestamp ||
				Number(Date.now()) - this.weather?.timestamp >= 30 * 60 * 1000
			if (!invalidated)
				return console.log('Weather data still valid -- skipping weather fetch')

			// fetch new weather using last known position
			fetchWeather(latitude, longitude).then(
				(res) => {
					this.weather = {
						...this.weather,
						...res,
						timestamp: Number(Date.now()),
					}
				},
				(err: any) => {
					this.errors.weather = err.message
					console.warn('Error fetching weather', err)
				},
			)
		},
		subscribeToWeather() {
			useInstanceStore().clearInterval('weather')
			console.log('weather interval cleared', useInstanceStore().intervalIds)
			useInstanceStore().setCorrectingInterval(
				// check if refresh weather needed every 5 minutes.
				() => {
					this.refreshWeatherWithStoredPosition()
				},
				5 * 60 * 1000,
				'weather',
			)
		},
		async handleInitialFetch() {
			await this.fetchPosition().then(
				(pos) => {
					this.refreshWeatherIfInvalidated(
						pos.coords.latitude,
						pos.coords.longitude,
					)
					this.subscribeToWeather()
				},
				(err) => {
					return err
				},
			)
		},
	},
})
