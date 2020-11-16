// 连接 MySQL：先安装 npm i mysql -D
var mysql = require('mysql');
// MySQL 的连接信息
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'node'
});
// 开始连接
connection.connect();

// 引入 http 模块：http 是提供 Web 服务的基础
const http = require("http");

// 引入 url 模块：url 是对用户提交的路径进行解析
const url = require("url");

// 引入 qs 模块：qs 是对路径进行 json 化或者将 json 转换为 string 路径
const qs = require("querystring");

var express = require('express');
var router = express.Router();
var fs = require("fs");
// 引入导入模块
const multiparty = require('multiparty');

// 用 http 模块创建服务
/**
 * req 获取 url 信息 (request)
 * res 浏览器返回响应信息 (response)
 */
http.createServer(function(req, res) {
	// 设置 cors 跨域
	res.setHeader("Access-Control-Allow-Origin", "*");
	// 设置 header 类型
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	// 跨域允许的请求方式
	res.setHeader('Content-Type', 'application/json');

	if (req.method == "POST") { // 接口 POST 形式 
		// 获取前端发来的路由地址
		let pathName = req.url;
		// 接收发送过来的参数
		let tempResult = "";
		// 数据接入中
		req.addListener("data", function(chunk) {
			tempResult += chunk;
		});
		// 数据接收完成
		req.addListener("end", function() {
			var result = JSON.stringify(qs.parse(tempResult));
			if (pathName == "/sendMessage") { // 提交留言信息
			
			} else if (pathName == "/file_upload") {
				
			} else if (pathName == "/adminLogin") { // 提交留言信息 
				result = JSON.parse(result);
				let username = result.username; // 用户名
				let password = result.password; // 密码

				if (!username) { // 用户名为空
					res.end("登录失败，用户名为空！");
					return;
				} else if (!password) { // 密码为空
					res.end("登录失败，密码为空！");
					return;
				} else if (username.length > 10) {
					res.end("登录失败，姓名过长！");
					return;
				} else if (password.length > 20) {
					res.end("登录失败，密码过长！");
					return;
				} else {
					// 新增的 SQL 语句及新增的字段信息
					let readSql = "SELECT * FROM admin_user WHERE admin_user  = '" + username + "'";
					// 连接 SQL 并实施语句
					connection.query(readSql, function(error1, response1) {
						if (error1) {
							throw error1;
						} else {
							if (response1 == undefined || response1.length == 0) { // 不存在用户
								res.end("\n不存在该用户！");
								return;
							} else { // 存在用户
								let newRes = JSON.parse(JSON.stringify(response1));

								if (newRes[0].admin_password == password) { // 密码正确
									// 返回数据
									res.write(JSON.stringify({
										code: "200",
										message: "登录成功！",
										data: {
											id: newRes[0].id,
											userName: newRes[0].admin_user
										}
									}));

									res.end();
								} else { // 密码错误
									// 返回数据
									res.write(JSON.stringify({
										code: "300",
										message: "登录失败，密码错误！"
									}));

									res.end();
								}
								// 判断密码正确与否完毕
							}
							// 存在用户处理结束
						}
					});
				}
				// 登录步骤结束
			} else if (pathName == "/login") { // 登录

				console.log("\n【API - 登录】");

				result = JSON.parse(result);

				console.log(result)

				let username = result.username; // 用户名
				let password = result.password; // 密码

				if (!username) { // 用户名为空
					res.end("登录失败，用户名为空！");
					return;
				} else if (!password) { // 密码为空
					res.end("登录失败，密码为空！");
					return;
				} else if (username.length > 10) {
					res.end("登录失败，姓名过长！");
					return;
				} else if (password.length > 20) {
					res.end("登录失败，密码过长！");
					return;
				} else {
					// 新增的 SQL 语句及新增的字段信息
					let readSql = "SELECT * FROM user WHERE user_name  = '" + username + "'";
					// 连接 SQL 并实施语句
					connection.query(readSql, function(error1, response1) {
						if (error1) {
							throw error1;
						} else {
							if (response1 == undefined || response1.length == 0) { // 不存在用户
								res.end("\n不存在该用户！");
								return;
							} else { // 存在用户
								console.log("\n存在该用户！");

								let newRes = JSON.parse(JSON.stringify(response1));
								console.log(newRes);

								if (newRes[0].user_password == password) { // 密码正确
									// 返回数据
									res.write(JSON.stringify({
										code: "200",
										message: "登录成功！",
										data: {
											id: newRes[0].id,
											userName: newRes[0].user_name
										}
									}));

									res.end();
								} else { // 密码错误
									// 返回数据
									res.write(JSON.stringify({
										code: "300",
										message: "登录失败，密码错误！"
									}));

									res.end();
								}
								// 判断密码正确与否完毕
							}
							// 存在用户处理结束
						}
					});
				}
				// 登录步骤结束
			} else if (pathName == "/register") { // 注册
				result = JSON.parse(result);
				console.log(result)
				let username = result.username; // 用户名
				let password = result.password; // 密码
				let time = getNowFormatDate(); // 时间
				console.log(time)
				if (!username) { // 用户名为空
					res.end("注册失败，用户名为空。");
					return;
				} else if (!password) { // 密码为空
					res.end("注册失败，密码为空！");
					return;
				} else if (username.length > 10) { // 姓名过长
					res.end("注册失败，姓名过长！");
					return;
				} else if (password.length > 20) { // 密码过长
					res.end("注册失败，密码过长！");
					return;
				} else {
					// 查询 user 表
					// 使用 Promise 的原因是因为中间调用了两次数据库，而数据库查询是异步的，所以需要用 Promise。
					new Promise((resolve, reject) => {
						// 新增的 SQL 语句及新增的字段信息
						let readSql = "SELECT * FROM user";
						// 连接 SQL 并实施语句
						connection.query(readSql, function(error1, response1) {

							if (error1) { // 如果 SQL 语句错误
								throw error1;
							} else {
								// 将结果先去掉 RowDataPacket，再转换为 json 对象
								let newRes = JSON.parse(JSON.stringify(response1));
								// 判断姓名重复与否
								let userNameRepeat = false;
								for (let item in newRes) {
									if (newRes[item].user_name == username) {
										userNameRepeat = true;
									}
								}
								// 如果姓名重复
								if (userNameRepeat) {
									res.end("注册失败，姓名重复！");
									return;
								} else if (newRes.length > 300) { // 如果注册名额已满
									res.end("注册失败，名额已满！");
									return;
								} else { // 可以注册
									resolve();
								}

							}
						});

					}).then(() => {
						console.log("\n第二步：");
						// 新增的 SQL 语句及新增的字段信息
						let addSql = "INSERT INTO user(user_name,user_password, time) VALUES(?,?,?)";

						let addSqlParams = [result.username, result.password, time];

						// 连接 SQL 并实施语句
						connection.query(addSql, addSqlParams, function(error2, response2) {
							if (error2) { // 如果 SQL 语句错误
								console.log("新增错误：");
								console.log(error2);
								return;
							} else {
								// 返回数据
								res.write(JSON.stringify({
									code: "200",
									message: "注册成功！"
								}));
								// 结束响应
								res.end();
							}
						});

					})
					// Promise 结束
				}
				// 注册流程结束
			}

			// 接口信息处理完毕
		})
		// 数据接收完毕

	} else if (req.method == "GET") { // 接口 GET 形式

		console.log("\n【GET 形式】");

		// 解析 url 接口
		let pathName = url.parse(req.url).pathname;

		console.log("\n接口为：" + pathName);

		if (pathName == "/getMessage") { // 获取留言信息

			console.log("\n【API - 获取留言信息】");

		} else if (pathName == "/") { // 首页
			res.writeHead(200, {
				"Content-Type": "text/html;charset=UTF-8"
			});

			res.write(
				'<h1 style="text-align:center">liugang前端有限公司服务已开启！</h1><h2 style="text-align:center">详情可见：<a href="https://lg1012.cn" target="_blank">Node 基础</a></h2>'
			);

			res.end();
		}
	}

}).listen(8888); // 监听的端口

// 获取当前时间
function getNowFormatDate() {
	var date = new Date();
	var year = date.getFullYear(); // 年
	var month = date.getMonth() + 1; // 月
	var strDate = date.getDate(); // 日
	var hour = date.getHours(); // 时
	var minute = date.getMinutes(); // 分
	var second = date.getMinutes(); // 秒
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	// 返回 yyyy-mm-dd hh:mm:ss 形式
	var currentdate = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
	return currentdate;
}
