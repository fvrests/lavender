<template>
    <div class="wrapper">
        <div v-if="store.state.useHorizontalTime" class="time">
            <h2>{{ hour }}:{{ minute }}</h2>
        </div>
        <div v-else class="time">
            <div class="outline">
                <div class="mono">
                    <span>{{ hour[0] }}</span
                    ><span>{{ hour[1] }}</span>
                </div>
                <div class="mono">
                    <span>{{ minute[0] }}</span
                    ><span>{{ minute[1] }}</span>
                </div>
            </div>
        </div>
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
        setCorrectingInterval(() => this.getTime(), 1000, true)
    },
    setup() {
        let store = useStore()
        let newDate = ref(new Date())
        let today = computed(() => format(newDate.value, 'LLLL do, yyyy'))
        let hour = computed(() =>
            store.state.useMilitaryTime
                ? format(newDate.value, 'HH')
                : format(newDate.value, 'hh')
        )
        let minute = computed(() => format(newDate.value, 'mm'))
        let descriptor = computed(() => format(newDate.value, 'B'))

        function getTime() {
            newDate.value = new Date()
        }
        return { today, getTime, hour, minute, descriptor, store }
    }
}
</script>

<style>
.wrapper {
    grid-area: middle;
}
.time {
    font-size: 96px;
    line-height: 96px;
    font-weight: bold;
    margin-bottom: 12px;
}
.descriptor {
    font-size: 14px;
    text-transform: uppercase;
    font-style: italic;
}
.today {
    font-weight: bold;
}
.mono {
    display: flex;
}
.mono > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1ch;
}
.outline {
    border: 3px solid #222222;
    padding: 12px;
}
</style>
