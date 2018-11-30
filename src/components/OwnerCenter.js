import React,{Component} from "react";
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import CompanyOverview from "../components/ownerCenter/CompanyOverview.js"
import PersonCenter from "../components/ownerCenter/PersonCenter.js"
import TeacherDetail from "../components/ownerCenter/TeacherDetail.js"
import Ownerset from "../components/ownerCenter/Ownerset.js"
import "../style/page/ownerCenter.css"

export default class extends Component {
	render() {
		return (
		  <Router>
      	<div className="center-cover">
          {/*路由匹配写法二*/}
          <Switch>
            <Route exact path="/owner/overview" component={CompanyOverview}/>
            <Route path="/owner/teacher" component={TeacherDetail}/>
            <Route path="/owner/personcenter" component={PersonCenter}/>
            <Route path="/owner/ownerset" component={Ownerset}/>
          </Switch>
        </div>
      </Router>
    )
	}
}
