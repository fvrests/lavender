<template>
    <div class="item-wrapper">
        <div class="text" style="font-weight: bold">{{ text }}</div>
        <div class="switch-container">
            <label class="switch" :for="option">
                <input
                    :id="option"
                    type="checkbox"
                    @change="toggle"
                    :checked="initialValue"
                />
                <div class="slider round"></div>
            </label>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        text: { type: String, required: true },
        option: { type: String, required: true }
    },
    setup(props) {
        let store = useStore()
        let initialValue = computed(() => store.state[props.option])

        function toggle() {
            store.commit('toggleProperty', props.option)
        }

        return { initialValue, toggle }
    }
}
</script>

<style scoped>
/* general styling */
.switch-container {
    transform: scale(0.4);
    margin-right: 8px;
}
.item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;
}

/* switches */
.switch {
    display: inline-block;
    height: 34px;
    position: relative;
    width: 60px;
}

.switch input {
    display: none;
}

.slider {
    box-sizing: border-box;
    background-color: var(--color-light-gray);
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
    border: 4px solid var(--color-soft-gray);
}

.slider:before {
    box-sizing: border-box;
    background-color: white;
    bottom: -3px;
    content: '';
    height: 32px;
    left: -4px;
    position: absolute;
    transition: 0.4s;
    width: 32px;
    border: 4px solid var(--color-soft-gray);
}

input:checked + .slider {
    background-color: var(--theme-bg);
}

input:checked + .slider:before {
    transform: translateX(28px);
    background-color: white;
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
