// 1.获取用户的收获地址
//   1.绑定点击事件
//   2.调用小程序内部 Api 获取用户的收获地址 wx.chooseAddres

//   2.获取用户对小程序 所授予 获取地址的 权限状态 scope
//     1.假设 用户 点击 获取收获地址的提示框 确定 authSetting scope.address
//       scope 值 为 true  直接调用收获地址
//     2.假设 用户 从来没有调用过 收获地址
//       scope 值 为 undefined 直接调用收获地址
//     3.假设 用户 点击 获取收获地址的提示框 取消
//       scope 值 为 false 
//       1.诱导用户 自己打开授权页面 当用户重新给与 权限时
//       2.获取收获地址
//     4.把地址存入缓存中
// 2.页面加载完毕
//   1.获取本地存储中的地址数据
//   2.把数据 设置给data中的一个变量
// 3.onShow
//   0.回到商品详情页面 第一次添加商品的时候，手动添加了属性
//     1.num=1
//     2.checked=true;
//   1.获取缓存中的购物车数组
//   2.把购物车数据 填充到data中
// 4.全选的实现 数据的展示
//   1.onShow 获取缓存中的购物车数组
//   2.根据购物车的商品数据，所有的商品都被选中 checked=true 全选就被选中
// 5.总价格和总数量
//   1.都需要商品被选中，我们才拿它来计算
//   2.获取购物车数组
//   3.遍历
//   4.判断商品是否被选中
//   5.总价格 += 商品的单价*商品的数量
//   6.总数量 += 商品的数量
//   7.把计算后的总价格，总数量，返回data中
// 6.商品选中
//   1.绑定change事件
//   2.获取到被修改的商品对象
//   3.商品对象的选中状态取反
//   4.重新填充回data中和缓存中
//   5.重新计算全选，总价格，总数量
// 7.全选和反选
//   1.全选复选框绑定事件 change 
//   2.获取data中的全选变量 allChecked
//   3.直接取反 allChecked=!allChecked
//   4.遍历购物车数组，让里面 商品状态跟谁 allChecked 改变而改变
//   5.把购物车数组和 allChecked 重新设置回data和缓存中
// 8.商品数量编辑
//   1.+ - 按钮 绑定同一个点击事件 区分的关键 自定义属性
//   2.传递被点击的商品 id goods_id
//   3.获取data中的购物车数组 来获取需要被修改的商品对象
//   4.直接修改商品对象的数量 num 
//   5.把cart数组 重新设置回 data 和缓存中 this.setCart 
//   6.当购物车的数量=1，用户点击-
//     弹窗提示，询问用户是否删除
//     1.确定 直接删除
//     2.取消 什么都不做
// 9.点击结算
//   1.判断有没有收获地址信息
//   2.判断用户有没有选购商品
//   3.经过以上的验证，跳转到 支付页面
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么，每一个回调函数都返回true，那么every方法的返回值为true
    // 只要 有一个回调函数返回了false 那么不再循环执行，直接返回false
    // 空数组 调用every,返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    this.setCart(cart);
    // 2.给data赋值
    this.setData({
      address
    })
  },
  // 点击获取收获地址
  handleChooseAddress() {
    // 1.获取权限
    wx.getSetting({
      success: (result) => {
        // 2.获取权限状态 ，只要发现一些属性名很怪异的时候，都要使用[]形式来获取属性值
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === false) {
          // 3.用户 拒绝授予权限 诱导用户打开授权页面
          wx.openSetting({
            success: (result2) => {
              console.log(result2);
              // 4.可以调用 收获地址代码
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3);
                  // 5.存入到缓存中
                  wx.setStorageSync("address", result3);
                }
              });
            }
          });
        } else {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1);
              // 5.存入到缓存中
              wx.setStorageSync("address", result1);
            }
          });
        }
      }
    });

  },
  // 商品的选中
  handeItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2.获取购物车数组 
    let { cart } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5,6 把购物车数据重新设置回 data 和缓存中
    this.setCart(cart);

  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是不是为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  // 全选和反选
  handleItemAllCheck() {
    // 1.获取data中的数据
    let { allChecked, cart } = this.data;
    // 2.修改值
    allChecked = !allChecked;
    // 循环修改cart数组，商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 把修改后的值，填充回data和缓存
    this.setCart(cart);
  },
  // 商品数量编辑
  handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2.获取data中购物车数组
    let { cart } = this.data;
    // 3.找到需要更改商品的索引
    let index = cart.findIndex(v => v.goods_id === id);
    // 6.判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: '是否要删除？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1);
            this.setCart(cart)
          } else if (result.cancel) {
            console.log('用户点击取消');
          }
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      // 4.修改商品数量
      cart[index].num += operation;
      // 5.把购物车设置回去
      this.setCart(cart);
    }
  },
  // 结算功能
  handlePay() {
    // 1.判断收获地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      wx.showToast({
        title: '您还没有选择收获地址',
        icon: 'none',
        duration: 1500,
        mask: true
      });
      return;
    }
    // 2.判断用户有没有选购商品 
    if (totalNum === 0) {
      wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
        duration: 1500,
        mask: true
      });
      return;
    }
    // 3.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})