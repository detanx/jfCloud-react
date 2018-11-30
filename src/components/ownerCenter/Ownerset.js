import React,{ Component } from "react";
import $ from "jquery";
import { BASEPATH, PHONERE, EMAILRE } from "../../constants/number.js";
import { post } from "../../fetch";
import "../../style/page/ownerset.css"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
			userDetail:{},
			user:{},
			qicqNum:"",
			userTelephone:"",
			userSchool:"",
			userEmail:"",
			expertiseAreas:""
		}
	}
	componentDidMount() {
		let _this = this
		const getUserDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_user_detail", {userId:localStorage.getItem("userId")});
				const data = await json.json();
				//console.log(data)
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          let qicqNum = newdata.userDetail.qicqNum
          let userTelephone = newdata.userDetail.userTelephone
          let userEmail = newdata.userDetail.userEmail
          //console.log(userEmail)
          let userSchool = newdata.userDetail.userSchool
          let expertiseAreas = newdata.userDetail.expertiseAreas
          _this.setState({
            userDetail:newdata.userDetail,
            user:newdata.user,
            qicqNum:qicqNum,
            userTelephone:userTelephone,
            userSchool:userSchool,
            userEmail:userEmail,
            expertiseAreas:expertiseAreas
          })
				}
      }catch (err){
        console.log(err);
      }
		}
		getUserDetail()
	}
	submitHandle(e) {
		e.preventDefault()
    let postdata = {};
		let qq = $(".qq").val();
		let phone = $(".phone").val();
		let email = $(".email").val();
		let school = $(".school").val();
    let skill = $("textarea[name=skill]").val();
		if(qq === "" || phone === "" || email === "" || school === "" || skill === "" ) {
			alert("所有内容不能为空！");
			return;
		}
		if(!PHONERE.test(phone)) {
		  alert("电话号码格式错误！");
      return;
		}
    if(!EMAILRE.test(email)) {
      alert("邮箱格式错误！");
      return;
    }
    postdata = {
      userId:localStorage.getItem("userId"),
      qicqNum: qq,
      userTelephone: phone,
      userEmail: email,
      userSchool: school,
      expertiseAreas: skill
    }
    let getSegments = async() => {
      try {
        let json = await post(BASEPATH + "/user/add_user_detail", postdata);
        let data = await json.json()
        if(data.status === 0) {
          //console.log(data)
          alert("保存成功！")
          window.history.go(-1)
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
	changeQQHandle(e) {
		this.setState({qicqNum: e.target.value});
	}
	changeNumHandle(e) {
		this.setState({userTelephone: e.target.value});
	}
	changeSchoolHandle(e) {
		this.setState({userSchool: e.target.value});
	}
	changeEmailHandle(e) {
		this.setState({userEmail: e.target.value});
	}
	changeExperHandle(e) {
	  this.setState({expertiseAreas: e.target.value});
	}
	setClickHandle() {
	  $(".owner-option input,.owner-option textarea").attr("disabled",false)
	}
  render() {
    let ownerSetHtml = null;
    if(JSON.stringify(this.state.userDetail) !== "{}") {
      var userDetail = this.state.userDetail;
      var user = this.state.user;
      var homebackground = userDetail.headPicAddress.split("//");
      homebackground = homebackground[homebackground.length-1]
      var src = "http://www.jiaofukeyan.com/class/" + homebackground;
      ownerSetHtml = <div className="owner-set">
          <h2>个人设置</h2>
          <div className="clearfix">
            <div className="ownerset-topleft fl">
              <img src={src} alt="头像" />
              <p>{user.userName}</p>
              <p>{user.isTeacher === 1 ? "负责人":localStorage.getItem("classify")}</p>
            </div>
            <div className="ownerset-topright fl">
              <div>
                <p className="ownerset-true-name">真实姓名：<span>{userDetail.realName}</span></p>
                <span className={userDetail.male === 1? "male":"famale"}></span>
              </div>
              <p className="ownerset-class">所属组别：<span>{user.isTeacher === 1 ? "负责人":localStorage.getItem("classify")}</span></p>
              <div className="ownerset-intro">
                <p className="ownerset-introp1">个人简介：</p>
                <p className="ownerset-introp2">{userDetail.selfIntroduce}</p>
              </div>
              <p className='owner-tip'>*暂无修改权限，如需修改请联系管理员</p>
            </div>
          </div>
          <div className="owner-option">
            <form action="" method="post">
              <span className="information-option" onClick={this.setClickHandle.bind(this)}>编辑资料</span>
              <div>
                <label htmlFor="qq">工作QQ：</label>
                <input type="text" className="qq" name="qq" disabled="disabled" value={this.state.qicqNum===null?"无":this.state.qicqNum} onChange={this.changeQQHandle.bind(this)}/>
                <label htmlFor="phone">联系电话：</label>
                <input type="text" className="phone" name="phone" disabled="disabled" value={this.state.userTelephone===null?"无":this.state.userTelephone} onChange={this.changeNumHandle.bind(this)}/>
                <label htmlFor="email">常用邮箱：</label>
                <input type="text" className="email" name="email" disabled="disabled" value={this.state.userEmail===null?"无":this.state.userEmail} onChange={this.changeEmailHandle.bind(this)}/>
                <label htmlFor="school">毕业院校：</label>
                <input type="text" className="school" name="school" disabled="disabled" value={this.state.userSchool===null?"无":this.state.userSchool} onChange={this.changeSchoolHandle.bind(this)}/>
              </div>
              <label htmlFor="skill">擅长领域：</label>
              <textarea name="skill" disabled="disabled" value={this.state.expertiseAreas===null?"无":this.state.expertiseAreas} onChange={this.changeExperHandle.bind(this)}>
              </textarea>
              <button  id="submit" onClick={this.submitHandle.bind(this)}>保存</button>
            </form>
          </div>
        </div>
    }
    return (
      <div className="index-content">
        {ownerSetHtml}
      </div>
    )
  }
}