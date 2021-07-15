<template>
  <div class="flex h-screen flex-col">
    <div class="flex felx-row justify-between items-center">
      <span class="font-bold text-gray-500 px-1 my-4 flex-none">MEMO</span>
      <div class="flex flex-row">
        <router-link
          to="/setting"
          class="text-gray-500 text-sm outline-none cursor-pointer mr-4"
          title="用户设置"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </router-link>
        <a
          @click="signOut"
          class="text-gray-500 text-sm outline-none cursor-pointer"
          title="安全退出"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
        </a>
      </div>
    </div>
    <!-- sendbox -->
    <send-box @onloadMemo="onLoadMemoList" />
    <div class="mt-2 flex flex-col space-y-3 overflow-y-auto flex-auto">
      <div
        v-for="(item, index) in memoList"
        :key="index"
        class="bg-white px-3 py-4 text-sm text-gray-400 rounded-xl mt-2"
      >
        <div class="flex justify-between items-center">
          <span>{{ item.createTime }}</span>
          <el-dropdown>
            <span class="el-dropdown-link">
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
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onDelMemo(item.id)"
                  >删除</el-dropdown-item
                >
                <el-dropdown-item @click="onPreEditMemo(item)"
                  >编辑</el-dropdown-item
                >
                <!-- <el-dropdown-item>分享</el-dropdown-item> -->
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="text-gray-700 mt-2" v-html="item.htmlContent"></div>
        <div class="flex flex-wrap flex-row space-x-1 mt-3">
          <div
            class="cursor-pointer"
            v-for="pic in item.imgs"
            :key="pic.key"
            @click="onViewImg(pic)"
          >
            <img :src="pic.url" alt="" class="w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
    <!-- 显示图片的dialog -->
    <el-dialog v-model="showImgDialog">
      <img :src="view_img_path" alt="" class="mx-auto" />
    </el-dialog>

    <!-- 编辑抽屉 -->
    <el-drawer
      title="编辑Memo"
      v-model="editDrawer"
      destroy-on-close
      :append-to-body="true"
      @opened="onDrawerOpend"
    >
      <div class="px-6">
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
            ref="editorBox"
            theme="bubble"
            :toolbar="['bold', 'italic', 'underline']"
            v-model:content="editContent"
            contentType="html"
          />
          <div class="flex flex-none flex-row justify-between items-center">
            <div class="flex flex-row items-center text-gray-500">
              <span class="mx-3 cursor-pointer" @click="onInsertHashTag"
                >#</span
              >
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
              @click="onEditMessage"
            >
              编辑
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
      </div>
    </el-drawer>
  </div>
</template>


<script>
import SendBox from "../components/SendBox.vue";
import { reactive, ref, toRefs, watch } from "vue";
import UserService from "../service/UserService";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import MemoService from "../service/MemoService";
import { useStore } from "vuex";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import * as qiniu from "qiniu-js";
import { v4 as uuidv4 } from "uuid";

export default {
  components: { SendBox, QuillEditor },
  name: "Home",
  setup() {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();

    const editorBox = ref(null);

    //查询tagName字符串
    const queryTag = route.query.tagName;

    const data = reactive({
      memoList: [],
      memo: {},
      editDrawer: false,
      editContent: "", //编辑框
      showImgDialog: false,
      view_img_path: "",

      uploadData: {
        token: "",
        uid: store.state.userInfo.userId,
        imgs: [],
      },
    });
    //安全退出
    const signOut = () => {
      ElMessageBox.confirm("确定要退出?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        UserService.logout().then((resp) => {
          if (resp.code == 0) {
            localStorage.removeItem("xf-note");
            ElMessage.success("安全退出");
            router.push("/login");
          } else {
            ElMessage.error(resp.message);
          }
        });
      });
    };

    //加载用户所有的MemoList
    const onLoadMemoList = (tagName) => {
      data.memoList = [];
      MemoService.getMemoList(tagName).then((resp) => {
        if (resp.code == 0) {
          resp.data.forEach((item) => {
            item.htmlContent = hashAddLink(item.content);
            data.memoList.push(item);
          });
        } else {
          ElMessage.error(resp.message);
        }
      });
    };
    //初始化加载
    onLoadMemoList(queryTag);

    //为memo中的#xxx添加链接
    const hashAddLink = (memo) => {
      const regex = /#(\w|[\u4e00-\u9fa5]|\/*)+\s?/g;
      const newMemo = memo.replace(regex, (match) => {
        const tagNameName = match.substring(1);
        return `<a class="hashTag" rel="${tagNameName}" href="javascript:void(0)">${match}</a>`;
      });
      return newMemo;
    };

    //删除Memo
    const onDelMemo = (id) => {
      ElMessageBox.confirm("确定要删除?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        MemoService.delMemo(id).then((resp) => {
          if (resp.code == 0) {
            ElMessage.success("已删除");
            onLoadMemoList();
            // 加载Tag列表
            store.dispatch("getAllTags");
            // 加载用户信息
            store.dispatch("getUserInfo");
          } else {
            ElMessage.error(resp.message);
          }
        });
      });
    };

    //编辑Memo（放入文本框）
    const onPreEditMemo = (item) => {
      data.memo = item;
      let imgs = JSON.parse(JSON.stringify(item.imgs));
      for (let img of imgs.values()){
        img.id = null;
        img.memoId = null;
      }
      data.uploadData.imgs = imgs;
      data.editDrawer = true;
    };
    //编辑Memo
    const onEditMessage = () => {
      MemoService.editMemo(
        data.memo.id,
        editorBox.value.getHTML(),
        data.uploadData.imgs
      ).then((resp) => {
        if (resp.code == 0) {
          data.editDrawer = false;
          ElMessage.success("编辑成功");

          onLoadMemoList();
          // 加载Tag列表
          store.dispatch("getAllTags");
          // 加载用户信息
          store.dispatch("getUserInfo");
        } else {
          ElMessage.error(resp.message);
        }
      });
    };
    //编辑框内插入#
    const onInsertHashTag = () => {
      let html = editorBox.value.getHTML();
      html = html.substring(0, html.lastIndexOf("</p>")) + " #</p>";
      editorBox.value.setHTML(html);
    };

    //抽屉打开的回调事件
    const onDrawerOpend = () => {
      editorBox.value.setHTML(data.memo.content);
    };

    //监听url中params的变化
    watch(
      () => route.query,
      () => {
        onLoadMemoList(route.query.tagName);
      }
    );

    //v-html中 #xxx的点击事件
    document.addEventListener("click", (event) => {
      if (event.target.className == "hashTag") {
        router.push("/home?tagName=" + event.target.rel);
      }
    });

    //点击图片查看大图
    const onViewImg = (pic) => {
      data.showImgDialog = true;
      data.view_img_path = pic.url;
    }; // -------------文件上传
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
          console.log("上传完成", res);
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
      signOut,
      onLoadMemoList,
      onDelMemo,
      onPreEditMemo,
      onEditMessage,
      onInsertHashTag,
      onDrawerOpend,
      editorBox,
      onViewImg,
      onUploadSuccess,
      onBeforeUpload,
      onupdateFile,
      removeUploadImg,
    };
  },
};
</script>
<style>
.hashTag {
  background-color: #eef3fe;
  color: #5783f7;
  padding: 2px 4px;
  border-radius: 3px;
  margin: 0px 3px;
}
</style>