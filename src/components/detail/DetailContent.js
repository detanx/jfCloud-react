import React,{ Component } from 'react';
import '../../style/page/videoPlay.css';

export default class extends Component {
  //视频播放
  playMedia(startTime,endTime){
    if(startTime.indexOf(":") !== -1) {
      let dateArr = startTime.split(":");
      startTime = parseInt(dateArr[0],10) * 60 * 60 + parseInt(dateArr[1],10) * 60 + parseInt(dateArr[2],10)
    }else {
      let dateArr = startTime.split("：");
      startTime = parseInt(dateArr[0],10) * 60 * 60 + parseInt(dateArr[1],10) * 60 + parseInt(dateArr[2],10)
    }
    if(endTime.indexOf(":") !== -1) {
      let dateArr = endTime.split(":");
      endTime = parseInt(dateArr[0],10) * 60 * 60 + parseInt(dateArr[1],10) * 60 + parseInt(dateArr[2],10)
    }else {
      let dateArr = endTime.split("：");
      endTime = parseInt(dateArr[0],10) * 60 * 60 + parseInt(dateArr[1],10) * 60 + parseInt(dateArr[2],10)
    }
    let myVid =document.getElementById("video1");
    if(myVid !== null){
      myVid.currentTime=startTime;
      myVid.play();
      var timer = setInterval(function() {
        startTime ++
        if(startTime >= endTime) {
          clearInterval(timer)
          myVid.currentTime=endTime;
          myVid.pause()
        }
      },1000)
    }
     
  }
	
	render() {
    const audioAddress = sessionStorage.getItem("audioAddress");
    let contentHtml = null;
    if(JSON.stringify(localStorage.getItem('contentIntro')) !== "null") {
      let valueData = JSON.parse(localStorage.getItem('contentIntro')).valueData;
      contentHtml = valueData.map((item, index) => {
        return (
          <p key={item + index} onClick={this.playMedia.bind(this, item.segmentStart, item.segmentEnd)}>
            <span>{item.segmentName}</span>
            <i>{item.segmentStart}</i>
          </p>)
      })
    }
		return (
			<div className="container clearfix">
        <audio src={audioAddress} controls="controls">
          Your browser does not support the audio element.
        </audio>
		    <div className="jiedian">
		    {
		    	contentHtml
		    }
		    </div>
		  </div>
		)
	}
}
