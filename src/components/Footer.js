import React,{ Component } from 'react';
import {HashRouter as Router,  Link} from "react-router-dom";
import PropTypes from "prop-types"
import "../style/page/Footer.css";

export default class extends Component {
	static contextTypes = {
		router: PropTypes.object
	}
  clearScrollTop(target) {
    var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
    if (scrollT > target) {
      let timer = setInterval(function(){
        var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
        var step = Math.floor(-scrollT/6);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if(scrollT <= target){
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      },20)
    }else if(scrollT === 0){
      let timer = setInterval(function(){
        var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
        var step = Math.floor(300/3*0.7);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if(scrollT >= target){
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      },20)
    }else if(scrollT < target){
      let timer = setInterval(function(){
        var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
        var step = Math.floor(scrollT/6);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if(scrollT >= target){
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      },20)
    }else if(target === scrollT){
      return false;
    }
  }
  goIndexHandle() {
    this.context.router.history.push("/index");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  goGwHandle() {
    this.context.router.history.push("/index");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  goAboutHandle () {
    this.context.router.history.push("/owner/overview");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  goTopHandle () {
    this.clearScrollTop(0);
  }
  render() {
  return (
    <footer>
    <img src={require('../imgs/u282.png')} alt=''/>
    <Router>
      <div>
      <ul className='clearfix'>
        <li onClick={this.goIndexHandle.bind(this)}><Link to="/index">首页</Link></li>
        <li onClick={this.goGwHandle.bind(this)}><a href="http://www.jiaofukeyan.com/" target="_black">交复官网</a></li>
        <li onClick={this.goAboutHandle.bind(this)}><Link to="/owner/overview">关于我们</Link></li>
        <li onClick={this.goTopHandle.bind(this)}><Link to="#">回到顶部</Link></li>
      </ul>
      <p className="ptop">本课堂所有视频均用于内部同学学习交流，请勿对外公开，遵守入职培训中的保密协议。</p>
      <p>我们欢迎各位同学踊跃参与各个组别的轮转，掌握专业的科研技能，为后续深造打下坚实基础。</p>
      </div>
    </Router>
    </footer>
  )
  }
}