<template>
    <div class="wrapper">
        <div v-if="store.state.timeFormat == 'horizontal'" class="time">
            <div>{{ hour }}:{{ minute }}</div>
        </div>
        <div v-else class="time">
            <div class="outline">
                <div class="monospaced">
                    <span>{{ hour[0] }}</span
                    ><span>{{ hour[1] }}</span>
                </div>
                <div class="monospaced">
                    <span>{{ minute[0] }}</span
                    ><span>{{ minute[1] }}</span>
                </div>
            </div>
        </div>
        <div class="space-small" />
        <div v-if="!store.state.useMilitaryTime" class="italic">
            {{ descriptor }}
        </div>
        <div v-else class="italic">
            today is
        </div>
        <div class="today">{{ today }}</div>
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

<style scoped>
.wrapper {
    grid-area: middle;
    text-align: center;
}
.time {
    font-size: 96px;
    line-height: 96px;
    font-weight: bold;
}
.monospaced {
    display: flex;
}
.monospaced > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1ch;
}
.outline {
    border: 3px solid var(--color-dark-gray);
    padding: var(--space-small);
}
.italic {
    text-transform: uppercase;
    font-size: 14px;
    font-style: italic;
}
.today {
    /* text-transform: none; */
    font-weight: bold;
}
</style>
