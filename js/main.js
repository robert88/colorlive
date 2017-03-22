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
function resizeLayout(){
      $(".user-page .userwrap").css("border-left",$(".wrap").width()+"px solid transparent")
}
    $(window).resize(function () {
        changeRootrem();
        resizeLayout();
    })

    /*page动画处理*/

    $(function () {
        resizeLayout();
        changeRootrem();
        
        var perSildeIndex;
        var slideFlag;

        var vSwiper = new Swiper('.swiper-container', {
            speed: 1000,
            parallax: true, 
            direction: 'vertical',
            initialSlide: 1,
            // loop:true,
            // simulateTouch:false,
            // nextButton: '.arrow-right',
            // prevButton: '.arrow-left',
            // paginationClickable: true,
            // pagination: ".swiper-pagination",
            // onTransitionEnd: function () {
            //     if (vSwiper) {
            //         if(vSwiper.activeIndex!=perSildeIndex){
            //             slideFlag=false;
            //             perSildeIndex = perSildeIndex||$(".page.current").index()||0;
            //             $(".page").data("lockAutoNext",true)
            //             goNextPage($(".page").eq(perSildeIndex), $(".page").eq(vSwiper.activeIndex));
            //             perSildeIndex = vSwiper.activeIndex;
            //         }

            //     }
            // }
        })

        var center = {
            x:$(".my-wrap .labelGroup").width()/2,
            y:$(".my-wrap .labelGroup").height()/2
        }


        var $li =  $(".my-wrap .labelGroup").find("li");
        var r = ($(".my-wrap .labelGroup").height()-$li.height()*2*2)/2
        var len = $li.length;
        drawArc(center.x,center.y,r)
        $li.each(function (idx) {
            var $this = $(this)
            var fontSizeArr = [16,18,30,24,20,26];
            var fontSize = fontSizeArr[Math.floor(Math.random()*fontSizeArr.length)]
            var opacity = fontSize/30;
            $(this).css({
                position:"absolute",
                opacity:opacity,
                fontSize:fontSize+"px",

            })
            var x;
            // 跳过中间
            if(idx>=len/2){
                x =  center.x-r+2*r/len*(idx+1);
            }else{
                x =  center.x-r+2*r/len*idx;
            }
            var y = (idx%2?1:-1)*Math.sqrt(r*r-(x-center.x)*(x-center.x))+center.y;
            var dy=0;
            var dx = 0;
            if(y<center.y){
                 dy = (y-center.y)/Math.abs(y-center.y)
            }
            if(x<center.x){
                dx = (x-center.x)/Math.abs(x-center.x)
            }

            $this.css({
                left:x+dx*$this.width(),
                top:y+dy*$this.height(),
            })
            console.log("x",x,"y",y,"w",$this.width(),"h",$this.height(),"left",$this.css("left"),"top",$this.css("top"),"cx",center.x,"cy",center.y)
            // $this.css({
            //     left:x,
            //     top:y,
            // })
        })

        function drawArc(x,y,r){
            var c = $("#canvas")[0];
            c.width = $(".my-wrap .labelGroup").width()
            c.height = $(".my-wrap .labelGroup").height()
            var ctx =c.getContext("2d");
            ctx.beginPath();
            ctx.arc(x,y,r,0,Math.PI*2)
            ctx.stroke();
        }

    })
})();
