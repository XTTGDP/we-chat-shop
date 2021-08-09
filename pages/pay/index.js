// 1.页面加载的时候
//   1.从缓存中获取购物车数据 渲染到页面
//     这些数据 checked=true
import { request } from "../../request/index.js"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  order_number: null,
  // 点击支付
  handleOrderPay() {
    // 1.判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 2.判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    // 3.创建订单
    // 3.1准备请求头参数
    const header = { Authorization: token };
    // 3.2准备请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = { order_price, consignee_addr, goods };
    // 4.发送请求，创建订单，获取订单编号
    request({
      url: "/my/orders/create",
      method: "POST",
      data: orderParams,
      header
    }).then(result => {
      console.log(result);
      this.order_number = result;
    })
  }
})