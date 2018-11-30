import React,{ Component } from 'react';
import $ from 'jquery'
import '../../style/page/DetailEvaluat.css'
import { post } from '../../fetch';
import { BASEPATH } from '../../constants/number';

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  hidPicture:"",
		  valueData:[]
		}
	}
	
	formatDateTime(date) { 
		date = new Date(date);//如果date为10位不需要乘1000
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
		return Y+M+D+h+m+s; 
    //return new Date(parseInt(timeStamp)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
	}

	componentDidMount() {
		this.scoreFunction("score1", "on");
		if(JSON.stringify(localStorage.getItem('evaluatList')) !== "null") {
		  let valueData = JSON.parse(localStorage.getItem('evaluatList')).valueData
		  this.setState({
		    valueData:valueData
		  })
		}
	}

	scoreFunction(scoreId, extentStr) {
		scoreId = "#" + scoreId;
		let index = 0;
		$(scoreId + " i").hover(function() {
			// 鼠标移入，未确定选择分数时
			for (let i = 0; i <= $(this).index(); i++) {
				$(scoreId + " i").eq(i).addClass(extentStr); // 实星星
        index = i
			}
		}, function() { 
			// 鼠标移出
			$(scoreId + " i").removeClass(extentStr); // 描线星星
			for (let i = 0; i <= index; i ++) {
        $(scoreId + " i").eq(i).addClass(extentStr); // 实星星
      }
		});
	}
	submitClickHandle() {
		let messages = $("textarea[name=review]").val();
		let scores = $("#score1 .on").length;
		let postdata = {
			evailuationDetail:messages,
			evailuationScore:scores,
			evailuationUserId:localStorage.getItem("userId"),
			evailuationVideoId:localStorage.getItem("videoId")
		}
		let updateEvailute = async() => {
			try{
				let json = await post(BASEPATH + "/user/add_evailuation", postdata)
				let data = await json.json();
				//console.log("评论数据返回：" + data);
				if(data.status === 0) {
				  alert("提交成功！")
				}
				else if(data.status === 10003){
					window.location.href = "/"
				}else {
					console.log(data.msg)
				}
			}catch(err) {
				console.log(err)
			}
		}
		//提交评论
		updateEvailute()
	}
	render() {
	  let evaluatHtml = null;
	  if(JSON.stringify(this.state.valueData) !== "[]") {
      evaluatHtml = this.state.valueData.map((item, index) => {
        let src = item.userDetail.headPicAddress.split("//");
        src = "http://www.jiaofukeyan.com/class/" + src[src.length-1]
        return (
          <div key={item + 10} className="evaluat clearfix">
            <div className='evaluat-left fl'>
              <img src={src} alt=""/>
              <p>{item.userDetail.realName}</p>
            </div>
            <div className='evaluat-right fl'>
              <div className='stardiv'>
                <span className={item.evailuation.evailuationScore >= 1 ? 'stars':'nostar'} onClick={this.scoreFunction.bind(this,"score1", "on")}></span>
                <span className={item.evailuation.evailuationScore >= 2 ? 'stars':'nostar'} onClick={this.scoreFunction.bind(this,"score1", "on")}></span>
                <span className={item.evailuation.evailuationScore >= 3 ? 'stars':'nostar'} onClick={this.scoreFunction.bind(this,"score1", "on")}></span>
                <span className={item.evailuation.evailuationScore >= 4 ? 'stars':'nostar'} onClick={this.scoreFunction.bind(this,"score1", "on")}></span>
                <span className={item.evailuation.evailuationScore >= 5 ? 'stars':'nostar'} onClick={this.scoreFunction.bind(this,"score1", "on")}></span>
              </div>
              <p className='date'>{this.formatDateTime(item.evailuation.createDate)}</p>
              <p>{item.evailuation.evailuationDetail}</p>
            </div>
          </div>
        )
      })
    }
		return (
			<div className="evaluatCover">
				<div className="evaluat evaluatfirst clearfix">
					<div className='evaluat-left fl'>
						<img src={sessionStorage.getItem("headPicAddress")} alt="头像"/>
						<p>{localStorage.getItem("userName")}</p>
					</div>
					<div className='evaluat-right fl'>
						<div>
							<textarea name="review" ref="review" cols="30" rows="10"></textarea>
						</div>
						<div className='clearfix'>
							<span id="score1" className='fl'>
								<i></i><i></i><i></i><i></i><i></i>
							</span>
							<button className='reviewSubmit fr'
								onClick={this.submitClickHandle.bind(this)}
							>提交</button>
						</div>
					</div>
				</div>
				{ evaluatHtml }
			</div>
		)
	}
}
