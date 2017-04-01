/*自适应处理*/
;
(function () {


	var maxHeight = 889;
	var minHeight = 400;

	var maxWidth = 900;
	var minWidth = 300;
	//等比
	function getResize(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	function getRagen(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}

	/*
	 * 填充形参
	 *
	 * */
	String.prototype.tpl = function () {
		var arg = arguments;
		var that = this;
		for (var i = 0; i < arg.length; i++) {
			that = that.replace(new RegExp('\\{' + i + '\\}', "g"), arg[i]);
		}
		return that;
	};

	/*
	 * 设置根字体
	 *
	 * */
	var preh;

	function changeRootrem() {
		var h = getRagen($(window).height(), maxHeight, minHeight);
		var remHroot = getResize(maxHeight, minHeight, h, 100, 75);
		var w = getRagen($(window).width(), maxWidth, minWidth);
		var remWroot = getResize(maxWidth, minWidth, w, 100, 75);
		var remroot = Math.min(remHroot,remWroot);
		console.log(remroot)
		if (preh == h) {
			return remroot;
		}
		preh = h;
		/*12/16=0.75,20/16=1.25*/
		$("html").css("font-size", remroot + "%");
		return remroot;
	}

	function resizeLayout() {
		$(".user-page .userwrap").css("border-left", $(".wrap").width() + "px solid transparent")
	}

	$(window).resize(function () {
		changeRootrem();
		resizeLayout();
	})

	/*page动画处理*/

	$(function () {
		function renderData(data) {
			if(data.eventArray){
				data.eventArray.sort(function (a,b) {
					return a.event_time-b.event_time>0?-1:1;
				});
			}
			
			new Vue({
				el: "#colorlivePage",
				data: data,
				methods: {
					getClass: function (idx) {
						// console.log(idx);
						var map = [
							{angle: 180, size: "size1"},
							{angle: 310, size: "size2"},
							{angle: 267, size: "size3"},
							{angle: 90, size: "size4"},
							{angle: 20, size: "size5"},
							{angle: 170, size: "size6"}]
						return map[idx].size;
					},
					getAngle: function (idx) {
						var map = [
							{angle: 180, size: "size1"},
							{angle: 310, size: "size2"},
							{angle: 267, size: "size3"},
							{angle: 90, size: "size4"},
							{angle: 20, size: "size5"},
							{angle: 170, size: "size6"}]
						return map[idx].angle;
					}
				},

				filters: {
					"toBgUrl": function (val) {
						return val ? ('background:url(' + val + ') no-repeat;background-size:100% 100%;') : "";
					},
					getColor:function (val){
					var map = {"0":"rgb(56,101,138)",
						"1":"rgb(239,169,53)",
						"2":"rgb(28,186,121)",
						"3":"rgb(49,171,244)",
						"4":"rgb(35,114,204)",
						"5":"rgb(31,193,194)",
						"6":"rgb(183,222,238)",
						"7":"rgb(210,93,178,)",
						"8":"rgb(229,190,128)",
						"9":"rgb(237,84,87)",
						"10":"rgb(194,226,60)",
						"11":"rgb(151,76,160)",
						"12":"rgb(84,135,251)",
						"13":"rgb(249,120,73)",
						"14":"rgb(133,214,40)",
						"15":"rgb(253,245,151)",
						"16":"rgb(252,202,176)",
						"17":"rgb(84,198,252)",
						"18":"rgb(226,134,93)",
						"19":"rgb(244,120,170)"
					}
						return "background:"+map[val]+";"
					},
					getLabel: function (val) {
						return "static/images/icon/" + (val | 0) + "@2x.png";
					},
					"moonToStr": function (val) {
						var time_moon_map = {
							"1": "JAN",
							"2": "FEB",
							"3": "MAR",
							"4": "APR",
							"5": "MAY",
							"6": "JUN",
							"7": "JUL",
							"8": "AUG",
							"9": "SEP",
							"10": "OCT",
							"11": "NOV",
							"12": "DEC"
						}
						return time_moon_map[val] || ""
					}
				},
				ready: function () {
					afterRender()
				},
			});
		}


		/*随机改变字体大小和颜色*/
		function roundTextFont($this) {
			var fontSizeArr = [1, 1.125, 1.875, 1.5, 1.25, 1.625];
			var fontSize = fontSizeArr[Math.floor(Math.random() * fontSizeArr.length)];
			var opacity = fontSize / 30;
			$this.css({
				opacity: opacity,
				fontSize: fontSize + "rem"
			});
		}

		/*处理一个位置*/
		function handleOneTextRound($this, center, len, istext, idx) {
			if (istext) {
				roundTextFont($this);
			}

			$this.css({position: "absolute"});

			var startAngle = 180;
			var spaceAngle = 360 / len;

			if ($this.data("angle")) {
				startAngle = $this.data("angle");
				spaceAngle = 0;
			}

			var turnAngle = startAngle + idx * spaceAngle;

			var r = center.r;
			var x = center.x + Math.cos(2 * Math.PI * turnAngle / 360) * (r );
			var y = center.y - Math.sin(2 * Math.PI * turnAngle / 360) * (r );
			// console.log("turnAngle" + turnAngle, x, y);
			// arc($this.parent().parent().find(".canvas")[0],x,y);
			//确认方向
			var dy = 0;
			var dx = 0;
			if (y < center.y) {
				dy = (y - center.y) / Math.abs(y - center.y)
			}
			if (x < center.x) {
				dx = (x - center.x) / Math.abs(x - center.x)
			}
			if(turnAngle%360==90 || turnAngle%360==270){
				dx=-0.5;
			}
			if(turnAngle%360==180 || turnAngle%360==0){
				dy=-0.5
			}

			$this.css({
				left: x + dx * $this.width(),
				top: y + dy * $this.height()
			});
		}

		//文字环绕效果
		function textRound($target, istext) {

			var $li = $target.find(".labelGroup li").not(".labelCenter");
			var $center = $target.find(".labelCenter");
			var len = $li.length;

			var center = {
				x: $center.width() / 2 + $center.offset().left - $target.offset().left,
				y: $center.height() / 2 + $center.offset().top - $target.offset().top,
				r: ($center.height() + 10) / 2
			};

			// console.log(center.r)
			// drawArc($target,center.x, center.y, center.r);

			$li.each(function (idx) {
				handleOneTextRound($(this), center, len, istext, idx)
			})
		}

		//辅助性画圈
		// var drawCount=0;
		// function drawArc($target,x, y, r) {
		// 	var c = $target.find(".canvas")[0];
		// 	c.width = $target.width();
		// 	c.height = $target.height();
		// 	var ctx = c.getContext("2d");
		// 	ctx.beginPath();
		// 	ctx.arc(x, y, r, 0, Math.PI * 2);
		// 	ctx.fillText(drawCount,x,y,"18px Arial")
		// 	ctx.stroke();
		// 	drawCount++;
		// }

		function afterRender(){
			$(".my-wrap .labelGroup-wrap").each(function () {
				textRound($(this), $(this).data("istext"));
			})
			//轮播slide
			var vSwiper =new Swiper('.swiper-container', {
				speed: 1000,
				parallax: true,
				direction: 'vertical'
				// initialSlide: ,
			});
			var maxLen = $(".swiper-slide").length;
			$(".arrow-top").click(function () {

				if(vSwiper.activeIndex>=maxLen-1){
					vSwiper.slideTo(0);
				}else{
					vSwiper.slideTo(vSwiper.activeIndex+1);
				}
			})
		}
		var windowResize;
		$(window).resize(function () {
			clearTimeout(windowResize)
			windowResize = setTimeout(function () {
				$(".my-wrap .labelGroup-wrap").each(function () {
					textRound($(this), $(this).data("istext"));
				})
			},100)
		});

		var id = 0 ;
		window.location.search.replace(/id=(\d+)/,function (m,m1) {
			id=m1;
		});

		$.ajax({
			// url: "../../data.json",
			url: "http://lifeapp.flyes.net/stripe.php?id="+id,
			dataType: "json",
			success: function (data) {
				renderData(data)
			}
		});

		resizeLayout();
		changeRootrem();

		// $(".likeBtn").click(function () {
		// 	$.ajax({
		// 		url:"http://lifeapp.flyes.net/index.php?id=35@&more=click&mobile=33333333330",
		//
		// 	})
		// })


	})
})();

// function arc(c,x,y) {
// 	var ctx = c.getContext("2d");
// 	ctx.beginPath();
// 	ctx.arc(x, y, 10, 0, Math.PI * 2);
// 	ctx.strokeStyle="red";
// 	ctx.stroke();
// }