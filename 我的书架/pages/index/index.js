// index.js
Page({
	data:{
		isDownLoading: false,
		// loading时true显示蒙层，false不显示蒙层
		percentNum: 80,
		// 进度条
		bookList: [
			{
				id: "001",
				title: "小王子 The little prince-Antoine de Saint-Exupéry",
				poster: "https://hbimg.b0.upaiyun.com/b2ea273d07d97096750b9961c3c0b24005b0dfaa4aaa2d-vNE9XV_fw658",
				fileUrl: "http://localhost/books/小王子 The little prince-Antoine de Saint-Exupéry.pdf"
			},
			{
				id: "002",
				title: "瓦尔登湖  [美] 亨利·戴维·梭罗",
				poster: "https://img0.baidu.com/it/u=3381009457,354449773&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=693",
				fileUrl: "http://localhost/books/瓦尔登湖  [美] 亨利·戴维·梭罗.pdf"
			},
			{
				id: "003",
				title: "云边有个小卖部",
				poster: "https://img0.baidu.com/it/u=2490482101,4194674720&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499",
				fileUrl: "http://localhost/books/云边有个小卖部.pdf"
			},
		]
	},
	showTips: function(content){
		wx.showModal({
			title: '提醒',
			content: content,
			showCancel: false
		})
	},
	// 打开指定图书
	openBook: function(res){
		wx.openDocument({
			filePath: res,
			success: function(){
				console.log("打开图书成功~");
			},
			fail: function(res_err){
				console.log(res_err.errMsg);
			}
		});
	},
	//保存下载的图书
	savaBook: function(id, path){
		var that = this;
		wx.getFileSystemManager().saveFile({
			tempFilePath: path,
			success: function(res){
				var newPath = res.savedFilePath;
				wx.setStorageSync(id, newPath);
				that.openBook(newPath);
			},
			fail: function(error){
				that.showTips("文件保存失败...");
			}
		});
	},
	readBook: function(e){
		var that = this;
		var id = e.currentTarget.dataset.id;
		var fileUrl = e.currentTarget.dataset.file;
		var path = wx.getStorageSync(id);
		if (path == ""){
			that.setData({
				isDownLoading: true
			});
			const downloadTask = wx.downloadFile({
				url: fileUrl,
				success: function(res){
					that.setData({
						isDownLoading: false
					});
					if(res.statusCode == 200){
						path = res.tempFilePath;
						that.savaBook(id, path);
					}else{
						that.showTips("暂时无法下载！");
					}
				},
				fail: function(e){
					that.setData({
						isDownLoading: false
					});
					console.log(e.errMsg);
					that.showTips("无法连接到服务器！");
				}
			});
			downloadTask.onProgressUpdate(function(res){

				var progress = res.progress;
				that.setData({
					percentNum:progress
				});
			})
		}else{
			that.openBook(path);
		}
	}
})
