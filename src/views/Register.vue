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
        闪念笔记 | 注册
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
        <label>验证码</label>
        <div class="flex flex-row">
          <input
            type="text"
            class="flex-auto border rounded p-2 outline-none mr-2"
            v-model="verifyCode"
          />
          <button
            class="flex-none p-2 border rounded w-28"
            @click="sendVerifyCode"
            :disabled="isSending"
          >
            {{ verifyCodeText }}
          </button>
        </div>
        <button
          @click="userRegister"
          class="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          注册
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
import UserService from "../service/UserService";
import CommonService from "../service/CommonService";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      phone: "",
      password: "",
      verifyCode: "",
      isSending: false,
      verifyCodeText: "发送验证码",
    });

    //发送验证码
    const sendVerifyCode = () => {
      if (!state.phone) {
        ElMessage.error("请输入手机号码");
        return;
      }
      CommonService.sendVerifyCode(state.phone, 1001).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("短信发送成功，请查收");

          state.isSending = true;
          let count = 60;
          let si = setInterval(() => {
            state.verifyCodeText = count;
            count--;
            if (count == 0) {
              clearInterval(si);
              state.isSending = false;
              state.verifyCodeText = "发送验证码";
            }
          }, 1000);
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    //用户注册
    const userRegister = () => {
      if (!(state.phone && state.password && state.verifyCode)) {
        ElMessage.error("账号/密码/验证码必填");
        return;
      }
      UserService.userRegister(
        state.phone,
        state.password,
        state.verifyCode
      ).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("注册成功，请登录");
          router.push("/login");
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    return {
      ...toRefs(state),
      sendVerifyCode,
      userRegister,
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