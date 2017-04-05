var app = getApp()
Page({
    data: {
        userId: '',
        userInfo: '',
        password: '',
        disabled: false,
        loading: false,
    },
    onLoad: function(options) {
        var that = this
        wx.setNavigationBarTitle({
            title: '登录'
        })

        app.getUserInfo(function(userInfo) {
            that.setData({
                userInfo: userInfo
            })
        })
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },

    logging: function(e) {
        this.setData({
            disabled: !this.data.disabled,
            loading: !this.data.loading
        })
    },

    inputUserId: function(e) {
        this.setData({
            userId: e.detail.value
        })
    },
    inputPassword: function(e) {
        this.setData({
            password: e.detail.value
        })
    },

    login: function() {
        var that = this;
        var isValid = that.validateInput();
        if (isValid) {
            that.logging();
            wx.request({
                url: app.globalData.loginUrl,
                data: {
                    userId: that.data.userId,
                    password: that.data.password
                },
                method: 'GET',
                header: {
                    Authorization: app.globalData.authorization
                },
                success: function(res) {
                    if (res.data.message == "请求成功") {
                        //将userId设置为全局属性
                        app.globalData.userId = that.data.userId
                        that.bindUserIdWithWeChatId();
                        //将数据保存到本地，方便下次使用读取
                        wx.setStorage({
                            key: "userId",
                            data: that.data.userId
                        })
                    } else {
                        app.showToast("登录失败，学号或密码错误", false);
                    }
                },
                fail: function() {
                    app.showToast("请求失败，请稍后重试", false);
                },
                complete: function() {
                    that.logging();
                }
            })
        }
    },

    //绑定微信账号
    bindUserIdWithWeChatId: function() {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '绑定微信账号',
            content: '是否将学号和微信账号绑定，绑定后可以直接通过微信账号登录',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.bindUserIdWithWeChatIdUrl,
                        data: {
                            userId: app.globalData.userId,
                            weChatId: app.globalData.weChatId
                        },
                        method: 'POST',
                        header: {
                            Authorization: app.globalData.authorization,
                        },
                        success: function(response) {
                            if (response.data == "success") {
                                msg = "绑定成功";
                                isSuccessed = true;
                            } else {
                                msg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function() {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function() {
                            that.navigateToIndexPage(msg, isSuccessed);
                        }
                    })
                } else {
                    that.navigateToIndexPage();
                }
            }
        })
    },

    //跳转到首页
    navigateToIndexPage: function(msg, isSuccessed) {
        wx.redirectTo({
          url: '../index/index',
          complete: function() {
            app.showToast(msg, isSuccessed);//跳转成功之后显示提示
          }
        })
    },

    //校验输入信息
    validateInput: function() {
        var that = this;
        if (that.data.userId != "" && that.data.password != "") {
            if (that.data.userId.length == 10) {
                if (that.data.password.length == 6) {
                    return true;
                } else {
                    app.showToast("密码格式错误", false);
                    return false;
                }
            } else {
                app.showToast("学号格式错误", false);
                return false;
            }
        } else {
            app.showToast("请输入学号和密码", false);
            return false;
        }
    }
})