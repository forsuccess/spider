//引入 `express` 模块
var express = require('express');
//引入 `superagent` 库
var superagent = require('superagent');
//引入 `cheerio` 库
var cheerio = require('cheerio');
//调用 express 实例并将这个变量赋予 app 变量。
var app = express();

// app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
app.get('/', function (req, res, next) {
	// 用 superagent 去抓取 http://dig.chouti.com/ 的内容
	superagent.get('https://m.lianjia.com/bj/chengjiao/')
		.end(function (err, sres) {
			// 常规的错误处理
			if (err) {
				return next(err);
			}

			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
			// 剩下就都是 jquery 的内容了
			var $ = cheerio.load(sres.text);
			var items = [ "<style>div{margin-top: 20px}.price_total{display:inline-block;margin-right: 5px;color: red}h5{margin:25px 0}h4{margin: 2px 0}.first{ float: left;display: inline-block;vertical-align: middle}.second{padding:0;float: left;display: inline-block;vertical-align: middle;margin-left: 20px}.zong{content: '';display: block;clear: both; }</style>"];
			var i=0;
			$('.item_list ').each(function () {
				items.push(
                    "<div class='zong'><div class='first'><img src='"+$(".lazyload").eq(i).attr('origin-src')+"'>"+"</div><div class='second'>"+
					"<h4>"+$(".item_main").eq(i).text()+"</h4>"+
					"<h5>"+$(".item_other").eq(i).text()+"</h5>"+
					"<h5>"+$(".item_date").eq(i).text()+"</h5>"+
					"<span class='price_total'>"+$(".price_total").eq(i).text()+"</span>"+
					"<span class='unit_price'>"+$(".unit_price").eq(i).text()+"</span>"
					+"</div></div>"

				);
				i++;
			});

			res.send("<h3>"+items+"</h3>");
		});
});

// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, function () {
	console.log('app is listening at port 3000');
});