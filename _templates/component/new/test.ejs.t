---
to: tests/unit/<%=name%>.spec.js
---
import { shallowMount } from "@vue/test-utils";
import <%=Name%> from "@/components/<%=name%>.vue";

describe("<%=name%>.vue", () => {
  test("is a vue instance", () => {
    const wrapper = shallowMount(<%=Name%>)

    expect(wrapper.isVueInstance()).toBeTruthy()
  })
});

