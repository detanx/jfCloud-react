import React, { Component } from "react"
import {BASEPATH} from "../constants/number.js"
import {post} from "../fetch/index.js"
import { Link} from "react-router-dom";
import PropTypes from "prop-types"

export default class extends Component {
	static contextTypes = {
		router: PropTypes.object
	}
	constructor(props) {
    super(props);
    this.state = {
      isStar:true,
    }
  }
	clickHandle(videoGroupId,videoName,videoId) {
    //let _this = this;
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
  render() {
    let html = null;
    if(JSON.stringify(this.props.videos) !== "[]") {
      html = this.props.videos.map((item, index) => {
          var homebackground = item.previewImgAddress.split("//");
          homebackground = homebackground[homebackground.length-1]
          const homeImage = {
            background: `#FFF url(http://www.jiaofukeyan.com/class/${ homebackground }) center no-repeat`,
            backgroundSize:'cover'
          }
          return (<li className="class-course fl" key={index+9}>
            <Link to="/detail/intro"  onClick={this.clickHandle.bind(this, item.videoGroupId, item.videoName,item.videoId)}>
              <div className="class-course-left" style={ homeImage }>
              </div>
            </Link>
            <div className="class-course-right1">
              <p>{item.videoName}</p>
              <p className="clearfix">
                <span className="fl">{item.timeTableLocation === null?"无":item.timeTableLocation}</span>
                <span className="fr stared"></span>
              </p>
            </div>
          </li>)
        })
    }else {
      html = <li>
        <p className="noClass">你还未收藏课程!
        </p>
      </li>
    }
    return (
			<ul className="clearfix">
			{
				html
			}
		</ul>)
  }
}