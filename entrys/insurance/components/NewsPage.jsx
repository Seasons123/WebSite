import React from 'react';
import {render} from 'react-dom';
var Panel = require('../../../components/panel/Panel.jsx');
var Li = require('../../../components/basic/Li.jsx');
import Hide from '../../../components/basic/Hide.jsx';
import TopNav from '../modules/TopNav.jsx';

import '../../../css/insurance/components/newsPage.css';
var ProxyQ = require('../../../components/proxy/ProxyQ');

var NewsPage=React.createClass({
    returnCb:function () {
        this.setState({hiddenInfo: null, display:'list'});
        //$(this.refs.contentDiv).slideDown();
    },

    clickCb:function (evt) {
        var target = evt.target;
        var index = $(target).attr("data-index");
        if (index !== undefined && index !== null) {
            var info = this.state.contentMapping[index];
            if (info !== undefined && info !== null) {
                var ob = new Object();
                ob.comp = "panel";
                //TODO:change the structor of ob
                var data = [
                    {row: ['title=>标题|span|' + info.title]},
                    {row: ['content=>内容|span|' + info.content]},
                    {row: ['author=>作者|span|' + info.author]},
                    {row: ['返回|return|']}
                ];
                ob.data = data;
                this.setState({hiddenInfo: ob, display:'content'});
                //$(this.refs.contentDiv).slideUp();
            }
        }
    },

    queryCb:function (evt) {
        var target = evt.target;
        var query = $(target).attr("data-query");
        if (Object.prototype.toString.call(query) == '[object String]')
            query = eval('(' + query + ')');
        for (var field in query) {
            console.log(field + ":" + query[field]);
        }
        var comp = $(target).attr("data-comp");
        if (query !== undefined && query !== null) {
            var ob = new Object();
            ob.comp = comp;
            //TODO:change the structor of ob
            ob.query = query;
            ob.auto = true;
            this.setState({hiddenInfo: ob, display:'content'});
            //$(this.refs.contentDiv).slideUp();
        }

    },

    fetch:function(){

        var url = "/func/allow/getNewsList";
        //if(this.props.query.url!=undefined && this.props.query.url!=null){
        //    url = this.props.query.url;
        //}
        //if(this.props.query.params!=undefined && this.props.query.params!=null){
        //    params=this.props.query.params;
        //}

        ProxyQ.query(
            null,
            url,
            params,
            null,
            function(response){
                var data;
                var ob=new Object();
                if(Object.prototype.toString.call(response)!='[object Array]')
                    if(response.data!==undefined&&response.data!==null)
                        if(Object.prototype.toString.call(response.data)=='[object Array]')
                            data=response.data;
                        else
                            data=response;
                ob.data$initialed=true;
                if(data!==undefined&&data!==null)
                    ob.data=data;
                this.setState(ob);
            }.bind(this)
        )

    },

    getInitialState:function(){
        var data$initialed;
        var data;
        var hiddenInfo;
        var auto =true;
        var display='list';
        var addNav=false;
        if(this.props.data!==undefined&&this.props.data!==null) {
            data = this.props.data;
            data$initialed=true;
        }

        if(this.props.hiddenInfo!==undefined&&this.props.hiddenInfo!==null) {
            hiddenInfo = this.props.hiddenInfo;
        }

        if(this.props.auto===true||this.props.auto==="true"){
            auto=true;
        }

        if(this.props.display!==undefined&&this.props.display!==null){
            display=this.props.display;;
        }

        var contentMapping = new Object();
        if(this.props.contentMapping!==undefined && this.props.contentMapping!==null){
            contentMapping=this.props.contentMapping;
        }

        if(this.props.addNav!==undefined && this.props.addNav!==null){
            addNav=this.props.addNav;
        }

        return ({data: data, data$initialed: data$initialed, auto: auto,hiddenInfo: hiddenInfo, contentMapping: contentMapping, display:display, addNav:addNav});
    },

    render:function () {
        if (this.state.data$initialed !== true && (this.props.data == null || this.props.data == undefined)) {
            if (this.state.auto == true)
                this.fetch();
            return (<div></div>)

        } else {
            var uls;
            if (this.state.data !== null && this.state.data !== undefined) {
                uls = new Array();
                //TODO:划分一级和二级新闻
                var k = 0;
                var state = this.state;
                var clickCb = this.clickCb;
                var queryCb = this.queryCb;
                this.state.data.map(function (item, i) {
                    var groupNews = item;

                    if (item.query !== undefined && item.query !== null) {
                        uls.push(<li key={k++} className="main">
                            <span>{groupNews.newsTypeName}</span>
                            <span onClick={queryCb} className="more" data-query={JSON.stringify(item.query)}
                                  data-comp={item.comp!==undefined&&item.comp!==null?item.comp:null}>more</span>
                        </li>);
                    }
                    else
                        uls.push(<li key={k++} className="main"><span>{groupNews.newsTypeName}</span></li>);
                    if (groupNews.newsList !== undefined && groupNews.newsList !== null) {
                        groupNews.newsList.map(function (news, j) {
                            var content = news.content;
                            var author = news.author;
                            var title = news.title;
                            var date = news.newsTimeStr;
                            state.contentMapping[k] = {
                                content: content,
                                author : author,
                                title  : title
                            }
                            var t = k;
                            var cb = clickCb;
                            uls.push(
                                <li key={k} className="vice">
                                    <span className="title" data-index={k++} onClick={cb}>{title}</span>
                                    <span className='date'>{date}</span>
                                </li>);
                        });
                    }
                });
            }

            var hide;
            if (this.state.hiddenInfo !== undefined && this.state.hiddenInfo !== null) {
                if (this.state.hiddenInfo.comp !== undefined && this.state.hiddenInfo.comp !== null) {
                    var hide$c;
                    switch (this.state.hiddenInfo.comp) {
                        case 'panel':
                            hide$c = <Panel
                                padding="0px"
                                paddingLeft="0px"
                                autoComplete={true}
                                data={this.state.hiddenInfo.data}
                                returnCb={this.returnCb}
                                />;
                            break;
                        case 'Li':
                            hide$c = <Li
                                auto={true}
                                query={this.state.hiddenInfo.query}
                                returnCb={this.returnCb}
                                pagination={true}
                                />;
                            break;
                        default:
                            break;
                    }
                    hide =
                        <Hide>
                            {hide$c}
                        </Hide>

                }
            }

            var mainContent=null;
            if(this.state.display!==undefined && this.state.display!==null && this.state.display=="content"){
                mainContent=
                    <div ref="hideDiv">
                        {hide}
                    </div>
            }
            if(this.state.display!==undefined && this.state.display!==null && this.state.display=="list"){
                mainContent=
                    <div ref="contentDiv">
                        <ul className="list">
                            {uls}
                        </ul>
                    </div>
            }


            return (
                <div>

                    {this.state.addNav ?
                        <div style={{width:'100%'}}>
                            <TopNav />
                        </div> : null}


                    <div className="margin w1100 mar_20">
                        <div className="pro_R fr bg" style={{width:'1100px'}}>
                            <div className="pro_bg">
                                <span className="fr pad_L">您的位置：<a>主页</a> &gt; 新闻资讯</span>
                            </div>

                            <div className="section clearfix" ref="news">
                                {mainContent}
                                <div ref="pagination">
                                    <li key={0} className="active">
                                        <a href="javascript:void(0);">{}</a>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
});
module.exports = NewsPage;