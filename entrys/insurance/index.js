/**
 * Created by outstudio on 16/5/6.
 */
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute,hashHistory } from 'react-router';
import App from './modules/App.jsx';
import MainPage from './components/MainPage.jsx';
import HomePage from './components/HomePage.jsx';
import MainSection from './modules/MainSection.jsx';
import Login from './modules/Login.jsx';
import AdminConfig from './modules/AdminConfig.jsx';
import lifeInsuranceBuyPage from './components/LifeInsuranceBuyPage';
import carInsuranceBuyPage from './components/CarInsuranceBuyPage';

render((
    <Router history={hashHistory}>
        <Route path={window.App.getAppRoute()} component={App}>
            <IndexRoute component={HomePage}/>
            <Route path={window.App.getAppRoute()+"/"} component={HomePage}/>
            <Route path={window.App.getAppRoute()+"/mainPage"} component={MainPage}/>
            <Route path={window.App.getAppRoute()+"/login"} component={Login}/>
            <Route path={window.App.getAppRoute()+"/adminConfig"} component={AdminConfig}/>
            <Route path={window.App.getAppRoute()+"/productCenter"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/news"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/personalCenter"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/consultation"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/aboutUs"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/personInfo"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/lifeInsurance"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/carInsurance"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/lifeDetail"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/newConsultation"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/admin"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/lifeInsuranceBuyPage"} component={lifeInsuranceBuyPage}/>
            <Route path={window.App.getAppRoute()+"/carInsuranceBuyPage"} component={carInsuranceBuyPage}/>
            <Route path={window.App.getAppRoute()+"/adminConfig"} component={MainSection}/>
        </Route>
    </Router>
), document.getElementById('root'))
