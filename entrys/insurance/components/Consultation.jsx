import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

import '../../../css/insurance/components/Consultation.css';
import ConsultationDetails from '../components/ConsultationDetails.jsx';
import Calendar from '../../../components/basic/Calendar.jsx';
import PageNavigator from '../modules/PageNavigator.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore');

var today=new Date().toLocaleDateString().replace("/", "-").replace("/", "-");

var Consultation = React.createClass({
    Branch:function(branch){
        this.setState({nav: branch});
        this.initialData();
        this.getAllQuestion();

    },
    click:function(ob){ //保存跳转的页面信息
        SyncStore.setRouter(ob);
    },
    getAllQuestion:function(){
        var url="/func/insurance/getProblemList";

        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                this.setState({data:ob.data});

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getQuestionContent:function(item,title,personId,date,comments){
        var url="/func/insurance/getProblemContent";
        var params={
            themeId:item
        };

        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                if(ob.data=="fail"){
                    alert("该问题暂无解答！");
                }else
                {
                    this.setState({content: ob.data});
                    this.state.nav = 'consultationDetails';
                    this.initialData();
                }
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
        this.state.title=title;
        this.state.personId=personId;
        this.state.date=date;
        this.state.comments=comments;
    },
    getMyQuestion:function(){
        var url="/func/insurance/getMyProblem";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                this.setState({data:ob.data});
                this.state.nav=undefined;

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getLimitQuestion:function(){
        var url="/func/insurance/getLimitProblem";
        var params={
            startDate:this.state.startData,
            endDate:this.state.endData,
            title:this.state.value
        };

        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data});
                this.state.nav=undefined;

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(10,capacity,pageIndex,function(ob){
                slices=data.slice(ob.begin,ob.end);
            }
        );
        return slices;
    },
    previousCb:function (index,isChange) { //向前跳页
        this.setState({pageIndex:index,isChange:isChange});
    },

    pageCb:function(index,isChange) { //进入指定页的列表
        this.setState({pageIndex:index,isChange:isChange});
    },
    nextCb:function(index,isChange){ //向后跳页,isChange为true
        this.setState({pageIndex:index,isChange:isChange});
    },
    onSaveInput:function(event){
        this.setState({value: event.target.value});
    },
    onChildChanged: function (type,date) {
        switch (type){
            case 'startDate':
                this.setState({
                    startData: date
                });
                break;
            case 'endDate':
                this.setState({
                    endData: date
                });
                break;
        }
    },
    setDataTg:function(){
        this.state.dataTg=this.state.dataTg+1;
        if(this.state.dataTg%2==0){
            $('#lab5').attr('data-tg','只看自己');
            this.getMyQuestion();
        }else{
            $('#lab5').attr('data-tg','全部');
            this.getLimitQuestion();
        }

    },
    getInitialState: function() {
        return {
            checked: !!this.props.checked,
            current: 'carOrder',
            startData:null,
            endDate:null,
            pageIndex:0,
            isChange:false,
            value:null,
            session:SyncStore.getNote(),
            dataTg:1
        }
    },
    initialData:function(){
        this.getAllQuestion();
    },
    render:function () {
        var container=null;
        var html=this.state.nav;
        if(this.state.data!==undefined&&this.state.data!==null) {
            if(this.state.nav!='consultationDetails') {
                var tem = this.state.data;
                var data = this.paginationData(tem, this.state.pageIndex);
                var trs = [];
                var ref=this;
                data.map(function (item, i) {
                    trs.push(
                        <ul className="question-detail-item-list" key={i} >
                            <li className="item clearfix" >
                                <div className="what">
                                    {item.title}
                                </div>
                                <div className="who">
                                    {item.perName}
                                </div>
                                <div className="when">
                                    {item.createTime.month+1 + "月" + item.createTime.date + "日"
                                    + item.createTime.hours + ":" + item.createTime.minutes}
                                </div>
                                <div className="details"  onClick={ref.getQuestionContent.bind(null,item.themeId,item.title,item.personId,item.createTime,item.readCount)}>
                                    <a > 详情 </a>
                                </div>
                            </li>
                        </ul>
                    )
                });
            }
            switch (this.state.nav) {
                case undefined:
                    container =
                        <div>
                            <div className="question-detail" >
                                <ul className="question-detail-masthead clearfix">
                                    <li className="what">主题/问题</li>
                                    <li className="who">提问者</li>
                                    <li className="when">日期</li>
                                    <li className="details">详情</li>
                                </ul>
                                <div>
                                    {trs}
                                </div>
                                <PageNavigator
                                    capacity={this.state.data.length}
                                    pageIndex={this.state.pageIndex}
                                    pageBegin={1}
                                    previousCb={this.previousCb}
                                    pageCb={this.pageCb}
                                    nextCb={this.nextCb}
                                    isChange={this.state.isChange}
                                    paginate={Page}
                                />
                            </div>
                        </div>

                    break;
                case 'consultationDetails':
                    container = <ConsultationDetails data={this.state.content} title={this.state.title} personId={this.state.personId} date={this.state.date} comments={this.state.comments} Branch={this.Branch}/>;

                    break;
            }
        }else{

            this.initialData();
        }
        var  navbar;
            navbar =
                <div className='questionSearchContainer'>
                    <div className='search-area '>
                        <form className='clearfix' method="get" action="#">
                            <div style={{marginTop:'15px'}}>
                                <div className='questionText'>
                                            <span >
                                                 <input className='search-term-question' type="text"
                                                        placeholder="在此输入您的问题进行搜索！"
                                                        onChange={this.onSaveInput}/>
                                            </span>
                                </div>
                                <div className='time'>
                                    <div className='row-50'>
                                                <span style={{float:'left',marginTop:'3px'}}>
                                                     <h2>时间：</h2>
                                                </span>

                                        <div  >
                                                    <span>
                                                       <Calendar data={today} ctrlName={'consultation'}
                                                                 callbackParent={this.onChildChanged.bind(null,'startDate')}/>
                                                    </span>
                                        </div>
                                    </div>
                                    <div className='row-50'>
                                                <span style={{float:'left',marginLeft:'-75px',marginTop:'3px'}}>
                                                        <h2>起——至</h2>
                                                </span>

                                        <div style={{marginLeft:'-10px'}}>
                                                    <span >
                                                        <Calendar data={today} ctrlName={'consultation'}
                                                                  callbackParent={this.onChildChanged.bind(null,'endDate')}/>
                                                    </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="searchButton">
                                            <span >
                                                <input type='button' className="search-btn" onClick={this.getLimitQuestion} value="搜索"/>
                                            </span>
                                </div>
                                <div className="search-newButton">
                                            <span >
                                                {SyncStore.getNote() ?
                                                    <Link to={window.App.getAppRoute() + "/newConsultation"}>
                                                        <input type='button' className="search-new"  value="创建新问题"/>
                                                    </Link>:
                                                    <Link to={window.App.getAppRoute() + "/login"}>
                                                        <input type='button' className="search-new" onClick={this.click.bind(null,'newConsultation')} value="创建新问题"/>
                                                    </Link>}
                                            </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>;
        return(
            <div>
                <div className="w1008 margin mar_20 ">
                    <div className="pro_L " style={{float:'left'}}>

                    </div>
                    <div className="pro_R fr bg" style={{width:'1035px'}}>
                        <div className="pro_bg">
                            <span className="fr pad_L">您的位置： <a >主页</a> &gt; 问题咨询 &gt;</span>
                        </div>
                        <div className="article">
                            <div className="visual">
                                <h3 className="font_15 text">问题搜索</h3>
                                <div className='questionSearchContainer'>
                                    {navbar}
                                    <div className="question-area" >
                                        {html == undefined ?
                                            <div>
                                                <h3 className="font_15 text">问题列表</h3>
                                                {SyncStore.getNote() ?
                                                    <div className="tglLabel">
                                        <span className='tg-list-item'>
                                            <input className='tgl tgl-flip' id='cb5' type='checkbox'/>
                                            <label id='lab5' style={{marginLeft: '842px'}} onClick={this.setDataTg} className='tgl-btn' data-tg='全部'data-tg-off='全部' data-tg-on='只看自己' htmlFor='cb5'></label>
                                        </span>
                                                    </div>:null}
                                            </div>
                                            :
                                            <h3 className="font_15 text">问题详情</h3>
                                        }
                                        {container}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = Consultation;