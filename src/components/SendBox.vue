<template>
  <div
    class="
      bg-white
      w-full
      p-2
      h-auto
      border-2
      rounded-xl
      flex flex-col flex-none
    "
  >
    <QuillEditor
      ref="editor"
      theme="bubble"
      :toolbar="['bold', 'italic', 'underline']"
      v-model:content="content"
      contentType="html"
    />
    <div class="flex flex-none flex-row justify-between items-center">
      <div class="flex flex-row items-center text-gray-500">
        <span class="mx-3 cursor-pointer" @click="onInsertHashTag">#</span>
        <span class="mr-3 cursor-pointer">
          <el-upload
            multiple
            :show-file-list="false"
            :before-upload="onBeforeUpload"
            :on-success="onUploadSuccess"
            action
            :data="uploadData"
            :http-request="onupdateFile"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </el-upload>
        </span>
      </div>
      <div
        class="
          bg-green-500
          text-white
          py-1
          px-3
          rounded-xl
          text-sm
          cursor-pointer
        "
        @click="onSendMessage"
      >
        发送
      </div>
    </div>
  </div>
  <div class="flex flex-row flex-wrap items-center">
    <div
      v-for="(item, index) in uploadData.imgs"
      :key="index"
      class="w-32 m-2 relative"
    >
      <img :src="item.url" alt="" class="rounded" />
      <span
        class="
          absolute
          top-0
          right-0
          bg-gray-700
          text-white
          rounded-full
          cursor-pointer
        "
        @click="removeUploadImg(item.imgKey)"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path></svg
      ></span>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import MemoService from "../service/MemoService";
import { ElMessage } from "element-plus";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { useStore } from "vuex";
import * as qiniu from "qiniu-js";
import { v4 as uuidv4 } from "uuid";
//import { watch } from "@vue/runtime-core";

export default {
  components: {
    QuillEditor,
  },
  emits: ["onloadMemo"],
  //props: ["memo_content", "memo_id"],
  setup(props, context) {
    const editor = ref(null);
    const store = useStore();

    const data = reactive({
      content: "",
      uploadData: {
        token: "",
        uid: store.state.userInfo.userId,
        imgs: [],
      },
    });

    /*  watch(
      () => props.memo_content,
      () => {
        editor.value.setHTML(props.memo_content);
      }
    ); */

    const onSendMessage = () => {
      if (!data.content) {
        ElMessage.error("写点东西吧...");
        return;
      }
      MemoService.createNewMemo(data.content, data.uploadData.imgs).then(
        (resp) => {
          if (resp.code == 0) {
            ElMessage.success("保存成功");
            editor.value.setHTML("");

            context.emit("onloadMemo");
            // 加载Tag列表
            store.dispatch("getAllTags");
            // 加载用户信息
            store.dispatch("getUserInfo");
            //清空文件框
            data.uploadData.imgs = [];
          } else {
            ElMessage.error(resp.message);
          }
        }
      );
    };

    const onInsertHashTag = () => {
      let html = editor.value.getHTML();
      html = html.substring(0, html.lastIndexOf("</p>")) + " #</p>";
      editor.value.setHTML(html);
    };

    // -------------文件上传
    //图片上传前判断类型
    const onBeforeUpload = (file) => {
      if (
        !(
          file.name.endsWith(".jpg") ||
          file.name.endsWith(".gif") ||
          file.name.endsWith(".png")
        )
      ) {
        ElMessage.error("只能选择jpg/gif/png格式文件");
        return false;
      }
      if (file.size >= 134217728) {
        ElMessage.error("文件体积过大");
        return false;
      }
    };
    //文件上传成功
    const onUploadSuccess = (resp) => {
      //state.promotionForm.bannerImage = resp.ossPath;
      console.log("upload success ", resp);
    };
    //自定义文件上传
    const onupdateFile = (option) => {
      MemoService.getUploadToken().then((resp) => {
        if (resp.code == 0) {
          data.uploadData.token = resp.data;

          uploadToQiniu(option.file);
        } else {
          ElMessage.error(resp.message);
        }
      });
    };
    //上传到七牛
    const uploadToQiniu = (file) => {
      const observable = qiniu.upload(
        file,
        uuidv4(),
        data.uploadData.token,
        { customVars: { "x:uid": data.uploadData.uid } },
        {}
      );
      observable.subscribe({
        next(res) {
          // ...
          console.log("上传中", res);
        },
        error(err) {
          // ...
          console.log("上传异常", err);
        },
        complete(res) {
          console.log("上传完成la", res);
          data.uploadData.imgs.push({
            imgKey: res.key,
            url: res.url,
            name: res.fname
          });
        },
      }); // 上传开始
    };
    //删除上传成功的文件
    const removeUploadImg = (key) => {
      let removeIndex = -1;
      for (let i = 0; i < data.uploadData.imgs.length; i++) {
        const item = data.uploadData.imgs[i];
        if (item.imgKey == key) {
          removeIndex = i;
          break;
        }
      }
      data.uploadData.imgs.splice(removeIndex, 1);
    };

    return {
      ...toRefs(data),
      onSendMessage,
      onInsertHashTag,
      editor,
      onUploadSuccess,
      onBeforeUpload,
      onupdateFile,
      removeUploadImg,
    };
  },
};
</script>

<style>
</style>