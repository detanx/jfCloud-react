import React, { Component } from "react";
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import Login from "../components/Login.js"
import Index from "../components/Index.js"
import Classify from "../components/Classify.js"
import Detail from "../components/Detail.js"
import Search from "../components/ownerCenter/Search.js"
import CompanyOverview from "../components/ownerCenter/CompanyOverview.js"
import PersonCenter from "../components/ownerCenter/PersonCenter.js"
import TeacherDetail from "../components/ownerCenter/TeacherDetail.js"
import Ownerset from "../components/ownerCenter/Ownerset.js"
import Header from "../components/Header.js"
import Footer from "../components/Footer.js"
import "../style/App.css"
import "../style/style.css"
import "../style/page/ownerCenter.css"

class App extends Component {
  render() {
    return (
    	<div>
    		<Router>
	        <Switch>
	          <Route exact path="/" component= {Login}/>
          		<div className="App">
    						<div className="App-content">
    							<div>
    								<Header />
    								{/*路由匹配*/}
    								<Switch>
    									<Route exact path="/index" component={Index}/>
    									<Route path="/classify" component={Classify}/>
    									<Route path="/detail" component={Detail}/>
    									<Route path="/search" component={Search}/>
    									<div className="center-cover">
      									<Route path="/owner/overview" component={CompanyOverview}/>
                        <Route path="/owner/teacher" component={TeacherDetail}/>
                        <Route path="/owner/personcenter" component={PersonCenter}/>
                        <Route path="/owner/ownerset" component={Ownerset}/>
                      </div>
    								</Switch>
    							</div>
    						</div>
    						<Footer setprops={this.props}/>
            	</div>
					</Switch>
				</Router>
    	</div>  
    );
  }
}

export default App
