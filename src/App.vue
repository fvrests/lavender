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
import './assets/styles/normalize.css'
import './assets/styles/weather-icons.min.css'
import './assets/styles/global.css'

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

<style scoped>
.app-wrapper {
    display: grid;
    grid-template-areas:
        'top top top'
        'left middle right'
        'bottom bottom bottom';
    justify-items: center;
    align-items: center;
    min-height: 100vh;
    padding: var(--space-medium);
}
</style>
