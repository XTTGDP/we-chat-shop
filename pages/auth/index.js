import { request } from "../../request/index.js"
Page({
  data: {
    token: null,
  },
  // 接口要的参数
  loginParams: {
    encryptedData: "",
    rawData: "",
    iv: "",
    signature: "",
    code: ""
  },
  handleGetUserInfo(e) {
    // console.log(e);
    // 1.获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    this.loginParams = { encryptedData, rawData, iv, signature }
    // console.log(this.loginParams);
    // 2.获取小程序登录成功后的code
    wx.login({
      timeout: 10000,
      success: (result) => {
        // console.log(result.code);
        this.loginParams.code = result.code;
        // console.log(this.loginParams.code);
      }
    });
    // console.log(this.loginParams);
    // 3.发送请求，获取用户token
    request({
      url: "/users/wxlogin",
      data: this.loginParams,
      method: "post"
    }).then(result => {
      console.log(result);
    })
    // 4.把token存入缓存中，同时跳转回上一个页面
    wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    wx.navigateBack({
      delta: 1
    });
  }
})