import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    // 1.发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    // });
    request({
      url: "/home/swiperdata"
    }).then(result => {
      this.setData({
        swiperList: result.data.message
      })
    })
  },
  // 获取导航数据
  getCatesList() {
    request({
      url: "/home/catitems"
    }).then(result => {
      this.setData({
        catesList: result.data.message
      })
    })
  },
  getFloorList() {
    request({
      url: "/home/floordata"
    }).then(result => {
      this.setData({
        floorList: result.data.message
      })
    })
  }
});