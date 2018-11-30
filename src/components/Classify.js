import React,{ Component } from "react";
import { Link} from "react-router-dom";
import {BASEPATH} from "../constants/number.js"
import {post} from "../fetch/index.js"
import CourseVideo from "./CourseVideo.js";
import "../style/page/classify.css"
import "../style/App.css";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group:{},
      videos:[],
      teacher:{},
      teacherDetail:{},
      userDetail:{}
    }
  }
  componentDidMount() {
    let _this = this;
    let getOneClass = async () => {
      try {
        let json = await post(BASEPATH + "/user/get_group_one",{groupId:localStorage.getItem("classifyId")})
        let data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata);
          let pushdata = newdata.videos
          pushdata.groupName = newdata.group.groupName
          _this.setState({
            group : newdata.group,
            videos : pushdata,
            teacher : newdata.teacher,
            teacherDetail : newdata.userDetail,
            userDetail:newdata.userDetail
          })
        }
      }catch(err) {
        console.log(err)
      }
    }
    //获取点击的组别信息
    getOneClass()
    const classVideos = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_group_one", {groupId:localStorage.getItem("classifyId")});
        const data = await json.json();
        if(data.status === 0) {
          console.log(data)
          if(data.data !== null) {
            let newdata = data.data.videos;
            let videos=[];
            for(let i = 0;i < newdata.length;i ++) {
              let pushdata = newdata[i]
              pushdata.groupName = data.data.group.groupName
              videos.push(pushdata)
            }
            console.log(videos)
            _this.setState({
              videos:videos
            })
          }
        }
        else if(data.status === 10003 || data.status === 10004){
          alert(data.msg)
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    //获取某个组别所有视频
    classVideos()
  }
  
  saveTeacherHandle(teacherId) {
    localStorage.setItem("teacherId", teacherId);
  }
  
  render() {
    let classContent = null,allVideos = null,course = null;
    if(JSON.stringify(this.state.group) !== "{}"){
      let groupitems = this.state.group;
      let teacheritems = this.state.teacher;
      let teacherDetailitems = this.state.teacherDetail;
      let userDetailitems = this.state.userDetail;
      //视频
      let previewImgAddress = groupitems.previewImgAddress.split("//");
      previewImgAddress = "http://www.jiaofukeyan.com/class/" + previewImgAddress[previewImgAddress.length-1]
      //视频
      let groupCartoonAddress = groupitems.groupCartoonAddress.split("//");
      groupCartoonAddress = "http://www.jiaofukeyan.com/class/" + groupCartoonAddress[groupCartoonAddress.length-1]
      //头像
      let headPicAddress = userDetailitems.headPicAddress.split("//");
      headPicAddress = "http://www.jiaofukeyan.com/class/" + headPicAddress[headPicAddress.length-1]
      //课表
      let groupCurriculmAddress = groupitems.groupCurriculmAddress.split("//");
      groupCurriculmAddress = "http://www.jiaofukeyan.com/class/" + groupCurriculmAddress[groupCurriculmAddress.length-1]
      classContent = <div className="detail-top clearfix">
          <div className="detail-video fl">
            <video controls poster={previewImgAddress}>
              <source src={groupCartoonAddress} />
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
                <p className="pmargin">负责人简介:</p>
                <p className="msgOverflow">{teacherDetailitems.selfIntroduce}</p>
                <p className="pmargin">组员构成:</p>
                <p className="msgOverflow">{groupitems.groupContainer}</p>
              </div>
            </div>
            <p className="pmargin">组别介绍:</p>
            <p className="group-intro">{groupitems.groupIntroduce}</p>
          </div>
        </div>
      allVideos = <CourseVideo videos={this.state.videos} teacher={this.state.teacher.userName} />
      
      course = <img src={groupCurriculmAddress} alt="course" />
    }
    
    return (
      <div className="detail-cover">
        <div className="detail-classify">
          <a href="/#/index">首页</a> &gt;
          <a href="/#/classify"> {localStorage.getItem("classify")}</a>
          {classContent}
        </div>
        <div className="detail-list">
          <p></p>
          <div className="group-timetable">
            <h2>组别课表</h2>
            <div className="course-scroll">
              {course}
            </div>
          </div>
          <div className="index-video classbottom clearfix">
            <h2>组别课程</h2>
            { allVideos }
          </div>
        </div>
      </div>
    )
  }
}