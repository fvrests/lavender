import { defineStore } from 'pinia'
import { fetchWeather } from '../utils/helpers'
import conditions from '../utils/weather-conditions'
import { useOptionsStore } from './options'
import { useInstanceStore } from './instance'
import errorCodes from '../utils/error-codes.json'

interface Weather extends OpenWeatherResponse {
	timestamp: number | null
	fetching: boolean
}

const broadcastChannel = new BroadcastChannel('data')

export const useDataStore = defineStore('data', {
	state: () => ({
		init: false,
		isChromeExtension: false,
		weather: { timestamp: null, fetching: false as boolean } as Weather,
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
		weatherIconClass: (state) => {
			let iconClass = 'wi wi-cloud-refresh'
			if (state.weather?.timestamp) {
				let day = true
				day = !!(
					Number(useInstanceStore().date) / 1000 > state.weather.sys.sunrise &&
					Number(useInstanceStore().date) / 1000 < state.weather.sys.sunset
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
	},
	actions: {
		messageAllInstances(message: {}) {
			broadcastChannel.postMessage(JSON.stringify(message))
		},
		parseLocalData() {
			let localData = localStorage.getItem('data') ?? null
			if (localData) {
				return JSON.parse(localData.toString())
			}
		},
		initialize() {
			// todo: remove
			localStorage.setItem('weatherCalls', '0')

			// get data from localStorage
			const localData = this.parseLocalData()
			this.$patch(localData)

			// if location exists, fetch weather and subscribe to weather updates
			if (localData?.position.latitude && localData?.position.longitude) {
				this.refreshWeatherIfInvalidated()
				this.subscribeToWeather()
			}

			// check if running in chrome extension
			this.isChromeExtension = !!(
				window.chrome &&
				chrome.runtime &&
				chrome.runtime.id
			)

			this.init = true

			// setup broadcast channel for data updates from other tabs
			broadcastChannel.onmessage = (eventMessage) => {
				console.log('msg received', eventMessage.data)
				this.$patch(JSON.parse(eventMessage.data.toString()))
			}

			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('data', JSON.stringify(state))
				}
			})
		},
		async fetchPosition() {
			// fetch position and set into state
			const getPosition = new Promise<GeolocationPosition>(
				(resolve, reject) => {
					this.$patch({
						position: { fetching: true },
					})
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							// clear any previous errors
							this.errors.location = ''
							// clear fetching state after 1 second. prevents hanging on some browsers if location not enabled
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
			// allow 5 seconds for location fetch, otherwise time out. accounts for hanging behavior in some browsers
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
						fetching: false,
					},
				})
				this.messageAllInstances({ position: { ...this.position } })
				return pos
			})
		},
		refreshWeatherIfInvalidated(latitude?: number, longitude?: number) {
			// ignore if another instance is already fetching weather
			if (!this.weather.fetching) {
				this.weather.fetching = true
				this.messageAllInstances({ weather: { fetching: true } })

				// get local data to account for recent weather fetches in other tabs or windows
				let localData = this.parseLocalData()

				// invalidate if no timestamp or timestamp is older than 30 minutes
				// todo: set back to 30 min - 30*60*1000
				let invalidated =
					this.init &&
					(!localData.weather?.timestamp ||
						Number(Date.now()) - localData.weather?.timestamp >=
							0.25 * 60 * 1000)

				// don't fetch if data is still valid. set state with weather data from localStorage.
				if (!invalidated) {
					this.weather = localData.weather
					console.log('Weather data still valid -- skipping weather fetch')
					this.weather.fetching = false
					this.messageAllInstances({ weather: { fetching: false } })
					return
				}

				// don't fetch if no location data
				let lat = latitude ?? this.position.latitude ?? null
				let long = longitude ?? this.position.longitude ?? null
				if (!lat || !long) {
					console.warn('No location data available -- skipping weather fetch')
					this.weather.fetching = false
					this.messageAllInstances({ weather: { fetching: false } })
					return
				}

				// fetch new weather using passed in or stored location data
				fetchWeather(lat, long).then(
					(res) => {
						const timestamp = Date.now()
						console.log(
							'invalidated',
							invalidated,
							'calling weather api',
							timestamp,
						)

						// append weather data in state & update timestamp
						this.$patch({
							weather: {
								...res,
								timestamp: timestamp,
								fetching: false,
							},
						})
						// broadcast new data to other tabs / windows. include all data to sync position
						this.messageAllInstances({ ...this })

						// todo: remove -- track number of weather calls
						localStorage.setItem(
							'weatherCalls',
							localStorage.getItem('weatherCalls')
								? (Number(localStorage.getItem('weatherCalls')) + 1).toString()
								: '1',
						)
					},
					(err: any) => {
						this.errors.weather = err.message
						console.warn('Error fetching weather', err)
						localStorage.setItem(
							'weatherCalls',
							localStorage.getItem('weatherCalls')
								? (Number(localStorage.getItem('weatherCalls')) + 1).toString()
								: '1',
						)
						this.messageAllInstances({
							weather: { fetching: false },
						})
					},
				)
			} else {
				console.log(
					'another instance is already fetching weather. skipping fetch',
				)
			}
		},
		subscribeToWeather() {
			// try refresh weather if needed every 5 minutes.
			// todo: set back to 5 min - 5*60*1000
			useInstanceStore().setCorrectingInterval(
				() => {
					this.refreshWeatherIfInvalidated()
				},
				0.5 * 60 * 1000,
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
		reset() {
			if (this.isChromeExtension) chrome?.storage?.sync?.clear()
			this.$reset()
		},
	},
})
