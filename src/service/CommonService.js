import Http from "../util/http";

const CommonService = {
  sendVerifyCode: (phone, sceneCode) => {
    const url = "/common/sendVerifyCode";
    return Http.postData(url, {
      phone,
      sceneCode,
      device: "PC"
    });
  },
  getVerifyCodeImage: () => {
    const url = "/common/getImageCaptcha";
    return Http.get(url);
  }
};

export default CommonService;
