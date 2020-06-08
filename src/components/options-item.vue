<template>
    <div class="item-wrapper">
        <div class="container">
            <label class="switch" :for="option">
                <input
                    :id="option"
                    type="checkbox"
                    @change="handleChange"
                    :checked="initialValue"
                />
                <div class="slider round"></div>
            </label>
        </div>
        <p class="text">{{ text }}</p>
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

        function handleChange() {
            console.log('option to change', props.option)
            store.commit('toggleProperty', props.option)
            console.log('new option value', store.state[props.option])
        }

        return { initialValue, handleChange }
    }
}
</script>

<style scoped>
/* general styling */

.container {
    transform: scale(0.5);
    margin-right: 8px;
}
.item-wrapper {
    display: flex;
    align-items: center;
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
    background-color: var(--color-cloud);
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
}

.slider:before {
    background-color: white;
    bottom: 4px;
    content: '';
    height: 26px;
    left: 4px;
    position: absolute;
    transition: 0.4s;
    width: 26px;
}

input:checked + .slider {
    background-color: var(--color-dark-gray);
}

input:checked + .slider:before {
    transform: translateX(26px);
    background-color: white;
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
