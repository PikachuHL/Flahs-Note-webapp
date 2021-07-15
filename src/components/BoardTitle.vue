<template>
  <div class="flex items-center mt-4">
    <svg aria-hidden="true" class="w-4 h-4">
      <use xlink:href="#icon-shandian"></use>
    </svg>
    <span class="font-bold text-gray-500 mx-2">{{
      $store.state.user.nickName
    }}</span>
    <span class="font-bold bg-green-600 text-white rounded-md px-2 text-sm"
      >闪念笔记</span
    >
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>