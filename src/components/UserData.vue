<template>
  <div class="flex flex-row justify-between mt-4">
    <div class="flex flex-col items-center font-bold text-gray-400 text-sm">
      <span>{{ userInfo.memoNums }}</span>
      <span>MEMO</span>
    </div>
    <div class="flex flex-col items-center font-bold text-gray-400 text-sm">
      <span>{{ userInfo.tagNums }}</span>
      <span>TAG</span>
    </div>
    <div class="flex flex-col items-center font-bold text-gray-400 text-sm">
      <span>{{ userInfo.joinDays }}</span>
      <span>DAY</span>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  setup() {
    const store = useStore();

    return {
      userInfo: computed(() => store.state.userInfo),
    };
  },
};
</script>

<style>
</style>