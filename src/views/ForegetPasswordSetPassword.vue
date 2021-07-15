<template>
  <div class="login flex justify-center items-center">
    <div class="bg-white rounded shadow" style="width: 600px">
      <div class="p-4 text-xl text-center border-b">
        <svg
          class="w-5 h-5 inline-block text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        闪念笔记 | 忘记密码
        <svg
          class="w-5 h-5 inline-block text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      </div>
      <div class="flex flex-col p-4 space-y-2">
        <label>新密码</label>
        <input
          type="password"
          class="border rounded p-2 outline-none"
          placeholder="请输入密码"
          v-model="newPwd"
        />
        <label>确认新密码</label>
        <input
          type="password"
          class="border rounded p-2 outline-none"
          placeholder="请输入密码"
          v-model="repeatPwd"
        />
        <button
          @click="onSave"
          class="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          保存
        </button>
        <router-link to="/login" class="text-sm text-blue-500"
          >登录</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import UserService from "../service/UserService";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      token: route.params.token,
      newPwd: "",
      repeatPwd: "",
    });

    const onSave = () => {
      if (!(state.newPwd && state.repeatPwd)) {
        ElMessage.error("请输入密码");
        return;
      }
      if (state.newPwd != state.repeatPwd) {
        ElMessage.error("两次密码不一致");
        return;
      }
      UserService.forgetPasswordSetNewPassword(
        state.token,
        state.newPwd,
        state.repeatPwd
      ).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("密码设置成功，请登录");
          router.push("/login");
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    return {
      ...toRefs(state),
      onSave,
    };
  },
};
</script>

<style>
.login {
  height: 100%;
  background: url("../assets/login_bg.jpg") no-repeat;
  background-size: cover;
}
</style>