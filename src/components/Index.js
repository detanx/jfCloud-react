import React,{ Component } from "react";
import PropTypes from "prop-types"
import "../style/page/index.css";
import Scrollplay from "./Scrollplay.js"
import { post } from "../fetch";
import {BASEPATH} from "../constants/number.js"
// import $ from "jquery"

export default class extends Component {
  
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      classify:[],
      classifyDetail:[],
      videos:[]
    }
  }
  //首页的所有组别点击
  clickHandle(classify,classifyId,index) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    localStorage.setItem("classify", classify);
    localStorage.setItem("classifyId", classifyId);
    this.context.router.history.push("/classify");
  }
  
  noticeClickHandle(noticeId) {
    this.context.router.history.push("/owner/overview");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    sessionStorage.setItem("noticeId",noticeId)
  }

  componentDidMount() {
    let _this = this;
    //获取用户所属组别
    let getClassifys = async () => {
      try {
        let json = await post(BASEPATH + "/user/get_group",{userId:localStorage.getItem("userId")})
        let data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata);
          _this.setState({
            classify : newdata
          })
        }
      }catch(err) {
        console.log(err)
      }
    }
    getClassifys()
    //获取用户所属组别的最新视频
    let getNewVideo = async() => {
      try{
        let json = await post(BASEPATH + "/user/get_new_video",{userId:localStorage.getItem("userId")})
        let data = await json.json()
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          _this.setState({
            videos:newdata
          })
        }
        else if(data.status === 10003){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    getNewVideo()
  }
  //最新视频点击图片
  detailClickHandle(videoGroupId,videoName,videoId) {
    let _this = this;
    localStorage.setItem("classifyId", videoGroupId);
    localStorage.setItem("videoId", videoId);
    localStorage.setItem("videoName", videoName);
    this.context.router.history.push("/detail/intro");
    //增加观看次数
    let addWatchCount = async() => {
      try {
        const json = await post(BASEPATH + "/user/add_history", {
          videoId:videoId,
          userId:localStorage.getItem("userId"),
          historyTime:"00:00"
        });
        const data = await json.json();
        if(data.status === 0) {
          //console.log(data)
        }
        else if(data.status === 10003 || data.status === 10004){
          alert(data.msg)
          window.location.href = "/"
        }
        else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    addWatchCount()
    let getGroupName = async() => {
      try {
        const json = await post(BASEPATH + "/user/get_group_one", {groupId:videoGroupId});
        const data = await json.json();
        if(data.status === 0) {
          //console.log(data)
          if(data.data !== null) {
            let newdata = data.data.group;
            localStorage.setItem("classify", newdata.groupName);
            localStorage.setItem("videoName", videoName);
            _this.context.router.history.push("/detail/intro");
          }
        }
        else if(data.status === 10003 || data.status === 10004){
          alert(data.msg)
          window.location.href = "/"
        }
        else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    getGroupName()
  }
  saveTeacherHandle(teacherId) {
    this.context.router.history.push("/owner/teacher");
    localStorage.setItem("teacherId", teacherId);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
    let classifyResponse = null,//组别列表
        videosResponse = null;//最新视频
    if(JSON.stringify(this.state.classify) !== "[]") {
      classifyResponse = this.state.classify.map((items, index) => {
        let homebackground = items.groupImgAddress.split("//");
        homebackground = homebackground[homebackground.length-1]
        const homeImage = {
          background: `#FFF url(http://www.jiaofukeyan.com/class/${ homebackground }) center no-repeat`,
          backgroundSize:'cover'
        }
        return <div
            key={index + 1}
            onClick={this.clickHandle.bind(this, items.groupName, items.groupId, index)}
            className="group-list">
              <span style={ homeImage }></span>
              <p>{items.groupName}</p>
            </div>
      })
      
    }
    if(JSON.stringify(this.state.videos) !== "[]") {
      videosResponse = this.state.videos.map((item, index) => {
        let homebackground = item.video.previewImgAddress.split("//");
        homebackground = homebackground[homebackground.length-1]
        const homeImage = {
          background: `#FFF url(http://www.jiaofukeyan.com/class/${ homebackground }) center no-repeat`,
          backgroundSize:'cover'
        }
        let src = item.userDetail.headPicAddress.split("//");
        src = "http://www.jiaofukeyan.com/class/" + src[src.length-1]
        let opendate = this.formatDateTime(item.video.createDate)
        return <div className="newest clearfix fl" key={index + 2}>
              <div to="/detail/intro" onClick={this.detailClickHandle.bind(this, item.video.videoGroupId, item.video.videoName,item.video.videoId)}
                 className="newest-left fl" style={homeImage}>
              </div>
              <div className="newest-right fl">
                <p>{item.video.videoName}</p>
                <div className="clearfix newest-right-mid">
                  <div className="fl">
                    <img onClick={this.saveTeacherHandle.bind(this,item.user.userId)} src={src} alt=""/>
                  </div>
                  <div className="fl">
                    <p>{item.group.groupName}</p>
                    <p>{item.video.timeTableLocation === null?"无":item.video.timeTableLocation}</p>
                    <p>{item.user.userName}</p>
                  </div>
                </div>
                <span className="newest-date">{opendate}</span>
                <span className="newest-review">{item.count}</span>
                <span className="newest-watch">{item.video.watchCount}</span>
              </div>
            </div>
      })
    }else {
      videosResponse = <p>暂无最新上传的视频!</p>
    }
    return (
    	<div>
    		<Scrollplay />
	      <section className="index-content">
	        <h2>知识领域</h2>
	        <div className="index-classify clearfix">
            <div>
              { classifyResponse }
            </div>
	        </div>
	        <h2>最新上传</h2>
	        <div className="index-video clearfix">
	          {videosResponse}
	        </div>
	        <h2>最新公告</h2>
	        <div className="newest-announce">
	          <ul className="clearfix">
	            <li className="fl" onClick={this.noticeClickHandle.bind(this,0)}>
	              <p>实习生荣誉榜</p>
	              <p>行政部-赵葚</p>
	            </li>
	            <li className="fl" onClick={this.noticeClickHandle.bind(this,1)}>
                <p>实习生工作手册</p>
                <p>行政部-赵葚</p>
              </li>
              <li className="fl" onClick={this.noticeClickHandle.bind(this,2)}>
                <p>公司人员架构</p>
                <p>行政部-赵葚</p>
              </li>
	          </ul>
	        </div>
	      </section>
	    </div>
    )
  }
}