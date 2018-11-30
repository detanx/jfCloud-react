import React, { Component } from "react";
import { Link} from "react-router-dom";
import PropTypes from "prop-types"
import $ from "jquery"
import { post } from "../fetch";
import { BASEPATH } from "../constants/number";

class App extends Component {

  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      classify:[],
      headPicAddress:""
    }
  }
  componentWillMount() {
    let data = JSON.parse(sessionStorage.getItem("userClassify"))
    if(data === null) {
      this.context.router.history.push("/");
    } else {
      let arr = []
      Object.entries(data).forEach(([key, value]) =>
      {
        arr.push(value);
      })
      this.setState({
        classify : arr
      })
    }
  }
  componentDidMount() {
    let _this = this;
    $(".class-lists").on("mouseover",function(){
      $(".class-lists ul").css({"display":"block"})
    })
    $(".lists-cover").on("mouseleave",function(){
      $(".class-lists ul").css({"display":"none"})
    })
    $(".owner-center").on("mouseover",function(){
      $(".owner-center ul").css({"display":"block"})
    })
    $(".owner-center-cover").on("mouseleave",function(){
      $(".owner-center ul").css({"display":"none"})
    })
    const getUserDetail = async () => {
      try {
        const json = await post(BASEPATH + "/user/get_user_detail", {userId:localStorage.getItem("userId")});
        const data = await json.json();
        //console.log(data)
        if(data.status === 0) {
          let newdata = data.data;
          let headPicAddress = newdata.userDetail.headPicAddress
          //console.log(newdata)
          _this.setState({
            headPicAddress:headPicAddress
          })
        }
      }catch (err){
        console.log(err);
      }
    }
    getUserDetail()
  }
  searchClickHandle() {
    let searchKey = this.refs.searchKey.value.trim();
    //console.log(searchKey)
    window.location.href = "/#/search?params=" + encodeURI(searchKey);
    this.refs.searchKey.value = ""
    window.history.go(0)
  }
  loginOutClickHandle() {
    let loginOut = async() => {
      try {
        let json = await post(BASEPATH + "/user/log_out", {userId:localStorage.getItem("userId")});
        let data = await json.json();
        if(data.status === 0) {
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = "/"
        }
        else if(data.status === 10003 || data.status === 10004){
          window.location.href = "/"
        }else {
          console.log(data.msg)
        }
      }catch(err) {
        console.log(err)
      }
    }
    //退出登录
    loginOut()
  }
  
  clickHandle(classify,classifyId,index) {
   // this.props.history.push("/classify");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    localStorage.setItem("classify", classify);
    localStorage.setItem("classifyId", classifyId);
    window.history.go(0)
  }

  render() {
    let classContents = null;
    let homeImage = {};
    if(JSON.stringify(this.state.classify) !== "[]") {
      classContents = this.state.classify.map((items, index) => {
        return <li key={index+0}>
          <Link to="/classify"
            onClick={this.clickHandle.bind(this, items.groupName, items.groupId, index)}>
            {items.groupName}
          </Link>
        </li> 
      })
      let homebackground = this.state.headPicAddress.split("//");
      homebackground = homebackground[homebackground.length-1]
      homeImage = {
        background: `#FFF url(http://www.jiaofukeyan.com/class/${ homebackground }) center /cover no-repeat`
      }
    }
    return (
      <header className="nav-cover clearfix">
        <div className="nav-logo fl">
          <Link to="/index"><div></div></Link>
        </div>
        <ul className="nav fr clearfix">
          <li className="class-lists">
            <div className="lists-cover">
              <ul>
                { classContents }
              </ul>
            </div>
          </li>
          <li className="nav-search-div">
            <div className="nav-search">
              <input type="text" placeholder='输入搜索内容...' ref='searchKey'/>
              <span className='search-span' onClick={this.searchClickHandle.bind(this)}></span>
            </div>
          </li>
          <li className="owner-center" style={homeImage}>
            <div className="owner-center-cover">
              <ul>
                <li><Link to="/owner/personcenter" className="one-center">个人中心</Link></li>
                <li><Link to="/owner/Ownerset" className="one-set">个人设置</Link></li>
                <li><Link to="/"  className="one-out" onClick={this.loginOutClickHandle.bind(this)}>退出</Link></li>
              </ul>
            </div>
          </li>
        </ul> 
      </header>    
    );
  }
}

export default App
