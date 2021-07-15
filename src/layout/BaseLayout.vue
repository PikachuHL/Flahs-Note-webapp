<template>
  <div class="mx-auto app-container">
    <div class="flex box-border">
      <!-- side -->
      <div class="flex-none w-64">
        <!-- title -->
        <board-title />
        <div class="px-3">
          <!-- data -->
          <user-data />
          <!-- stat grid -->
          <stat-grid />
        </div>
        <!-- menu -->
        <menu-list />
        <!-- Tag -->
        <tag-list />
      </div>
      <div class="flex-auto ml-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import BoardTitle from "../components/BoardTitle.vue";
import MenuList from "../components/MenuList.vue";
import TagList from "../components/TagList.vue";
import UserData from "../components/UserData.vue";
export default {
  components: { BoardTitle, UserData, MenuList, TagList },
  setup() {
    const store = useStore();
    //一些初始化操作
    // 加载Tag列表
    store.dispatch("getAllTags");
    // 加载用户信息
    store.dispatch("getUserInfo");
  },
};
</script>

<style lang="postcss">
html,
body {
  height: 100%;
  box-sizing: border-box;
  background-color: #fafafa;
}
#app {
  box-sizing: border-box;
}
.app-container {
  width: 888px;
  box-sizing: border-box;
}
.card-shadow {
  box-shadow: 0px 1px 10px -1px rgba(165, 153, 153, 0.75);
  -webkit-box-shadow: 0px 1px 10px -1px rgba(165, 153, 153, 0.75);
  -moz-box-shadow: 0px 1px 10px -1px rgba(165, 153, 153, 0.75);
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(13deg, #c7ceff 14%, #f9d4ff 64%);
}
::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 2px;
  box-shadow: inset 7px 10px 12px #f0f0f0;
}
</style>