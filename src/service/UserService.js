import Http from "../util/http";

const UserService = {
  userRegister: (phone, password, verifyCode) => {
    const url = "/userRegister";
    return Http.postData(url, {
      phone,
      password,
      verifyCode
    });
  },
  login: (phone, password) => {
    const url = "/login";
    return Http.postData(url, {
      phone,
      password,
      device: "PC"
    });
  },
  logout: () => {
    const url = "/logout";
    return Http.postData(url, {});
  },
  changeNickName: nickName => {
    const url = "/user/setting";
    return Http.postData(url, {
      nickName
    });
  },
  changePassword: (oldPassword, newPassword, repeatNewPassword) => {
    const url = "/user/setting";
    return Http.postData(url, {
      oldPassword,
      newPassword,
      repeatNewPassword
    });
  },
  forgetPasswordValidateUser: (phone, tokenId, verifyCode) => {
    const url = "/forget/checkUser";
    return Http.postData(url, {
      phone,
      tokenId,
      verifyCode
    });
  },
  forgetPasswordValidateVerifyCode: (token, verifyCode) => {
    const url = "/forget/checkVerifyCode";
    return Http.postData(url, {
      token,
      verifyCode
    });
  },
  forgetPasswordSetNewPassword: (token, newPwd, repeatPwd) => {
    const url = "/forget/resetPwd";
    return Http.postData(url, {
      token,
      newPwd,
      repeatPwd
    });
  },
  getUserInfo: () => {
    const url = "/user/info";
    return Http.postData(url, {});
  },
  getWxQrCode: () => {
    const url = "/user/sceneQrCode";
    return Http.postData(url, {});
  }
};

export default UserService;
