<template>
    <div class="wrapper">
        <div class="weather-items">
            <p v-if="storedWeather.hasData" class="temp">
                {{ formattedTemp }}
            </p>
            <div class="wi-bg">
                <i
                    :class="
                        storedWeather.hasData
                            ? weatherIconClass
                            : 'wi wi-cloud-refresh'
                    "
                />
            </div>
            <p v-if="storedWeather.hasData" class="conditions">
                {{ weatherConditions }}
            </p>
        </div>
        <div v-if="shouldFetchNewPosition" class="location-prompt">
            <button @click="fetchPositionAndWeather">
                get location
            </button>
        </div>
    </div>
</template>

<script>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'

import {
    invalidateProperty,
    fetchPositionAndWeather,
    fetchWeather,
    setCorrectingInterval,
} from '@/utils/helpers'

export default {
    setup() {
        let store = useStore()
        let storeInitialized = computed(() => store.state.init)
        let shouldFetchNewWeather = ref(null)
        let shouldFetchNewPosition = ref(null)
        watch(storeInitialized, () => {
            refreshWeather()
            setCorrectingInterval(() => {
                shouldFetchNewWeather.value = invalidateProperty(
                    store.state.weather.timestamp,
                    10 * 60 * 1000
                )

                shouldFetchNewPosition.value = invalidateProperty(
                    store.state.position.timestamp,
                    30 * 24 * 60 * 60 * 1000
                )
                refreshWeather()
            }, 10 * 1000)
        })
        let storedWeather = computed(() => store.state.weather)
        let weatherIconClass = computed(() => store.getters.weatherIconClass)
        let formattedTemp = computed(() => store.getters.formattedTemp)
        let weatherConditions = computed(() => store.getters.weatherConditions)
        function refreshWeather() {
            if (!shouldFetchNewWeather.value) {
                return console.log(
                    'weather is recent. using stored weather data.',
                    'age of timestamp:',
                    (
                        (Date.now() - store.state.weather.timestamp) /
                        1000
                    ).toFixed(),
                    'seconds'
                )
            } else if (shouldFetchNewPosition.value) {
                if (!store.state.position.hasData) {
                    return console.log(
                        'awaiting user input to fetch location data...'
                    )
                } else {
                    return console.log(
                        'location exists but is too old. please click to get new location...'
                    )
                }
            } else {
                fetchWeather()
                return console.log(
                    'using last known position to fetch weather...'
                )
            }
        }

        return {
            fetchPositionAndWeather,
            storedWeather,
            weatherIconClass,
            formattedTemp,
            weatherConditions,
        }
    },
}
</script>

<style scoped>
.wrapper {
    grid-area: bottom;
    text-align: center;
}
.wi {
    font-size: var(--text-large);
    color: var(--color-dark-gray);
    background-color: var(--theme-bg);
    height: var(--space-large);
    width: var(--space-large);
    border-radius: var(--rounded-full);
    line-height: 64px;
}
.weather-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 8px;
}
.temp {
    grid-column: 1;
    justify-self: right;
}
.wi-bg {
    display: flex;
    grid-column: 2;
    justify-self: center;
}
.conditions {
    grid-column: 3;
    justify-self: left;
}
p {
    margin-top: 24px;
    text-transform: uppercase;
}
.location-prompt button {
    position: fixed;
    bottom: var(--page-padding);
    transform: translateX(-50%);
    margin: 0 auto;
}
</style>
