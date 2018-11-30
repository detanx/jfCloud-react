import React,{ Component } from "react";
import {HashRouter as Router, Route, NavLink , Link} from "react-router-dom";
import {BASEPATH} from "../constants/number.js"
import {post} from "../fetch/index.js"
import DetailIntro from "./detail/DetailIntro.js";
import DetailContent from "./detail/DetailContent.js";
import DetailEvaluat from "./detail/DetailEvaluat.js";
import "../style/page/classify.css"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group : {},
      video: {},
      teacher: {},
      teacherDetail: {},
      evailuationCount : null,
      isStar:0,
    }
  }
  componentDidMount() {
    let _this = this;
    //获取视频详情
    const videoDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_video_detail", {
          videoId:localStorage.getItem("videoId"),
          userId:localStorage.getItem("userId")
        });
        const data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          if(newdata !== null) {
            _this.setState({
              group : newdata.group,
              video: newdata.video,
              teacher: newdata.teacher,
              evailuationCount : newdata.evailuationCount,
              teacherDetail: newdata.teacherDetail,
            })
          }
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    videoDetail() 
    //视频是否star
    const getStar = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_collection_one", {
          videoId:localStorage.getItem("videoId"),
          userId:localStorage.getItem("userId")
        });
        const data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          _this.setState({
            isStar:newdata
          })
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    getStar()
    //获取用户详情
    const getUserDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_user_detail", {userId:localStorage.getItem("userId")});
        const data = await json.json();
        //console.log(data)
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          let headPicAddress = newdata.userDetail.headPicAddress.split("//");
          headPicAddress = "http://www.jiaofukeyan.com/class/" + headPicAddress[headPicAddress.length-1]
          sessionStorage.setItem("headPicAddress",headPicAddress)
        }
      }catch (err){
        console.log(err);
      }
    }
    getUserDetail()
    this.getSegmentsHandle()
    this.getEvaluatHandle()
  }
  
  //获取视频目录
  getSegmentsHandle() {
    let getSegments = async() => {
      try {
        let json = await post(BASEPATH + "/user/get_segments", {videoId:localStorage.getItem("videoId")});
        let data = await json.json()
        if(data.status === 0) {
          //console.log(data)
          let obj = {};
          obj.valueData = data.data
          localStorage.setItem("contentIntro",JSON.stringify(obj));
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }
      catch(err) {
        console.log(err)
      }
    }
    getSegments()
  }
  
  //获取视频评论
  getEvaluatHandle() {
    let getEvaluat = async() => {
      try {
        let json = await post(BASEPATH + "/user/get_evailuations", {videoId:localStorage.getItem("videoId")});
        let data = await json.json()
        if(data.status === 0) {
          //console.log(data)
          let obj = {};
          obj.valueData = data.data
          localStorage.setItem("evaluatList",JSON.stringify(obj));
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }
      catch(err) {
        console.log(err)
      }
    }
    getEvaluat()
  }
  
  //取消/收藏
  starClickHandle() {
    let postdata = {},_this = this;
    postdata.userId = localStorage.getItem("userId");
    postdata.videoId = localStorage.getItem("videoId")
    let changeStar = async() => {
      try {
        let json = await post(BASEPATH + "/user/add_collection", postdata);
        let data = await json.json()
        if(data.status === 0) {
          let starNum = _this.state.isStar === 1 ? 0:1;
          _this.setState({
            isStar:starNum
          })
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }
      catch(err) {
        console.log(err)
      }
    }
    //取消/收藏
    changeStar()
  }
  
  saveTeacherHandle(teacherId) {
    localStorage.setItem("teacherId", teacherId);
  }
  
  //时间转换
  formatDateTime(date) { 
    date = new Date(date);//如果date为10位不需要乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    return Y + M + D; 
  }
  render() {
    let classContent = null;
    if(JSON.stringify(this.state.group) !== "{}"){
        //let groupitems = this.state.group;
        let teacheritems = this.state.teacher;
        let videoitems = this.state.video;
        let teacherDetailitems = this.state.teacherDetail;
        //预览图
        let previewImgAddress = videoitems.previewImgAddress.split("//");
        previewImgAddress = "http://www.jiaofukeyan.com/class/" + previewImgAddress[previewImgAddress.length-1]
        //视频
        let videoAddress = videoitems.videoAddress.split("//");
        videoAddress = "http://www.jiaofukeyan.com/class/" + videoAddress[videoAddress.length-1]
        //头像
        let headPicAddress = teacherDetailitems.headPicAddress.split("//");
        headPicAddress = "http://www.jiaofukeyan.com/class/" + headPicAddress[headPicAddress.length-1]
        //音频
        var audioAddress = videoitems.audioAddress.split("//");
        audioAddress = "http://www.jiaofukeyan.com/class/" + audioAddress[audioAddress.length-1]
        //pdf
        let pdfAddress = videoitems.pdfAddress.split("//");
        pdfAddress = "http://www.jiaofukeyan.com/class/" + pdfAddress[pdfAddress.length-1]
        sessionStorage.setItem("pdfAddress",pdfAddress)
        sessionStorage.setItem("audioAddress",audioAddress)
        let opendate = this.formatDateTime(videoitems.createDate)
        classContent =  <div className="detail-top clearfix" >
            <div className="detail-video fl">
              <video id="video1"  controls poster={previewImgAddress}>
                <source src={videoAddress} />
              </video>
            </div>
            <div className="detail-intro fl">
              <div className="detail-intro-top clearfix">
                <div className="detail-img fl">
                  <Link to="/owner/teacher" onClick={this.saveTeacherHandle.bind(this,teacheritems.userId)}>
                    <img src={headPicAddress} alt="头像" title=""/> 
                  </Link>
                  <p>{teacheritems.userName}</p> 
                </div>
                <div className="detail-p fl">
                  <div>
                    <span className="course-name">{videoitems.videoName}</span>
                    <span className={this.state.isStar === 1 ? "stared":"star"} onClick={this.starClickHandle.bind(this)}></span>
                    <p className="pmargin">主讲人简介:</p>
                    <p className="teacher-intro msgOverflow ">{teacherDetailitems.selfIntroduce}</p>
                  </div>
                  <span className="newest-date">{opendate}</span>
                  <span className="newest-review"><i>{this.state.evailuationCount}</i></span>
                  <span className="newest-watch"><i>{videoitems.watchCount}</i></span>
                </div>
              </div>
              <p className="pmargin">课程介绍:</p>
              <p className="group-intro">{videoitems.videoIntroduce}</p>
            </div>
          </div>
    }
    return (
      <div className="detail-cover">
        <div className="detail-classify">
          <a href="/#/index">全部组别 </a>&gt;
          <a href="/#/classify"> {localStorage.getItem("classify")} </a>&gt;
          <a href="/#/detail/intro"> {localStorage.getItem("videoName")}</a>
          {classContent}
          <Router>
  	        <div className="detail-bottom">
  	        	<ul className="clearfix">
  	        		<li className="lifirst"><NavLink to={`${this.props.match.url}/intro`} activeClassName="activeClass">简介</NavLink></li>
  	        		<li><NavLink onClick={this.getSegmentsHandle.bind(this)} to={`${this.props.match.url}/content`} activeClassName="activeClass">目录</NavLink></li>
  	        		<li><NavLink id="evaluateClick" onClick={this.getEvaluatHandle.bind(this)} to={`${this.props.match.url}/evaluat`} activeClassName="activeClass" >评论</NavLink></li>
  	        	</ul>
  	        	<div>
  	            <Route exact path={`${this.props.match.url}/intro`} component={DetailIntro}/>
  	            <Route path={`${this.props.match.url}/content`} component={DetailContent}/>
  	            <Route path={`${this.props.match.url}/evaluat`} component={DetailEvaluat}/>
  	        	</div>
  	        </div>
          </Router>
        </div>
      </div>
    )
  }
}