import React,{ Component } from "react";
import SearchVideo from "../SearchVideo.js";
import { post } from "../../fetch/index";
import {BASEPATH} from "../../constants/number.js"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos:[],
      keyword:"",
      videoNumber:0,
      teacher:[]
    }
  }
  componentDidMount() {
    let _this = this;
    let  postdata = {}
    if(window.location.href.split("?").length > 1) {
      let keyword = decodeURI(window.location.href.split("?")[1].split("=")[1])
      postdata.keyWord = keyword;
      postdata.userId = localStorage.getItem("userId")
      this.setState({
        keyword:keyword
      })
      //获取用户关键字查询的视频
      let getSearchVideo = async() => {
        try{
          let json = await post(BASEPATH + "/user/find_video_keyWord", postdata)
          let data = await json.json()
          if(data.status === 0) {
            let newdata = data.data;
            if(newdata !== null) {
              console.log(newdata)
              let videos=[],teacher=[];
              let len = newdata.length
              for(let i = 0;i < len;i ++) {
                let pushdata = newdata[i].video
                pushdata.groupName = newdata[i].group.groupName
                videos.push(pushdata)
                teacher.push(newdata[i].user)
              }
              _this.setState({
                videos:videos,
                videoNumber:len,
                teacher:teacher,
              })
            }
          }
        }catch (err){
          console.log(err)
        }
      }
      getSearchVideo()
    }
  }

  render() {
    let resultHtml = null;
    if(this.state.videoNumber === 0) {
      resultHtml = <p className="search-tip">没有找到关于"
          <span>{this.state.keyword}</span>
          "的结果</p>
    }else {
      resultHtml = <p className="search-tip">找到
          <span>{this.state.videoNumber}</span>
           个关于"
          <span>{this.state.keyword}</span>
          "的结果</p>
    }
    return (
      <div className="detail-cover">
        <div className="index-content searchHeight">
          <div className="index-video">
            {resultHtml}
            <SearchVideo videos={this.state.videos} teacher={this.state.teacher}/>
          </div>
        </div>>
      </div>
    )
  }
}