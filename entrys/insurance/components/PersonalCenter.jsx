/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import '../../../css/insurance/components/Business.css';
import '../../../css/insurance/components/navcontent.css';

import PageNavigator from '../modules/PageNavigator.jsx';
import OrderCenterScore from './OrderCenterScore.jsx';
import SelfBaseInfo from './SelfBaseInfo.jsx';
import RelatedPersonInfo from './RelatedPersonInfo.jsx';
import RelatedCarInfo from './RelatedCarInfo.jsx';
import ServiceOrder from './ServiceOrder.jsx';
import LifeOrder from './LifeOrder.jsx';
import CarOrder from './CarOrder.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore')

var PersonalCenter=React.createClass({

    tabChange:function(tab){
        this.setState({current:tab});
    },

    //切换左侧导航（通过添加类名 产生效果）
    switchNav:function(ob){
        var carInsurance = this.refs.carInsurance; //用引用设置指向右边的箭头
        var lifeInsurance = this.refs.lifeInsurance;
        var service = this.refs.service;
        var score = this.refs.score;
        var baseInfo = this.refs.baseInfo;
        var relatedPerson = this.refs.relatedPerson;
        var carInfo = this.refs.carInfo;

        switch(ob){
            case 'carInsurance':
                $(carInsurance).addClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'lifeInsurance':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).addClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'service':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).addClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'score':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).addClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'baseInfo':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).addClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'relatedInfo':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).addClass('icon-arrow-right');
                $(carInfo).removeClass('icon-arrow-right')
                break;
            case 'carInfo':
                $(carInsurance).removeClass('icon-arrow-right');
                $(lifeInsurance).removeClass('icon-arrow-right');
                $(service).removeClass('icon-arrow-right');
                $(score).removeClass('icon-arrow-right');
                $(baseInfo).removeClass('icon-arrow-right');
                $(relatedPerson).removeClass('icon-arrow-right');
                $(carInfo).addClass('icon-arrow-right')
                break;
        }
    },

    pay:function(){
        var url = this.state.url; //要跳转的url
        var serverAddress = window.document.location.host; //得到服务器主机前缀
        var uri = "http://" + serverAddress + url;
        return (<div > {window.location.assign(uri)}

        </div>)
    },

    getInitialState:function(){ //current 用于控制左侧面板的选择
        return ({current:'carOrder', data:null, scoreTabCurrent:'all',
            pageIndex:0, orderDetail:null, isChange:false});
    },

    render:function(){
        let mainContent=null;
        switch (this.state.current) {
            case 'carOrder':
                mainContent =(
                    <CarOrder />
                );
                break;
            case 'lifeOrder':
                mainContent =(
                    <LifeOrder />
                );
                break;
            case 'serviceOrder':
                mainContent =(
                    <ServiceOrder />
                );
                break;
            case 'score':
                mainContent =(
                    <OrderCenterScore />
                );
                break;
            case 'baseInfo':
                mainContent =(
                    <SelfBaseInfo />
                );
                break;
            case 'relatedInfo':
                mainContent =(
                    <RelatedPersonInfo />
                );
                break;
            case 'carInfo':
                mainContent =(
                    <RelatedCarInfo />
                );
                break;
        }

        return (
            <div className="w1100 margin mar_20">
                <div className="pro_L" style={{float:'left',width:"200px"}}>
                    <div className="menu">
                        <h3 className="font_15">个人订单</h3>
                        <ul>
                            <li onClick={this.tabChange.bind(this,'carOrder')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"carInsurance")}>车险</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="icon-arrow-right" ref="carInsurance"></i>
                                </span>
                            </li>
                            <li onClick={this.tabChange.bind(this,'lifeOrder')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"lifeInsurance")}>寿险</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="lifeInsurance"></i>
                                </span>
                            </li>
                            <li onClick={this.tabChange.bind(this,'serviceOrder')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"service")}>服务</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="service"></i>
                                </span>
                            </li>
                            <li onClick={this.tabChange.bind(this,'score')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"score")}>积分</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="score"></i>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="menu">
                        <h3 className="font_15">个人信息</h3>
                        <ul>
                            <li onClick={this.tabChange.bind(this,'baseInfo')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"baseInfo")}>基本信息</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="baseInfo"></i>
                                </span>
                            </li>
                            <li onClick={this.tabChange.bind(this,'relatedInfo')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"relatedInfo")}>关联人员</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="relatedPerson"></i>
                                </span>
                            </li>
                            <li onClick={this.tabChange.bind(this,'carInfo')}>
                                <a className="nav-text" onClick={this.switchNav.bind(null,"carInfo")}>车辆信息</a>
                                <span aria-hidden="true" className="span-icon">
                                    <i className="" ref="carInfo"></i>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="pro_R fr bg" style={{width:"890px"}}>
                    <div className="pro_bg">
                        <span className="fr pad_L">您的位置： <a>主页</a> &gt; 个人中心</span>
                    </div>

                    <div>
                        {mainContent}
                    </div>
                </div>
            </div>
        );
    }
});
module.exports=PersonalCenter;
