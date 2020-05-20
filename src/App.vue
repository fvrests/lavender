<template>
    <div class="wrapper">
        <v-icon style="width: 128px; height: 128px;" />
        <v-time />
        <v-weather />
        <v-options />
    </div>
</template>

<script>
import VWeather from './components/weather.vue'
import VOptions from './components/options.vue'
import VTime from './components/time.vue'
import VIcon from './assets/icons/icon.vue'

export default {
    name: 'App',
    components: {
        VWeather,
        VOptions,
        VTime,
        VIcon
    }
}
</script>

<style>
@import './assets/styles/normalize.css';
@import './assets/styles/weather-icons.min.css';

body {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #222222;
    color: white;
    min-height: 100vh;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    min-height: 100vh;
}
</style>
