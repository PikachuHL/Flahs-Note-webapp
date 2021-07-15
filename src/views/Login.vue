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
        闪念笔记
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
        <label>账号</label>
        <input
          type="text"
          class="border rounded p-2 outline-none"
          placeholder="请输入手机号码"
          v-model="phone"
        />
        <label>密码</label>
        <input
          type="password"
          class="border rounded p-2 outline-none"
          placeholder="请输入密码"
          v-model="password"
        />
        <button
          @click="login"
          class="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          登录
        </button>
        <div class="flex flex-row justify-between">
          <router-link to="/userRegister" class="text-sm text-blue-500"
            >注册账号</router-link
          >
          <router-link to="/forget/checkUser" class="text-sm text-blue-500"
            >忘记密码</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import UserService from "../service/UserService";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const data = reactive({
      phone: "",
      password: "",
    });

    const login = () => {
      if (!(data.phone && data.password)) {
        ElMessage.error("账号/密码必填");

        return;
      }
      UserService.login(data.phone, data.password).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("登录成功");
          //localStorage.setItem("x-token", resp.data.tokenValue);
          store.commit("setUser", resp.data);
          router.push("/home");
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    return {
      ...toRefs(data),
      login,
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