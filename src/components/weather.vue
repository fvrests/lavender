<template>
    <p>{{ msg }}</p>
    <div class="wi-bg">
        <i
            :class="
                storedWeather.hasData ? weatherIconClass : 'wi wi-cloud-refresh'
            "
            @click="refreshWeather"
        ></i>
    </div>
    <br />
    <p v-if="storedWeather.hasData">
        it's {{ formattedTemp }} degrees and
        {{ storedWeather.weather[0].main }} in {{ storedWeather.name }},
        {{ storedWeather.sys.country }}
    </p>
    <p v-else>pls click the cloud to get weather data!</p>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import {
    invalidateProperty,
    fetchNewPosition,
    fetchWeather
} from '@/utils/helpers'

let { weather, position } = store.state
// invalidate weather after 30 minutes - keeps temp & conditions current
let shouldFetchNewWeather = invalidateProperty(weather.timestamp, 30 * 60)

// invalidate position after 30 days - reqd by google maps api
let shouldFetchNewPosition = invalidateProperty(
    position.timestamp,
    30 * 24 * 60 * 60
)

export default {
    components: {},
    props: ['msg'],
    methods: {
        refreshWeather() {
            fetchNewPosition().then(() => {
                fetchWeather()
            })
        },
        getWeather() {
            // fetch weather only if data is old or nonexistent
            if (!shouldFetchNewWeather) return
            if (shouldFetchNewPosition) fetchNewPosition()
            fetchWeather()
        }
    },
    computed: {
        ...mapGetters(['weatherIconClass', 'formattedTemp']),
        storedWeather: function() {
            return store.state.weather
        }
    }
}
</script>

<style scoped>
.wi {
    font-size: 24px;
    color: #232836;
    background-color: #ffffffe6;
    height: 64px;
    width: 64px;
    border-radius: 32px;
    line-height: 64px;
}
.wi-bg {
    display: flex;
    justify-content: center;
}
</style>
