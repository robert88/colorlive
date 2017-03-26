/*自适应处理*/
;
(function () {


	var maxHeight = 889;
	var minHeight = 400;

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
		var remroot = getResize(maxHeight, minHeight, h, 100, 75)
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
			new Vue({
				el: "#colorlivePage",
				data: data,
				methods: {
					getClass: function (idx) {
						console.log(idx);
						var map = [{angle: 170, size: "size4"},
							{angle: 190, size: "size1"},
							{angle: 167, size: "size3"},
							{angle: 310, size: "size2"},
							{angle: 20, size: "size5"},
							{angle: 90, size: "size6"},]
						return map[idx].size;
					},
					getAngle: function (idx) {
						var map = [{angle: 170, size: "size4"},
							{angle: 190, size: "size1"},
							{angle: 167, size: "size3"},
							{angle: 310, size: "size2"},
							{angle: 20, size: "size5"},
							{angle: 90, size: "size6"},]
						return map[idx].angle;
					}
				},
				filters: {
					"toBgUrl": function (val) {
						return val ? ('background:url(' + val + ') no-repeat;background-size:100% 100%;') : "";
					},
					getLabel: function (val) {
						return "images/icon/" + (val | 0) + "@2x.png";
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
			var fontSizeArr = [16, 18, 30, 24, 20, 26];
			var fontSize = fontSizeArr[Math.floor(Math.random() * fontSizeArr.length)];
			var opacity = fontSize / 30;
			$this.css({
				opacity: opacity,
				fontSize: fontSize + "px"
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
			var x = center.x + Math.cos(2 * Math.PI * turnAngle / 360) * (r + 10);
			var y = center.y - Math.sin(2 * Math.PI * turnAngle / 360) * (r + 10);
			console.log("turnAngle" + turnAngle, x, y);
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
			$(".arrow-top").click(function () {
				if(vSwiper.activeIndex>=6){
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

		$.ajax({
			url: "../data.json",
			dataType: "json",
			success: function (data) {
				renderData(data)
			}
		});

		resizeLayout();
		changeRootrem();


	})
})();

// function arc(c,x,y) {
// 	var ctx = c.getContext("2d");
// 	ctx.beginPath();
// 	ctx.arc(x, y, 10, 0, Math.PI * 2);
// 	ctx.strokeStyle="red";
// 	ctx.stroke();
// }