import axios from "axios";
import { Promise } from "core-js";
import router from "../router/index";
import store from "../store/index";

export const request = axios.create({
  baseURL: process.env.VUE_APP_API_SERVER,
  timeout: 10000
});

//请求拦截器
request.interceptors.request.use(
  config => {
    const token = store.state.user.tokenValue; //localStorage.getItem("x-token");
    if (token) {
      config.headers["x-key"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//响应拦截器
request.interceptors.response.use(
  response => {
    // TODO 错误码 2000 为 token 问题，后端还没有判定相应的异常
    if (response.data.code == -2000) {
      localStorage.removeItem("flash-note");
      router.replace({
        path: "/login",
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    } else {
      return response.data;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("flash-note");
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);
