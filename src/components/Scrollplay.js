import React, { Component } from "react";
import $ from "jquery"
import "../style/page/Scrollplay.css"

export default class extends Component {
  componentWillMount() {
    $(window).ready(function(){
      let bodywidth = $(window).width() > 1366 ? $(window).width() : 1366;
      let h = bodywidth * 420 / 1900
      $("#lunbobox,.middle_right").css({
      "height": h
      })
    })
    $(window).resize(function() {
      let bodywidth = $(window).width() > 1366 ? $(window).width() : 1366;
      let h = bodywidth * 420 / 1900
      $("#lunbobox,.middle_right").css({
      "height": h
      })
    });
  }
	componentDidMount() {
		$(window).ready(function(){
      let bodywidth = $(window).width() > 1366 ? $(window).width() : 1366;
      let h = bodywidth * 420 / 1900
			$("#lunbobox,.middle_right").css({
			"height": h
			})
		})
		$(window).resize(function() {
      let bodywidth = $(window).width() > 1366 ? $(window).width() : 1366;
      let h = bodywidth * 420 / 1900
			$("#lunbobox,.middle_right").css({
			"height": h
			})
		});
		
		$("#lunbobox ul li").eq(0).css({
      "background": "#999",
      "border": "1px solid #ffffff"
    })

		var t;
		var index = 0;
		//自动播放
		t = setInterval(play, 3000)
		function play() {
		  index++;
		  if (index > 2) {
		    index = 0
		  }
		  $("#lunbobox ul li").eq(index).css({
		    "background": "#999",
		    "border": "1px solid #ffffff"
		  }).siblings().css({
		    "background": "#cccccc",
		    "border": ""
		  })
		
		  $(".lunbo div").eq(index).fadeIn(1000).siblings().fadeOut(1000);
		};
		///点击鼠标 图片切换
		$("#lunbobox ul li").click(function() {
		  //添加 移除样式
		  $(this).addClass("lito").siblings().removeClass("lito"); //给当前鼠标移动到的li增加样式 且其余兄弟元素移除样式   可以在样式中 用hover 来对li 实现
		  $(this).css({
		    "background": "#999",
		    "border": "1px solid #ffffff"
		  }).siblings().css({
		    "background": "#cccccc"
		  })
		  var index = $(this).index(); //获取索引 图片索引与按钮的索引是一一对应的
		  $(".lunbo div").eq(index).fadeIn(1000).siblings().fadeOut(1000); // siblings  找到 兄弟节点(不包括自己）
		});

	  //鼠标移进  移出
	  $("#lunbobox ul li,.lunbo div img").hover(
	  //鼠标移进
	  function() {
	    $("#toright,#toleft").show()
	    clearInterval(t);
	  },
	  //鼠标移开
	  function() {
	    t = setInterval(play, 3000)
	    function play() {
	      index++;
	      if (index >= 3) {
	        index = 0
	      }
	      $("#lunbobox ul li").eq(index).css({
	        "background": "#999",
	        "border": "1px solid #ffffff"
	      }).siblings().css({
	        "background": "#cccccc"
	      })
	      $(".lunbo div").eq(index).fadeIn(1000).siblings().fadeOut(1000);
	    }
	  })
	}
  render() {
  return (
   	<div className="middle_right">
		  <div id="lunbobox">
				<div className="lunbo">
					<div className="aimg1" mode="widthFix"></div>
					<div className="aimg2" mode="widthFix"></div>
					<div className="aimg3" mode="widthFix"></div>
				</div>
				<ul>
					<li></li>
					<li></li>
					<li></li>
				</ul>
				<span></span>
			</div>
		</div>
   )
  }
}