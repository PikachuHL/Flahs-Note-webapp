<template>
  <div class="mt-4">
    <h3 class="font-bold mb-4">账号设置</h3>
    <el-form label-position="top" class="bg-white px-4 py-2 shadow-sm">
      <el-form-item label="昵称" required>
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSaveNickName">保存</el-button>
      </el-form-item>
    </el-form>
    <h3 class="font-bold my-4">密码设置</h3>
    <el-form class="bg-white px-4 py-2 shadow-sm" label-position="top">
      <el-form-item label="原始密码" required>
        <el-input type="password" v-model="form.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" required>
        <el-input type="password" v-model="form.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" required>
        <el-input type="password" v-model="form.repeatNewPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSavePassword">保存</el-button>
      </el-form-item>
    </el-form>
    <h3 class="font-bold my-4">微信绑定</h3>

    <div v-if="!$store.state.user.bindWeChat" class="text-sm text-gray-700">
      <div v-if="qrcodeUrl == ''">
        <a href="javascript:void(0)" @click="showWxQrCode" class="text-blue-500"
          >现在绑定</a
        >
      </div>
      <div v-else>
        <img :src="qrcodeUrl" alt="" class="w-32" />
        <div>微信扫码二维码进行绑定</div>
      </div>
    </div>
    <div class="text-sm text-gray-700" v-else>已绑定</div>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import UserService from "../service/UserService";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const data = reactive({
      form: {
        nickName: store.state.user.nickName,
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      },
      qrcodeUrl: "", //公众号定制二维码
    });

    //保存昵称
    const onSaveNickName = () => {
      if (!data.form.nickName) {
        ElMessage.error("请输入昵称");
        return;
      }
      UserService.changeNickName(data.form.nickName).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("修改成功");
          store.commit("setNickName", data.form.nickName);
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    //保存密码
    const onSavePassword = () => {
      if (
        !data.form.oldPassword ||
        !data.form.newPassword ||
        !data.form.repeatNewPassword
      ) {
        ElMessage.error("原始密码/新密码/重复新密码必填");
        return;
      }
      if (data.form.newPassword != data.form.repeatNewPassword) {
        ElMessage.error("两次密码不一致");
        return;
      }
      UserService.changePassword(
        data.form.oldPassword,
        data.form.newPassword,
        data.form.repeatNewPassword
      ).then((resp) => {
        if (resp.code == 0) {
          ElMessage.success("密码修改成功,请重新登录");
          localStorage.removeItem("x-token");
          router.push("/login");
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    /**
     * 显示微信公众号二维码
     */
    const showWxQrCode = () => {
      UserService.getWxQrCode().then((resp) => {
        if (resp.code == 0) {
          data.qrcodeUrl = resp.data;
        } else {
          ElMessage.error(resp.message);
        }
      });
    };

    return {
      ...toRefs(data),
      onSaveNickName,
      onSavePassword,
      showWxQrCode,
    };
  },
};
</script>

<style>
</style>