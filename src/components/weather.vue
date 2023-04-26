<template>
    <div v-if="storedWeather.hasData" class="wrapper">
        <div class="weather-items">
            <p class="temp" :class="text.subtitle">
                {{ formattedTemp }} degrees
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
            <p class="conditions" :class="text.subtitle">
                {{ weatherConditions }}
            </p>
        </div>
    </div>
    <transition name="prompt">
        <div
            v-if="
                storeInitialized &&
                requestPosition &&
                !fetchingPosition &&
                !positionDeclined
            "
            class="location-prompt"
        >
            <div class="row">
                <div
                    class="alert-container"
                    style="margin-right: var(--space-small);"
                >
                    <v-alert style="width: 24px; height: 24px;" />
                </div>

                <p :class="text.label">
                    Lavender needs permission to fetch your location.
                </p>
            </div>

            <p :class="text.base" style="padding-left: 38px;">
                Location is used to fetch local weather data. You can always
                enable this later in settings.
            </p>
            <div class="space-small"></div>
            <div class="row" style="justify-content: center;">
                <button :class="button.primary" @click="handleFetch">
                    Fetch location
                </button>
                <button :class="button.secondary" @click="handleDecline">
                    Not now
                </button>
            </div>

            <div class="space-small"></div>
            <div v-if="fetchError" :class="text.base">
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

import { setCorrectingInterval, fetchWeather } from '@/utils/helpers'

export default {
    components: {
        VAlert,
    },
    setup() {
        let store = useStore()
        let storeInitialized = computed(() => store.state.init)
        let positionData = computed(() => store.state.position.hasData)
        let requestPosition = computed(() => !store.state.position.hasData)
        let fetchError = ref(null)
        let storedWeather = computed(() => store.state.weather)
        let weatherIconClass = computed(() => store.getters.weatherIconClass)
        let formattedTemp = computed(() => store.getters.formattedTemp)
        let weatherConditions = computed(() => store.getters.weatherConditions)
        let fetchingPosition = computed(() => store.state.position.fetching)
        let positionDeclined = computed(() => store.state.position.declined)

        // fetches new weather if needed & waits for new location if none is stored
        function refreshWeather() {
            let invalidated =
                !store.state.weather.timestamp ||
                Date.now() - store.state.weather.timestamp >= 30 * 60 * 1000
            if (!invalidated) {
                return
                // console.log(
                //     'weather is recent. using stored weather data.',
                //     'age of timestamp:',
                //     (
                //         (Date.now() - store.state.weather.timestamp) /
                //         1000
                //     ).toFixed(),
                //     'seconds'
                // )
            } else if (!store.state.position.hasData) {
                return
                // console.log(
                //     'awaiting user input to fetch location data...'
                // )
            } else {
                fetchWeather()
                return
                // console.log(
                //     'using last known position to fetch weather...'
                // )
            }
        }

        function startRefreshLoop() {
            refreshWeather()
            setCorrectingInterval(() => {
                refreshWeather()
            }, 5 * 60 * 1000)
        }
        watch(storeInitialized, () => {
            startRefreshLoop()
        })
        watch(positionData, () => {
            refreshWeather()
        })

        function handleFetch() {
            fetchError = store.dispatch('fetchPosition')
        }
        function handleDecline() {
            store.commit('update', {
                key: 'position',
                value: { ...store.state.position, declined: true },
            })
        }

        return {
            storedWeather,
            weatherIconClass,
            formattedTemp,
            weatherConditions,
            text,
            button,
            store,
            requestPosition,
            handleFetch,
            handleDecline,
            fetchError,
            fetchingPosition,
            storeInitialized,
            positionDeclined,
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
    color: var(--theme-fg);
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
    background-color: var(--ui-bg);
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
</style>
