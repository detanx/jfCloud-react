import React,{ Component } from "react";
import $ from "jquery"
import { Link} from "react-router-dom";
import CourseHistory from "../CourseHistory.js";
import CourseVideo from "../CourseVideo.js";
import StarVideo from "../StarVideo.js";
import { post } from "../../fetch/index";
import {BASEPATH} from "../../constants/number.js"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos:[],
      openVideos:[],
      userDetail:{},
      user:{},
      courseNum:0,
      historyVideos:[]
    }
  }
  clickCourseHandle() {
    let _this = this;
    $(".teacher-nav li").click(function() {
      $(".teacher-nav li").eq($(this).index()).addClass("activeThree").siblings().removeClass('activeThree');
      $(".teacher-div > div").hide().eq($(this).index()).show();
    });
    const getCourse = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_teacher_video", {userId:localStorage.getItem("userId")});
        const data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          let len = newdata.length
          let videos=[];
          for(let i = 0;i < len;i ++) {
            let pushdata = newdata[i].video
            pushdata.groupName = newdata[i].group.groupName
            videos.push(pushdata)
          }
          _this.setState({
            courseNum:len,
            openVideos:videos
          })
        }
      }catch (err){
        console.log(err);
      }
    }
    getCourse()    
  }
  componentDidMount() {
    let _this = this;
    this.clickCourseHandle()
    //获取历史记录
    let getHistoryVideo = async() => {
      try {
        const json = await post(BASEPATH + "/user/get_history", {userId:localStorage.getItem("userId")});
        const data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          _this.setState({
            historyVideos:newdata,
          })
        }
        else if(data.status === 10003 || data.status === 1000){
          alert(data.msg)
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch (err){
        console.log(err)
      }
    }
    getHistoryVideo()
    //获取用户详情
    const getUserDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_user_detail", {userId:localStorage.getItem("userId")});
        const data = await json.json();
        //console.log(data)
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          _this.setState({
            userDetail:newdata.userDetail,
            user:newdata.user
          })
        }
      }catch (err){
        console.log(err);
      }
    }
    getUserDetail()
  }
  clickStarHandle() {
    let _this = this;
    $(".teacher-nav li").click(function() {
      $(".teacher-nav li").eq($(this).index()).addClass("activeThree").siblings().removeClass('activeThree');
      $(".teacher-div > div").hide().eq($(this).index()).show();
    });
    //获取用户所属收藏的视频
    let getUserStarVideo = async() => {
      try{
        let json = await post(BASEPATH + "/user/get_collection", {userId:localStorage.getItem("userId")})
        let data = await json.json()
        if(data.status === 0) {
          let newdata = data.data;
          console.log(data)
          if(newdata !== null) {
            let videos=[];
            for(let i = 0;i < newdata.length;i ++) {
              videos.push(newdata[i])
            }
            _this.setState({
              videos:videos
            })
          }
        }
      }catch (err){
        console.log(err)
      }
    }
    getUserStarVideo()
  }
  
  problemClickHandle() {
    let problemValue = $('.tip-reverse textarea').val()
    if(problemValue === "") {
      alert("问题内容不能为空！")
      return;
    }else {
      //问题反馈
      let addProblem = async() => {
        try{
          let json = await post(BASEPATH + "/user/add_problem", {
            userId:localStorage.getItem("userId"),
            problemDetail:problemValue
          })
          let data = await json.json()
          if(data.status === 0) {
            let newdata = data.data;
            alert(newdata.msg)
            $('.tip-reverse textarea').val("")
          }
        }catch (err){
          console.log(err)
        }
      }
      addProblem()
    }
  }
  
  clickHandle() {
    $(".teacher-nav li").click(function() {
      $(".teacher-nav li").eq($(this).index()).addClass("activeThree").siblings().removeClass('activeThree');
      $(".teacher-div > div").hide().eq($(this).index()).show();
    });
  }

  render() {
    let centerMsgHtml = null;
    if(JSON.stringify(this.state.userDetail) !== "{}") {
      var userDetail = this.state.userDetail;
      var user = this.state.user;
      var homebackground = userDetail.headPicAddress.split("//");
      homebackground = homebackground[homebackground.length-1]
      var src = "http://www.jiaofukeyan.com/class/" + homebackground;
      centerMsgHtml = <div className="index-video clearfix">
          <div className="fl teacher-topleft">
            <img src={src} alt="头像" />
            <p>{user.userName}</p>
            <p>{user.isTeacher === 1 ? "负责人":localStorage.getItem("classify")}</p>
          </div>
          <div className="fl teacher-topmid">
            <div>
              <p>工作 QQ：<span>{userDetail.qicqNum===null?"无":userDetail.qicqNum}</span></p>
              <p>联系电话：<span>{userDetail.userTelephone===null?"无":userDetail.userTelephone}</span></p>
            </div>
            <div>
              <p>常用邮箱：<span>{userDetail.userEmail===null?"无":userDetail.userEmail}</span></p>
              <p>毕业院校：<span>{userDetail.userSchool===null?"无":userDetail.userSchool}</span></p>
            </div>
            <div className="dash-border">
              <p>擅长领域：<span>{userDetail.expertiseAreas===null?"无":userDetail.expertiseAreas}</span></p>
              <Link to="/owner/ownerset">个人设置&gt;&gt;</Link>
            </div>
            <p className="true-name">真实姓名：<span>{userDetail.realName}</span></p>
            <span className={userDetail.male === 1? "male":"famale"}></span>
            <div className="owner-intro">
              <p className="owner-introp1">个人简介：</p>
              <p className="owner-introp2">{userDetail.selfIntroduce}</p>
            </div>
          </div>
          <div className="fl teacher-topright">
            <span></span>
            <p>发布课程</p>
            <p>{this.state.courseNum}个</p>
          </div>
        </div>
    }
    return (
      <div className="index-content">
        {centerMsgHtml}
        <div className="clearfix">
          <div className="teacher-nav fl">
            <ul>
              <li className="activeThree" onClick={this.clickHandle.bind(this)}>观看历史</li>
              <li onClick={this.clickStarHandle.bind(this)}>课程收藏</li>
              <li onClick={this.clickCourseHandle.bind(this)}>发布课程</li>
              <li onClick={this.clickHandle.bind(this)}>意见反馈</li>
            </ul>
            <div className="wechat-code">
              <img src="" alt="二维码"/>
              <p>交复云课堂微信小程序</p>
            </div>
          </div>
          <div className="teacher-div fl">
            <div>
              <CourseHistory videos={this.state.historyVideos}/>
            </div>
            <div>
              <StarVideo videos={this.state.videos}/>
            </div>
            <div>
              <CourseVideo videos={this.state.openVideos} teacher={this.state.user.userName}/>
            </div>
            <div className="tip-reverse">
              <textarea placeholder="200字以内"></textarea>
              <span>*交复科研重视每一位员工的反馈意见，我们将以最快的速度解决您的问题，感谢!</span>
              <button onClick={this.problemClickHandle.bind(this)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}