import React from 'react';
import {render} from 'react-dom';

import Nav from '../modules/TopNav.jsx';
import Footer from '../modules/Footer.jsx';
import MainPage from '../components/MainPage.jsx';
import Login from '../modules/Login.jsx';
import LifeInsurance from '../components/LifeInsurance.jsx';
import CarInsurance from '../components/CarInsurance.jsx';
import Consultation from '../components/Consultation.jsx';
import NewConsultation from '../components/NewConsultation';
import LifeInsuranceBuyPage from '../components/LifeInsuranceBuyPage';
import PersonalCenter from '../components/PersonalCenter.jsx';
import News from '../components/NewsPage.jsx';
import AboutUs from '../components/AboutUs.jsx';
import Admin from '../components/admin.jsx';
import App from '../modules/App.jsx';

var config=require('../../../config.json');
import '../../../css/insurance/components/mainSection.css';
import '../../../css/insurance/components/css.css';
var SyncActions = require('../../../components/flux/actions/SyncActions');


var MainSection = React.createClass({
    iframeLoad:function(evt)
    {
        var target=evt.target;
        //$("#mainFrame").context.documentElement.scrollHeight
        var height=null;
        height=target.contentDocument.body.scrollHeight;
        target.height=height;
            //height=document.body.scrollHeight;
    },

    getInitialState: function () {
        var route = new Array();
        route.push(undefined);
        return ({route: route});
    },

    render:function(){
        var path=this.props.route.path;
        var ctrl;
        var breadcrumb;
        var label;
        var data=this.props.route.data;
        if(path!==undefined&&path!==null)
        {
            var route = this.state.route;
            if (route.length != 1)
                route.splice(0, 1);
            route.push(path);

            switch(path)
            {
                case window.App.getAppRoute() + "/":
                    ctrl = <App></App>;
                    label = "首页";
                    break;
                case window.App.getAppRoute() + "/login":
                    ctrl = <Login></Login>;
                    label = "登录";
                    break;
                case window.App.getAppRoute() + "/mainPage":
                    ctrl = <MainPage></MainPage>;
                    label = "主页";
                    break;
                case window.App.getAppRoute() + "/news":
                    //ctrl = <News query={{
                    //                         url:"/bsuims/reactPageDataRequest.do",
                    //                        params:{
                    //                            reactPageName:"groupNewsReactPage",
                    //                            reactActionName:"listTypeNewsUseReact"
                    //                        }
                    //                     }}
                    //             auto={true}/>;
                    //label = "新闻查询业务";
                    //break;
                    ctrl = <News></News>;
                    label = "新闻资讯";
                    break;
                case window.App.getAppRoute() + "/personalCenter":
                    ctrl = <PersonalCenter></PersonalCenter>;
                    label = "个人中心";
                    break;
                case window.App.getAppRoute() + "/consultation":
                    ctrl = <Consultation></Consultation>;
                    label = "业务咨询";
                    break;
                case window.App.getAppRoute() + "/lifeInsurance":
                    ctrl = <LifeInsurance></LifeInsurance>;
                    label = "寿险";
                    break;
                case window.App.getAppRoute() + "/carInsurance":
                    ctrl = <CarInsurance></CarInsurance>;
                    label = "车险";
                    break;
                case window.App.getAppRoute() + "/newConsultation":
                    ctrl = <NewConsultation></NewConsultation>;
                    label = "业务咨询";
                    break;
                case window.App.getAppRoute() + "/lifeInsuranceBuyPage":
                    ctrl = <LifeInsuranceBuyPage></LifeInsuranceBuyPage>;
                    label = "寿险购买";
                    break;
                case window.App.getAppRoute() + "/aboutUs":
                    ctrl = <AboutUs></AboutUs>;
                    label = "关于我们";
                    break;
                case window.App.getAppRoute() + "/admin":
                    ctrl = <Admin></Admin>;
                    label = "关于我们";
                    break;

                default:
                    var reg=/.*\.do.*[\.do|\.jsp]?.*/;

                    var re=reg.exec(path);
                    console.log('data===' + data);
                    console.log('origin path==='+path);
                    var proxyServer="";
                    if(window.App.getModel()=="debug")
                    {
                        if(window.App.getAppRoute()=="")
                        {
                            console.log('......');
                            var proxy=config.devServer.proxy;
                            for (var field in proxy)
                            {
                                var re = /\/(.*?)\//;
                                proxyServer= re.exec(field)[1];
                                break;
                            }
                        }
                        else if(window.App.getAppRoute().indexOf("/")!=-1)
                        {
                            var re = /^(\/.*?)\//;
                            proxyServer= re.exec(window.App.getAppRoute())[1];
                        }
                    }else{
                        proxyServer='';
                    }


                    if(re!==undefined&&re!==null)
                    {
                        //TODO:iframe components render
                        path=path.replace(window.App.getAppRoute(),"");
                        console.log('iframe in mainsection,path=' + path);
                        ctrl=
                            <iframe style={{width:"100%",position:"relative"}} id="mainFrame"
                                     frameBorder="0" scrolling="no" src={proxyServer+path+(data!=null&&data!==undefined?data:"")} onLoad={this.iframeLoad}
                                />

                    }else{

                    }
                    break;
            }

            var paths=path.split("/");
            var spans=new Array();
            if(paths[0]==""&&paths[1]=="")
            {
                spans.push(<span className="separator" key={0}>/</span>);
            }else{
                var k=0;
                paths.map(function(item,i) {
                    if(i==0)
                        spans.push(<span className="separator" key={k++}></span>);
                    else
                    {
                        spans.push(<span className="path-segment" key={k++}>{item}</span>);
                        if(i!==paths.length-1)
                            spans.push(<span className="separator" key={k++}>/</span>);
                    }

                });
            }
            breadcrumb =
                <div className="crumb_box">
                    <div className="crumb_title">
                        <span className="crumb_title_content">{spans}</span>

                        <div className="crumb_detail">{label}</div>
                    </div>
                </div>
        }

        //remove breadcrumb by zyy,yeah i am so native

        return (
            <div style={{margin: "0px auto 0 auto",width:"100%"}} className="baba">
                <Nav />
                <div>
                    <div ref="mainSection" className="mainSection" style={{display:"none",marginLeft:"auto",marginRight:"auto",marginBottom:"auto"}}>
                        {ctrl}
                    </div>
                </div>
                <Footer />
            </div>
        );


    },
    componentDidMount: function() {
        //TodoStore.addChangeListener(this._onChange);
        $(this.refs["mainSection"]).slideDown(300);
    },
    componentWillUnmount: function() {
        //TODO:emit change
        $(this.refs["mainSection"]).slideUp(300);
        //TodoStore.removeChangeListener(this._onChange);
    }
});
module.exports = MainSection;