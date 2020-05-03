<template>
  <div>
    <h2>time</h2>
    <h2>{{ today }}</h2>
    <h2>{{ time }}</h2>
    <h2>{{ useMilitaryTime }}</h2>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import store from '@/store'
import { format } from 'date-fns'
import { setCorrectingInterval } from '@/utils/helpers'

export default {
  created() {
    this.getTime()
    setCorrectingInterval(() => this.getTime(), 1000)
  },
  setup() {
    let newDate = ref(new Date())
    let today = computed(() => format(newDate.value, 'LLLL do, yyyy'))
    let time = computed(() =>
      store.state.useMilitaryTime
        ? format(newDate.value, 'h:mm:ss B')
        : format(newDate.value, 'HH:mm:ss')
    )

    function getTime() {
      newDate.value = new Date()
    }

    return { today, getTime, time }
  }
}
</script>
