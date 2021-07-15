import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import BaseLayout from "../layout/BaseLayout.vue";
import Register from "../views/Register.vue";
import Setting from "../views/Setting.vue";
import ForegetPassword from "../views/ForegetPassword.vue";
import ForegetPasswordSendCode from "../views/ForegetPasswordSendCode.vue";
import ForegetPasswordSetPassword from "../views/ForegetPasswordSetPassword.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: {
      auth: "false" //不需要认证检测
    },
    component: Login
  },
  {
    path: "/userRegister",
    name: "Register",
    meta: {
      auth: "false" //不需要认证检测
    },
    component: Register
  },
  {
    path: "/forget/checkUser",
    component: ForegetPassword,
    meta: {
      auth: "false"
    }
  },
  {
    path: "/forget/sendVerifyCode/:token",
    component: ForegetPasswordSendCode,
    meta: {
      auth: "false"
    }
  },
  {
    path: "/forget/resetPwd/:token",
    component: ForegetPasswordSetPassword,
    meta: {
      auth: "false"
    }
  },
  {
    path: "/",
    name: "BaseLayout",
    component: BaseLayout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home
      },
      {
        path: "/setting",
        component: Setting
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  base: '/flash-note/'
});

router.beforeEach((to, _, next) => {
  if (to.meta.auth && to.meta.auth == "false") {
    next();
  } else {
    const token = store.state.user.tokenValue; //localStorage.getItem("x-token");
    console.log(token);
    if (token) {
      next();
    } else {
      next({ name: "Login" });
    }
  }
});

export default router;
