<template>
    <div>
        <h2 class="time">{{ time }}</h2>
        <h2 class="descriptor">{{ descriptor }}</h2>
        <h2 class="today">{{ today }}</h2>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { setCorrectingInterval } from '@/utils/helpers'

export default {
    created() {
        // get time once then every second
        this.getTime()
        setCorrectingInterval(() => this.getTime(), 1000)

        // check if day or night once then every 15 minutes - used to set icons
        this.checkTimeOfDay()
        setCorrectingInterval(() => this.checkTimeOfDay(), 15 * 60 * 1000)
    },
    setup() {
        let store = useStore()
        let newDate = ref(new Date())
        let today = computed(() => format(newDate.value, 'LLLL do, yyyy'))
        let time = computed(() =>
            store.state.useMilitaryTime
                ? format(newDate.value, 'HH:mm')
                : format(newDate.value, 'h:mm')
        )
        let descriptor = computed(() => format(newDate.value, 'B'))

        function getTime() {
            newDate.value = new Date()
        }

        function checkTimeOfDay() {
            let hour = format(newDate.value, 'HH')
            let day = !!(hour > 4 && hour < 20)
            console.log('day:', day)
            store.commit('setIsDaytime', day)
            console.log('daytime set!', store.state.isDaytime)
        }

        return { today, getTime, time, checkTimeOfDay, descriptor }
    }
}
</script>

<style>
.time {
    font-size: 96px;
    color: pink;
    font-weight: bold;
}
.descriptor {
    font-size: 14px;
}
</style>
