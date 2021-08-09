// 1.用户上滑页面 滚动条触底 开始加载下一页数据
//   1.找到滚动条触底事件
//   2.判断还有没有下一页数据
//     1.获取到总页数，只有总条数
//       总页数=Math.ceil(总条数/页容量 pagesize)
//     2.判断当前的页码 pagenum
//     3.判断一下 当前的页面是否大于等于 总页数
//       表示 没有下一页数据
//   3.假如没有下一页数据 弹出一个提示
//   4.假如还有下一页数据 加载下一页数据
//     1.当前的页码++
//     2.重新发送请求
//     3.数据请求回来 要对data中的数组进行拼接，而不是全部替换
// 2.下拉刷新页面
//   1.触发下拉刷新事件
//     找到 触发下拉刷新的事件
//   2.重置 数据 数组
//   3.重置页码 设置为1
//   4.重新发送请求
//   5.数据请求回来 手动关闭等待效果
import { request } from "../../request/index.js"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品数据列表
  getGoodsList() {
    request({
      url: "/goods/search",
      data: this.QueryParams
    }).then(result => {
      // console.log(result);
      // console.log(result.data.message.goods);
      let goodsList = result.data.message.goods;
      // 获取总条数
      let total = result.data.message.total;
      // 计算总页数
      this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
      this.setData({
        goodsList: [...this.data.goodsList, ...goodsList]
      })
      // 关闭下拉刷新窗口
      wx.stopPullDownRefresh();
    })
  },
  // 标题点击事件，子组件传递过来的
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => { i === index ? v.isActive = true : v.isActive = false })
    // 3.赋值
    this.setData({
      tabs
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    // 1.判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有的情况
      wx.showToast({
        title: '没有下一页数据',
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1;
    // 3.发送请求数据
    this.getGoodsList();
  }
})