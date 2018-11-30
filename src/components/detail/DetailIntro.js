import React,{ Component } from "react";
import "../../javascripts/bootstrap-3.3.7/css/bootstrap.min.css"
import $ from 'jquery'
import "../../javascripts/js/jquery.media.js"

export default class extends Component {
  componentDidMount() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $(function() {  
      $('a.media').media({width:800, height:600});  
      $('a.mediase').media({width:800, height:600});  
    });  
  }
  clickHandle() {
    $(".panel-heading h2").on("click",function() {
      window.location.reload()
    })
  }
  render() {
    const pdfAddress = sessionStorage.getItem("pdfAddress");
    return(
      <div className="panel panel-primary">
        <div className="panel-heading" align="center" onClick={this.clickHandle.bind(this)}>
          <h2>点击预览pdf文件</h2>
        </div>
        <div className="panel-body">
          <a className="media" href={pdfAddress}></a>  
        </div>
      </div>
    ) 
  }
}