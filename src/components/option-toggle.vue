<template>
    <button class="item-wrapper" @click="toggle">
        <div class="row">
            <div :class="text.label">{{ label }}</div>
            <div :class="text.sublabel">{{ sublabel }}</div>
        </div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="toggle"
            :class="selected ? 'selected' : ''"
        >
            <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
            <circle :cx="selected ? 16 : 8" cy="12" r="4" />
        </svg>
    </button>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import text from './text.module.css'

export default {
    props: {
        label: { type: String, required: true },
        option: { type: String, required: true },
        sublabel: { type: String, required: false, default: '' },
    },
    setup(props) {
        let store = useStore()
        let selected = computed(() => store.state[props.option])

        function toggle() {
            store.commit('toggleProperty', props.option)
        }

        return { selected, toggle, text }
    },
}
</script>

<style scoped>
/* general styling */
.item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;
}
svg.toggle > rect,
svg.toggle > circle {
    transition: all 200ms ease-in-out;
}
svg.toggle.selected > circle {
    fill: white;
}
svg.toggle > circle {
    fill: var(--theme-bg);
}
svg.toggle > rect {
    fill: white;
}
svg.toggle.selected > rect {
    fill: var(--theme-bg);
}
</style>
