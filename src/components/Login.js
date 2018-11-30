/**
  * @description 登录组件
  * @param null
  * @export login
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {  post } from "../fetch/index.js";
import {BASEPATH , UNAMERE, PWDRE} from "../constants/number.js"
import "../style/page/login.css"

export default class extends Component {
	static contextTypes = {
		router: PropTypes.object
  }
	constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:""
    }
  }
  //点击登录
  loginHandle() {
    let _this = this;
    let username = _this.state.username
    let password = _this.state.password
    if(username.trim() === '' || UNAMERE.test(username)){
      alert('用户名不能为空或含特殊字符');
      return;
    }
    if(password.trim() === '' || !PWDRE.test(password)){
      alert('密码不能为空、纯数字、纯字母或含特殊字符');
      return;
    }
    let login = async () => {
      try {
        let json = await post(BASEPATH + "/user/log_in", {
          userPassword: password,
          userName: username
        });
        let data = await json.json();
        //console.log(data);
        if(data.status === 0) {
          let newdata = data.data
          localStorage.setItem("belongGroup",newdata.belongGroup)
          localStorage.setItem("userId",newdata.userId)
          localStorage.setItem("userName",newdata.userName)
          //获取用户所属组别
          let getClassifys = async () => {
            try {
              let json = await post(BASEPATH + "/user/get_group",{userId:newdata.userId})
              let data = await json.json();
              if(data.status === 0) {
                let newdata = data.data;
                //console.log(newdata)
                let obj = {}
                for(let i = 0;i < newdata.length;i ++) {
                  obj[i] = newdata[i]
                }
                localStorage.setItem("classify",newdata[0].groupName)
                sessionStorage.setItem("userClassify",JSON.stringify(obj))
                _this.context.router.history.push("/index");
              }
            }catch(err) {
              console.log(err)
            }
          }
          getClassifys()
        }else {
          alert(data.msg)
				}
      } catch (err) {
        console.log(err)
      }
    }
    login()
  }
  
  changeUsernameHandle(e) {
    this.setState({username: e.target.value});
  }
  changePasswordHandle(e) {
    this.setState({password: e.target.value});
  }
  
  render() {
    var homebackground = require('../imgs/wave.png');
    const homeImage = {
      width:"100%",
      background: `#1D86E4 url(${ homebackground }) center bottom no-repeat`
    }
    return (
      <div className="login-cover" style = {homeImage} >
      	<div>
      	  <img className="login-logo" src={require("../imgs/u2.png")} alt="logo"/>
      	  <img className="login-tip" src={require("../imgs/u13.png")} alt="标语"/>
	        <ul className="login-ul">
	          <li><input type="text" className="username" placeholder="用户名" value={this.state.username} onChange={this.changeUsernameHandle.bind(this)}/></li>
	          <li><input type="password" className="password" placeholder="密码" value={this.state.password} onChange={this.changePasswordHandle.bind(this)}/></li>
	          <li><span onClick={this.loginHandle.bind(this)}>登录</span></li>
	        </ul>
	        <p>*本平台所有视频均用于内部同事学习交流，请勿对外公开，遵守入职培训中的保密协议。</p>
      	</div>
      </div>
    )
  }
}