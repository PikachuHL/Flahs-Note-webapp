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
        <label>账号</label>
        <input
          type="text"
          class="border rounded p-2 outline-none"
          placeholder="请输入手机号码"
          v-model="phone"
        />
        <label>验证码</label>
        <div class="flex flex-row items-center">
          <input
            type="text"
            class="flex-auto border rounded p-2 outline-none mr-2"
            v-model="imageCaptchaText"
          />
          <img
            :src="imageUrl"
            class="flex-none border rounded w-28"
            alt=""
            v-if="imageUrl"
          />
          <svg
            class="w-4 h-4 ml-2 text-gray-500 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="getImage"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </div>
        <button
          @click="onValidateUser"
          class="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          立即验证
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
import { useRouter } from "vue-router";
import CommonService from "../service/CommonService";
import UserService from "../service/UserService";

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      phone: "",
      imageCaptchaText: "",
      captchaToken: "",
      imageUrl: "",
    });
    //获取验证码图片
    const getImage = () => {
      CommonService.getVerifyCodeImage().then((resp) => {
        if (resp.code == 0) {
          state.captchaToken = resp.data.captchaToken;
          state.imageUrl = resp.data.imageBase64;
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    getImage();
    //验证用户有效性
    const onValidateUser = () => {
      UserService.forgetPasswordValidateUser(
        state.phone,
        state.captchaToken,
        state.imageCaptchaText
      ).then((resp) => {
        if (resp.code == 0) {
          router.push("/forget/sendVerifyCode/" + resp.data);
        } else {
          ElMessage.error(resp.message);
          getImage();
        }
      });
    };

    return {
      ...toRefs(state),
      getImage,
      onValidateUser,
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