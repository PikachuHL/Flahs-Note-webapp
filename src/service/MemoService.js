import Http from "../util/http";

const MemoService = {
  createNewMemo: (content, imgs) => {
    const url = "/memo/create";
    return Http.postData(url, {
      content,
      imgs,
      device: "web"
    });
  },
  getTagsList: () => {
    const url = "/memo/getTags";
    return Http.get(url);
  },
  getMemoList: queryTag => {
    const url = "/memo/list";
    return Http.get(url, {tagName: queryTag});
  },
  delMemo: memoId => {
    const url = "/memo/del";
    return Http.postParams(url, { memoId });
  },
  editMemo: (memoId, content, imgs) => {
    const url = "/memo/edit";
    return Http.postData(url, {
      memoId,
      content,
      imgs,
      device: "web"
    });
  },
  getUploadToken: () => {
    const url = "/memo/img/getToken";
    return Http.postData(url, {});
  }
};

export default MemoService;
