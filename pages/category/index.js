import { request } from "../../request/index.js"
Page({
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 被点击的左侧的菜单
        currentIndex: 0,
        // 右侧内容的滚动条距离顶部的距离
        scrollTop: 0
    },
    // 接口的返回数据
    Cates: [],

    onLoad: function (options) {
        // 先判断一下本地有没有旧数据{time:Date.now(),data:[...]}
        // 没有旧数据直接发送请求
        // 有旧数据，同时判断旧数据有没有过期，没过期使用本地旧数据

        // 1.获取本地存储的数据
        const Cates = wx.getStorageSync("cates");
        // 2.判断
        if (!Cates) {
            // 不存在，发送请求获取数据
            this.getCates();
        } else {
            // 有旧数据 定义过期时间
            if (Date.now() - Cates.time > 100000) {
                // 重新发送请求
                this.getCates();
            } else {
                // 可以使用旧数据
                this.Cates = Cates.data;

                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }

    },
    // 获取分类数据
    getCates() {
        request({
            url: '/categories'
        }).then(res => {
            this.Cates = res.data.message;
            // 把接口的数据存入本地存储中
            wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
            // 构造左侧的大菜单数据
            let leftMenuList = this.Cates.map(v => v.cat_name);
            // 构造右侧的商品数据
            let rightContent = this.Cates[0].children;
            this.setData({
                leftMenuList,
                rightContent
            })
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        // 1.获取被点击的标题上的索引
        const { index } = e.currentTarget.dataset;
        // 2.给data中的currentIndex赋值就可以了
        // 3.根据不同索引来渲染右侧的商品内容
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
            scrollTop: 0
        })
    }

})