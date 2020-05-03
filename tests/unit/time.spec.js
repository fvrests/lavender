import { shallowMount } from '@vue/test-utils'
import Time from '@/components/time.vue'

describe('time.vue', () => {
  test('is a vue instance', () => {
    const wrapper = shallowMount(Time)

    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
