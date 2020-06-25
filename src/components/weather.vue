<template>
    <div v-if="storedWeather.hasData" class="wrapper">
        <div class="weather-items">
            <p class="temp">{{ formattedTemp }}</p>
            <div class="wi-bg">
                <i
                    :class="
                        storedWeather.hasData
                            ? weatherIconClass
                            : 'wi wi-cloud-refresh'
                    "
                />
            </div>
            <p class="conditions" :class="text.subtitle">
                {{ weatherConditions }}
            </p>
        </div>
    </div>
    <transition name="prompt">
        <div v-if="shouldFetchNewPosition" class="location-prompt">
            <div class="row separated">
                <div class="alert-container">
                    <v-alert style="width: 24px; height: 24px;" />
                </div>
                <p :class="text.label" class="alert-text">
                    Lavender needs permission to fetch your location.
                </p>
            </div>
            <p :class="text.base">
                Data will be used to update weather for your region.
            </p>
            <div class="space-small"></div>
            <div class="row even">
                <button
                    :class="button.primary"
                    @click="fetchPositionAndWeather"
                >
                    Fetch location
                </button>
            </div>
            <div v-if="error" :class="text.base">
                Failed to fetch location. Please try again.
            </div>
        </div>
    </transition>
</template>

<script>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import text from './text.module.css'
import button from './button.module.css'
import VAlert from '../assets/icons/alert.vue'

import {
    invalidateProperty,
    fetchNewPosition,
    fetchWeather,
    setCorrectingInterval,
} from '@/utils/helpers'

export default {
    components: {
        VAlert,
    },
    setup() {
        let store = useStore()
        let storeInitialized = computed(() => store.state.init)
        let shouldFetchNewPosition = ref(false)
        let shouldFetchNewWeather = ref(false)
        watch(storeInitialized, () => {
            startRefreshLoop()
        })
        let storedWeather = computed(() => store.state.weather)
        let weatherIconClass = computed(() => store.getters.weatherIconClass)
        let formattedTemp = computed(() => store.getters.formattedTemp)
        let weatherConditions = computed(() => store.getters.weatherConditions)
        let error = ref(null)
        function fetchPositionAndWeather() {
            shouldFetchNewPosition.value = false
            fetchNewPosition()
                .then(() => {
                    error.value = null
                    fetchWeather()
                })
                .catch((err) => {
                    error.value = err
                    shouldFetchNewPosition.value = true
                })
        }

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

        function invalidateAndRefresh() {
            shouldFetchNewWeather.value = invalidateProperty(
                store.state.weather.timestamp,
                10 * 60 * 1000
            )
            shouldFetchNewPosition.value = invalidateProperty(
                store.state.position.timestamp,
                30 * 24 * 60 * 60 * 1000
            )
            refreshWeather()
        }

        function startRefreshLoop() {
            invalidateAndRefresh()
            setCorrectingInterval(() => {
                invalidateAndRefresh()
            }, 10 * 1000)
        }

        return {
            fetchPositionAndWeather,
            storedWeather,
            weatherIconClass,
            formattedTemp,
            weatherConditions,
            text,
            button,
            shouldFetchNewPosition,
            error,
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
    align-items: center;
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
.location-prompt {
    position: fixed;
    top: var(--page-padding);
    left: 50%;
    margin-left: -160px;
    background-color: white;
    padding: var(--space-small);
    border-radius: var(--rounded);
    border: var(--border);
    width: 320px;
}
.prompt-enter-active,
.prompt-leave-active {
    transition: ease-in-out all 200ms;
}
.prompt-enter-from,
.prompt-leave-to {
    opacity: 0;
    top: -20%;
}
.prompt-enter-to,
.prompt-leave-from {
    opacity: 1;
    top: var(--page-padding);
}
.alert-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--rounded-full);
    background-color: var(--theme-bg);
}
.alert-text {
    max-width: 240px;
}
</style>
