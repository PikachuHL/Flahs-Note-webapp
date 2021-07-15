import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import MemoService from "../service/MemoService";
import UserService from "../service/UserService";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "flash-note"
  //reducer: state => ({ user: state.user })
});

export default createStore({
  state: {
    user: {},
    tagList: [],
    userInfo: {}
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setNickName(state, payload) {
      state.user.nickName = payload;
    },
    setTagList(state, payload) {
      state.tagList = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    }
  },
  actions: {
    getAllTags(context) {
      MemoService.getTagsList().then(resp => {
        if (resp.code == 0) {
          context.commit("setTagList", resp.data);
        }
      });
    },
    getUserInfo(context) {
      UserService.getUserInfo().then(resp => {
        if (resp.code == 0) {
          context.commit("setUserInfo", resp.data);
        }
      });
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin]
});
