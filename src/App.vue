<template>
    <div class="app-wrapper">
        <v-time />
        <v-weather />
        <v-options />
    </div>
</template>

<script>
import VWeather from './components/weather.vue'
import VOptions from './components/options.vue'
import VTime from './components/time.vue'
import store from '@/store'
import { onBeforeUnmount } from 'vue'

export default {
    name: 'App',
    components: {
        VWeather,
        VOptions,
        VTime
    },
    setup() {
        store.commit('initializeStore')
        console.log('store initialized 🥳', store.state)

        store.subscribe((mutations, state) => {
            if (state.init)
                chrome.storage.sync.set({
                    ...state,
                    lastSynced: Date.now()
                })
        })

        onBeforeUnmount(() => {
            store.unsubscribe()
        })
    }
}
</script>

<style>
@import './assets/styles/normalize.css';
@import './assets/styles/weather-icons.min.css';
@import './assets/styles/global.css';
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
</style>
