import React,{ Component } from "react";
import $ from "jquery";
import { BASEPATH, PHONERE, EMAILRE } from "../../constants/number.js";
import { post } from "../../fetch";
import "../../style/page/ownerset.css"
let imgurldata = ""

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
			phoneNum:"",
			userAge:"",
			userSchool:"",
			userEmail:"",
			userImgAddress:"",
		}
	}
	componentDidMount() {
		let _this = this
		const getUserDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_user_detail", {userId:localStorage.getItem("userId")});
				const data = await json.json();
				console.log(data)
        if(data.status === 0) {
          let newdata = data.data;
          console.log(newdata)
          _this.setState({
            phoneNum:newdata.phoneNum,
            userAge:newdata.userAge,
            userSchool:newdata.userSchool,
						userEmail:newdata.userEmail,
						userImgAddress:newdata.userImgAddress,
          })
				}
				console.log(_this.state)
      }catch (err){
        console.log(err);
      }
		}
		getUserDetail()
		$(function () {
			var downX = 0,downY = 0,boxLeft = 0,boxTop = 0;
			var chooseBox = $('#chooseBox').get(0);
			var scaleImage = 1;
			var flag = true;// 点击线条和放大缩小按钮的开关
			var init = false;// 初始化每次上传选择图片
			$('#fileUpload').on('click', function () {//选择图片并实时预览
				$('#fileSrc').click();
			})
			$('#fileSrc').on('change', function () {
				if (typeof (FileReader) !== "undefined") {
					var reader = new FileReader();
					reader.onload = function (e) {
						if (init) {
							$('.cut-img img').attr('src', e.target.result).css('transform', 'scale(1)');
							$('#moveLine').css('width', 0 + 'px');
							$('#dot').css('left', 0 + 'px');
						}
						$('.bgd-show img').attr('src', e.target.result);
						$('.preview-img img').css('display', 'none');
						$('.bgd-layer').removeClass('active');
						$('.box div').addClass('active');
						//添加 mousedown 事件监听
						chooseBox.addEventListener('mousedown', mouseDown, false);
					}
					reader.readAsDataURL($(this)[0].files[0]);
					init = true;
					$('#resize').show();
					setTimeout(function () {
						scaleImage = 1;
						startCanvas();
					}, 100)
				} else {
					alert("你的浏览器不支持FileReader.");
				}
			});
			//裁剪框拖拽，mousedown 事件监听
			function mouseDown(e) {
				downX = e.pageX;
				downY = e.pageY;
				boxTop = $('#chooseBox').css('top');
				boxTop = parseInt(boxTop.substring(0, boxTop.length - 2), 10);
				boxLeft = $('#chooseBox').css('left');
				boxLeft = parseInt(boxLeft.substring(0, boxLeft.length - 2), 10);
				$('.box').children('div').removeClass('default').removeClass('active');
				$('.preview-img img').css('display', 'block');
				chooseBox.addEventListener('mousemove', mouseMove, false);
				$('#box').css('border', '2px solid transparent');
			}
			// mousedown 事件中添加的 mousemove 事件监听
			function mouseMove(e) {
				var moveX = downX - e.pageX;
				var moveY = downY - e.pageY;
				var maxX = boxLeft - 80;
				var maxY = boxTop - 45;
				$('#box').css('border', '2px solid transparent');
				// 随着鼠标移动截取框的同时 调整截取框内图片的位置
				if (moveX >= 0 && moveX <= boxLeft) {
					changeImgX(moveX - boxLeft);
				}
				if (moveX <= 0 && moveX >= maxX) {
					changeImgX(moveX - boxLeft);
				}
				if (moveY >= 0 && moveY <= boxTop) {
					changeImgY(moveY - boxTop);
				}
				if (moveY <= 0 && moveY >= maxY) {
					changeImgY(moveY - boxTop);
				}
			}
			// mouseup事件，移除 mousedown 事件中添加的 mousemove 事件监听
			$('#chooseBox').on('mouseup', function () {
				$('#box').css('border', '2px dashed #aaaaaa');
				$('.preview-img img').css('display', 'none');
				if (init) {
					$('.box').children('div').addClass('default').addClass('active');
				} else {
					$('.box').children('div').addClass('default');
				}
				// $('.box div').removeClass('active');
				//移除选中裁剪框后的 mousemove 事件监听
				chooseBox.removeEventListener('mousemove', mouseMove, false);
				// 创建画布开始绘制裁剪后的图片
				startCanvas();
			})
			// 改变图片的水平位置
			function changeImgX(num) {
				$('.bgd-show img').css('margin-left', num);
				$('#chooseBox').css('left', -num);
				$('.preview-img img').css('margin-left', num);
			}
			// 改变图片的垂直位置
			function changeImgY(num) {
				$('.bgd-show img').css('margin-top', num);
				$('#chooseBox').css('top', -num);
				$('.preview-img img').css('margin-top', num);
			}
			// Html5 canvas绘制图片
			function startCanvas() {
				createCircleCanvas();// 创建画布绘制裁剪后的图片
			}
			// 创建画布 画圆圈的
			function createCircleCanvas() {
				var mycanvas = document.getElementById('circleCanvas');
				var ctx = mycanvas.getContext('2d');
				mycanvas.width = 180;
				mycanvas.height = 180;
				var img = document.getElementById("old-img");
				var xc = $('.bgd-show img').css('margin-left');
				xc = parseInt(xc.substring(0, xc.length - 2), 10);
				var yc = $('.bgd-show img').css('margin-top');
				yc = parseInt(yc.substring(0, yc.length - 2), 10);
				if (xc < 0) {
					xc = 0 - xc;
				}
				if (yc < 0) {
					yc = 0 - yc;
				}
				xc = xc + (img.width * scaleImage - $('.cut-img').width()) / 2 + (320 - mycanvas.width) / 2;
				yc = yc + (img.height * scaleImage - $('.cut-img').height()) / 2;
				// 计算图片宽度缩放比
				var rateX = img.width * scaleImage / img.naturalWidth;
				// 计算图片高度缩放比
				var rateY = img.height * scaleImage / img.naturalHeight;
				xc = parseInt(xc / rateX, 10);
				yc = parseInt(yc / rateY, 10);
				ctx.drawImage(img, xc, yc, mycanvas.width / rateX, mycanvas.height / rateY, 0, 0, mycanvas.width, mycanvas.height);
				var dataurl = mycanvas.toDataURL('image/png'); //base64图片数据
				imgurldata = dataurl;
				var arr = dataurl.split(','),
						mime = arr[0].match(/:(.*?);/)[1],
						bstr = atob(arr[1]),
						n = bstr.length,
						u8arr = new Uint8Array(n);
				while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
				}
				var obj = new Blob([u8arr], {
						type: mime,
				});
				var fd = new FormData();
				fd.append("upfile", obj, "image.png"); // upfile指图片存放路径
				// submitData(fd); Ajax上传到服务器 这里只传了图片参数
			}
			// 点击放大缩小的白色的点
			function getX(obj) {
				var parObj = obj;
				var left = obj.offsetLeft;
				while (parObj === parObj.offsetParent) {
					left += parObj.offsetLeft;
				}
				return left;
			}
			function DisplayCoord(event) {
				var left, oDiv, changeLeft;
				oDiv = document.getElementById("line");
				if (flag) {
					left = getX(oDiv);
					changeLeft = event.clientX - left + document.documentElement.scrollLeft;
					if (changeLeft <= 0) {
						changeLeft = 0;
					} else if (changeLeft >= $('#line').width() - $('#dot').width()) {
						changeLeft = $('#line').width() - $('#dot').width() / 2;
					}
					// 获取百分之并改变图片的scale
					scaleImage = 1 + changeLeft / $('#line').width();
				} else {
					changeLeft = $('#line').width() * (scaleImage - 1);
				}
				$('#old-img').css('transform', 'scale(' + scaleImage + ')');
				$('#highlightImg').css('transform', 'scale(' + scaleImage + ')');
				$('#moveLine').css('width', changeLeft + 'px');
				$('#dot').css('left', changeLeft + 'px');
			}
			// 点击横线的时候 放大缩小图片
			$('#line').on('click', function (event) {
				DisplayCoord(event);
				createCircleCanvas();
			})
			// 点击放大按钮
			$('#enlargeBtn').click(function () {
				// 默认能放大两倍 能点击4下放大按钮
				flag = false;
				scaleImage += 0.2;
				if (scaleImage >= 2) {
						scaleImage = 2;
				}
				$("#line").trigger("click");
				flag = true;
			})
			// 点击缩小按钮
			$('#reduceBtn').click(function () {
				// 默认能放大两倍 能点击4下放大按钮
				flag = false;
				scaleImage -= 0.2;
				if (scaleImage <= 1) {
						scaleImage = 1;
				}
				$("#line").trigger("click");
				flag = true;
			})
		})
	}
	getFileType(filePath){
		var startIndex = filePath.lastIndexOf(".");
		if(startIndex !== -1)
			return filePath.substring(startIndex+1, filePath.length).toLowerCase();
		else return "";
	}
	submitHandle(e) {
		e.preventDefault()
		let _this = this;
		let options = {};
		let phoneNum = $(".phone").val();
		let userAge = $(".age").val();
		let userSchool = $(".school").val();
		let userEmail = $(".email").val();
		userAge = parseInt(userAge,10)
		if(typeof userAge !== "number" || userAge%1 !== 0) {
			alert("年龄只能为0-99的整数");
			return;
		}
		if(!PHONERE.test(phoneNum)) {
			alert("手机号有误，请重新填写！");
			return;
		}
		if(!EMAILRE.test(userEmail)) {
			alert("邮箱格式错误/无效邮箱，请重新填写！");
			return;
		}
		options = {
			userId: localStorage.getItem("userId"),
			phoneNum: phoneNum,
			userAge: userAge,
			userSchool: userSchool,
			userEmail: userEmail,
		}
		const ownerSet = async () => {
			try {
				const json = await post(BASEPATH + "/user/update_user_detail", options);
				const data = await json.json();
				if(data.status === 0) {
					console.log(data)
					
				}
			}catch (err){
				console.log(err);
			}
		}
		let imgValue = $("#imgshow").val()
		if(imgValue !== "") {
			let imgfileType = _this.getFileType(imgValue)
			if(imgfileType !== 'bmp' && imgfileType !== 'png' && imgfileType !== 'jpg' && imgfileType !== 'jpeg'){
				alert("请上传png/jpg等图片类型的文件！")
				$('#filed').val("");
				return;
			}
			let formData = new FormData();
			formData.append('file',$("#imgValue").get(0).files[0]);
			const ownerSetImg = async () => {
				try {
					const json = await post(BASEPATH + "/file/upload_file", formData);
					const data = await json.json();
					if(data.status === 0) {
						console.log(data)
						options.userImgAddress = data.data
						//更新个人信息
						ownerSet()
					}
				}catch (err){
					console.log(err);
				}
			}
			//图片上传//
			ownerSetImg()
		}else {
			options.userImgAddress = "";
			//更新个人信息
			ownerSet()
		}
		
	}
	upImgClickHandle() {
		$(".input_box").css({
			"display":"block"
		})
	}
	imgShowClickHandle() {
		$("#imgshow").attr({"src":imgurldata})
		$(".input_box").css({
			"display":"none"
		})
	}
	changeAgeHandle(e) {
		this.setState({userAge: e.target.value});
	}
	changeNumHandle(e) {
		this.setState({phoneNum: e.target.value});
	}
	changeSchoolHandle(e) {
		this.setState({userSchool: e.target.value});
	}
	changeEmailHandle(e) {
		this.setState({userEmail: e.target.value});
	}
  render() {
		let recontent = null;
		if(JSON.stringify(this.state) !== "{}") {
			recontent = <form action="" method="post">
			<div id="boxs">
				<img id="imgshow" src={this.state.userImgAddress}  alt=""/>
			</div>
			<div id="poxs">
				<p onClick={this.upImgClickHandle.bind(this)}>选择头像</p>
				{/* <input id="filed" type="file" accept="image/*" name="file"/> */}
			</div>
			<br/>
			<input type="text" className="username" placeholder="姓名" value={localStorage.getItem("userName")} disabled />
			<input type="text" className="age" placeholder="年龄" value={this.state.userAge} onChange={this.changeAgeHandle.bind(this)}/>
			<input type="text" className="phone" placeholder="手机" value={this.state.phoneNum} onChange={this.changeNumHandle.bind(this)}/>
			{/* <input type="text" className="grounp" placeholder="组别" value={this.state.userDetail[0].userAge} onChange={this.changeHandle.bind(this)}/> */}
			<input type="text" className="school" placeholder="学校" value={this.state.userSchool} onChange={this.changeSchoolHandle.bind(this)}/>
			<input type="text" className="email" placeholder="邮箱" value={this.state.userEmail} onChange={this.changeEmailHandle.bind(this)}/>
			<button  id="submit" onClick={this.submitHandle.bind(this)}>提交</button>
		</form>
		}
    return (
      <div className="index-content">
        <div className="ownerset">
          {recontent}
        </div>
				<div className="layui-input-inline input_box facility_box">
					<div className="layui-form-item pad-left">
						<div className="left_box fl">
							<div className="cut-img">
								<img id="old-img"/>
								<div className="bgd-layer active">
									<div id="chooseBox">
										<div className="bgd-show">
											<img id="highlightImg"/>
										</div>
										<div className="box" id="box" style={{border: "2px dashed rgb(170, 170, 170)"}}>
											<div className="default box-lt"></div>
											<div className="default box-rt"></div>
											<div className="default box-rb"></div>
											<div className="default box-lb"></div>
										</div>
									</div>
								</div>
							</div>
							<div className="resize clear" id="resize">
								<i className="iconfont icon-11 fl" id="reduceBtn">-</i>
								<div className="line" id="line">
									<div className="has_move_line" id="moveLine"></div>
									<span className="move_dot" id="dot"></span>
								</div>
								<i className="iconfont icon-tianjia2 fl" id="enlargeBtn">+</i>
							</div>
							<div className="upload_btn">
								<input type="button" id="fileUpload" className="layui-btn layui-btn-primary" value="选择图片"/>
								<input type="file" id="fileSrc" value="" className="fileSrc"/>
							</div>
						</div>
						<div className="right_box fl">
							<p className="preview_text">效果图</p>
							<div className="upload-img">
								<div className="preview-img">
									<canvas id="circleCanvas" width="180" height="180" className="circleCanvas">
										<span>你的浏览器不支持canvas</span>
									</canvas>
									{/* <canvas id="mycanvas" className="mycanvas" width="320" height="180">
										<span>你的浏览器不支持canvas</span>
									</canvas> */}
									<button onClick={this.imgShowClickHandle.bind(this)}>确定</button>
								</div>
							</div>
						</div>
					</div>
    		</div>
      </div>
    )
  }
}