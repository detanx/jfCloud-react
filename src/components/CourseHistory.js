import React, { Component } from "react"
import { Link} from "react-router-dom";
import {BASEPATH} from "../constants/number.js"
import {post} from "../fetch/index.js"
import PropTypes from "prop-types"

export default class extends Component {
	static contextTypes = {
		router: PropTypes.object
	}
	
	clickHandle(videoGroupId,videoName,videoId) {
    localStorage.setItem("videoId", videoId);
    localStorage.setItem("videoName", videoName);
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
  }
	
	delHistoryHandle(historyId) {
    //删除历史记录
    let delHistory = async() => {
      try {
        const json = await post(BASEPATH + "/user/delete_history", {historyId:historyId});
        const data = await json.json();
        if(data.status === 0) {
          //console.log(data)
          window.location.reload()
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
    delHistory()
    
  }
	
	formatDateTime(date) { 
    date = new Date(date);//如果date为10位不需要乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    return Y + M + D; 
  }
	
  render() {
    let html = null;
    if(JSON.stringify(this.props.videos) !== "null") {
      html = this.props.videos.map((item, index) => {
          var homebackground = item.video.previewImgAddress.split("//");
          homebackground = homebackground[homebackground.length-1]
          const homeImage = {
            background: `#FFF url(http://www.jiaofukeyan.com/class/${ homebackground }) center no-repeat`,
            backgroundSize:'cover'
          }
          let opendate = this.formatDateTime(item.video.createDate)
          return (<li className="class-course fl" key={index + 7}>
            <Link to="/detail/intro" onClick={this.clickHandle.bind(this, item.video.videoGroupId, item.video.videoName,item.video.videoId)}>
              <div className="class-course-left" style={ homeImage }>
              </div>
            </Link>
            <div className="class-course-right">
              <p>{item.videoName}</p>
              <p className="clearfix">
                <span className="fl">{item.video.videoName}</span>
                <span className="fr">{opendate}</span>
              </p>
              <p className="clearfix">
                <span className="fl">观看未完成</span>
                <span className="fr videoDel" onClick={this.delHistoryHandle.bind(this, item.history.historyId)}></span>
              </p>
            </div>
          </li>)
        })
    }else {
      html = <li>
        <p className="noClass">你还未观看课程!
        </p>
      </li>
    }
    return (
			<ul className="clearfix videoUl">
			{
				html
			}
		</ul>)
  }
}