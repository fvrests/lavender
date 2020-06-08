<template>
    <div class="wrapper">
        <div class="row">
            <p class="temp" v-if="storedWeather.hasData">{{ formattedTemp }}</p>
            <div class="wi-bg">
                <i
                    :class="
                        storedWeather.hasData
                            ? weatherIconClass
                            : 'wi wi-cloud-refresh'
                    "
                ></i>
            </div>
            <p class="conditions" v-if="storedWeather.hasData">
                {{ weatherConditions }}
            </p>
        </div>
        <div class="location-prompt" v-if="shouldFetchNewPosition">
            <button @click="fetchPositionAndWeather">get location</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import {
    invalidateProperty,
    fetchPositionAndWeather,
    fetchWeather
} from '@/utils/helpers'

export default {
    components: {},
    // created() {
    //     setCorrectingInterval(
    //         () => this.refreshWeather(),
    //         30 * 60 * 1000,
    //         false
    //     )
    // },
    data() {
        return {
            fetchPositionAndWeather
        }
    },
    methods: {
        refreshWeather() {
            if (!this.shouldFetchNewWeather)
                return console.log(
                    'weather is recent. using stored weather data'
                )
            if (this.shouldFetchNewPosition) {
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
    },
    watch: {
        storeInitialized: function() {
            console.log('refreshing weather:')
            this.refreshWeather()
        },
        shouldFetchNewWeather: function() {
            this.refreshWeather()
        }
    },
    computed: {
        ...mapGetters([
            'weatherIconClass',
            'formattedTemp',
            'weatherConditions'
        ]),
        storeInitialized: function() {
            return store.state.init
        },
        storedWeather: function() {
            return store.state.weather
        },
        shouldFetchNewWeather: function() {
            // invalidate weather after 15 minutes - keeps temp & conditions current
            if (store.state.init) {
                return invalidateProperty(
                    store.state.weather.timestamp,
                    15 * 60 * 1000
                )
            } else return null
        },
        shouldFetchNewPosition: function() {
            // invalidate position after 30 days - req'd by google maps api
            if (store.state.init) {
                return invalidateProperty(
                    store.state.position.timestamp,
                    30 * 24 * 60 * 60 * 1000
                )
            } else return null
        }
    }
}
</script>

<style scoped>
.wrapper {
    grid-area: bottom;
}
.wi {
    font-size: 36px;
    color: var(--color-dark-gray);
    background-color: var(--theme-bg);
    height: 64px;
    width: 64px;
    border-radius: 32px;
    line-height: 64px;
}
.row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 4px;
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
    bottom: 32px;
    transform: translateX(-50%);
    margin: 0 auto;
    background-color: var(--color-dark-gray);
    color: white;
    font-weight: bold;
    height: 24px;
    border-radius: 12px;
    padding: 0px 12px;
}
</style>
