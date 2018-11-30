import React,{ Component } from "react";
import "../../javascripts/bootstrap-3.3.7/css/bootstrap.min.css"
import $ from 'jquery'
import "../../javascripts/js/jquery.media.js"

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    $(function() {  
      $('a.media').media({width:800, height:600});  
      $('a.mediase').media({width:800, height:600});  
    });
  }
  
  reloadClickHandle(indexs) {
    window.history.go(0)
  }
  
  render() {
    return(
      <div className="content-three fl">
          <div className="pdfCover">
            <div className="panel panel-primary">
              <div className="panel-heading" align="center" onClick={this.reloadClickHandle.bind(this)}>
                <h2>点击预览pdf文件</h2>
              </div>
              <div className="panel-body">
                <a className="media" href={this.props.pdflists[0]}></a>  
              </div>
            </div>
          </div>
          <div className="pdfCover">
            <div className="panel panel-primary">
              <div className="panel-heading" align="center" onClick={this.reloadClickHandle.bind(this)}>
                <h2>点击预览pdf文件</h2>
              </div>
              <div className="panel-body">
                <a className="media" href={this.props.pdflists[1]}></a>  
              </div>
            </div>
          </div>
          <div className="pdfCover">
            <div className="panel panel-primary">
              <div className="panel-heading" align="center" onClick={this.reloadClickHandle.bind(this)}>
                <h2>点击预览pdf文件</h2>
              </div>
              <div className="panel-body">
                <a className="media" href={this.props.pdflists[2]}></a>  
              </div>
            </div>
          </div>
        </div>
    ) 
  }
}