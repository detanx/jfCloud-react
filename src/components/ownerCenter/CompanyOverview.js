import React,{Component} from "react";
import $ from "jquery"
import Pdfshow from "./Pdfshow.js"
import {post} from "../../fetch/index.js";
import { BASEPATH } from "../../constants/number.js";
import "../../style/page/CompanyOverview.css"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents:[],
      pdfArray:[]
    }
  }
  
  clickHandle() { 
    $(".nav-three li").click(function() {
      $(".nav-three li").eq($(this).index()).addClass("activeThree").siblings().removeClass('activeThree');
      $(".content-three > div.pdfCover").hide().eq($(this).index()).show();
    });
  }
  componentDidMount() {
    $(".nav-three li").eq(0).addClass("activeThree")
    let _this = this;
    let getContents = async() => {
      try {
        let json = await post(BASEPATH + "/user/get_all_announcement")
        let data = await json.json();
        if(data.status === 0) {
          let newdata = data.data;
          //console.log(newdata)
          let arr = [];
          for(let i = 0;i < newdata.length;i ++) {
            for(let j = 0; j < newdata.length;j ++) {
              if(newdata[j].containerId === i) {
                let src = newdata[j].announcementAddress.split("//");
                src = "http://www.jiaofukeyan.com/class/" + src[src.length-1]
                arr.push(src)
              }
            }
          }
          _this.setState({
            pdfArray:arr
          })
        }
      }catch(err) {
        console.log(err)
      }
    } 
    //获取目录列表
    getContents()
  }
	render() {
	  let classContent = null;
    if(JSON.stringify(this.state.pdfArray) !== "[]"){
      classContent = <Pdfshow pdflists={this.state.pdfArray}/>
    }
		return (
      <div className="index-content clearfix">
        <div className="nav-three fl">
          <ul>
            <li onClick={this.clickHandle.bind(this)}>实习生荣誉榜
            </li>
            <li onClick={this.clickHandle.bind(this)}>实习生工作手册
            </li>
            <li onClick={this.clickHandle.bind(this)}>公司人员架构
            </li>
          </ul> 
        </div>
        {classContent}
      </div>
    )
	}
}
