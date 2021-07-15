import { request } from "./request";

const Http = {
  get: (url, params) => {
    return request({
      method: "get",
      url,
      params
    });
  },
  postParams: (url, params) => {
    return request({
      method: "post",
      url,
      params
    });
  },
  postData: (url, data) => {
    return request({
      method: "post",
      url,
      data
    });
  }
};

export default Http;
