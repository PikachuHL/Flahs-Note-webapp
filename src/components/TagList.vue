<template>
  
  <!-- Tag List -->
  <div class="text-yellow-600 text-sm mt-4 font-bold px-2">标签</div>
  <ul class="mt-1">
    <li
      class="
        text-sm text-gray-400
        hover:bg-gray-200
        hover:text-gary-500
        rounded
        py-2
        px-2
      "
      v-for="(item, index) in tagList"
      :key="index"
    >
      <router-link class="block" :to="tagLink(item)">{{ item }}</router-link>
    </li>
  </ul>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  setup() {
    const store = useStore();

    const tagLink = (tagName) => {
      tagName = tagName.substring(1);
      return `/home?tagName=${tagName}`;
    };

    return {
      tagList: computed(() => store.state.tagList),
      tagLink,
    };
  },
};
</script>

<style>
</style>