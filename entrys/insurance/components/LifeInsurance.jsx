import React from 'react';
import {render} from 'react-dom';

import '../../../css/insurance/components/productIntroduction.css';
import Detail from '../components/LifeInsuranceDetail.jsx';
import PageNavigator from '../modules/PageNavigator.jsx';

var Page = require('../modules/Page');
var ProxyQ = require('../../../components/proxy/ProxyQ');

var LifeInsurance = React.createClass({
    initialData:function(){
        this.getCompanies();
        this.getInsurancesList();
    },
    getInitialState: function() {
        return {
            InputCompany: null,
            InputCompanyType: null,
            InputStarLevel: null,
            InputIncrement: null,
            pageIndex: 0,
            isChange: false,
        }

    },
    getCompanies:function(){
        var url="/func/insurance/getInsuranceCompany";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                this.setState({company:ob.data});

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getInsurancesList:function(){
        var url="/func/insurance/getInsuranceLifeProductList";

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
    getInfoBySlide:function(type){
        var store=[];
        switch (type){
            case 'inputCompany':
                $("#inputCompany input:checkbox:checked").each(function (index, domEle) {
                    var a=$(domEle).val();
                    store.push(a);
                });
                this.state.InputCompany=store;
                break;
            case 'inputCompanyType':
                $("#inputCompanyType input:checkbox:checked").each(function (index, domEle) {
                    var a=$(domEle).val();

                    store.push(a);
                });
                this.state.InputCompanyType=store;
                break;
            case 'inputStarLevel':
                $("#inputStarLevel input:checkbox:checked").each(function (index, domEle) {
                    var a=$(domEle).val();
                    store.push(a);
                });
                this.state.InputStarLevel=store;
                break;
            case 'inputIncrement':
                var a=$("input[name='hideRegionId']:checked").val();
                this.state.InputIncrement=a;
                break;
        }
        var InputCompany=null;
        var InputCompanyType=null;
        var InputStarLevel=null;
        if(this.state.InputCompany!==null&&this.state.InputCompany.length!==0){
            InputCompany= this.state.InputCompany.join(",");
        }
        if(this.state.InputCompanyType!==null&&this.state.InputCompanyType.length!==0){
            InputCompanyType= this.state.InputCompanyType.join(",");
        }
        if(this.state.InputStarLevel!==null&&this.state.InputStarLevel.length!==0){
            InputStarLevel= this.state.InputStarLevel.join(",");
        }
        var url="/func/insurance/getInsuranceLifeProductListBySlide";
        var params={
            InputCompany:InputCompany,
            InputCompanyType:InputCompanyType,
            InputStarLevel:InputStarLevel,
            InputIncrement:this.state.InputIncrement
        };

        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                    this.setState({data:ob.data});
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    onSaveInput:function(event){
        this.setState({value: event.target.value});
    },
    getSelectCompany:function(){
        var selected=$('#company option:selected').val();
        this.state.selectCompanyId=selected;
    },
    getSelectLifeInsuranceType:function(){
        var selected=$('#lifeInsuranceType option:selected').val();
        this.state.selectLifeInsuranceType=selected;
    },
    getLimitInsurancesList:function(){
        var url="/func/insurance/getLimitInsuranceLifeProductList";
        var params={
            title:this.state.value,
            company:this.state.selectCompanyId,
            insuranceType:this.state.selectLifeInsuranceType
        };

        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data});

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(8,capacity,pageIndex,function(ob){
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
    Branch:function(branch){
        this.setState({nav: branch});

    },
    goToOthers:function(branch,num,name,star,briefly,quota){
        if(num!==null){
            this.state.propProductId=num;
            this.state.propProductName=name;
            this.state.propBriefly=briefly;
            this.state.propStar=star;
            this.state.propQuota=quota;
        }
        this.setState({
            nav: branch,
        });
    },
    render: function () {
        var container = null;
        var len=null;
        if (this.state.company !== undefined && this.state.company !== null&&this.state.company.length!=0
            && this.state.data !== undefined && this.state.data !== null&&this.state.data.length!=0) {
            var trs = [];
            var company = this.state.company;
            company.map(function (item, i) {
                trs.push(
                    <option value={item.companyId} key={"company" + i}>{item.companyName}</option>
                )
            });
            var lrs = [];
            var test = this.state.data;
            if(test!="fail") {
                len = test.length;
                var data = this.paginationData(test, this.state.pageIndex);
                var ref = this;
                data.map(function (item, i) {
                    var stars = [];
                    var star = parseInt(item.productStar);
                    for (var s = 0; s < star; s++) {
                        stars.push(
                            <span key={"star" + s} className="glyphicon glyphicon-star"></span>
                        )
                    }
                    var type = null;
                    switch (item.insuranceType) {
                        case '1':
                            type = "重疾险";
                            break;
                        case '2':
                            type = "意外险";
                            break;
                        case '3':
                            type = "养老险";
                            break;
                        case '4':
                            type = "理财险";
                            break;
                        case '5':
                            type = "医疗险";
                            break;
                    }
                    lrs.push(
                        <div className="pro_detail_list" key={i}>
                            <h1>
                                <a target="_blank">{item.productName}</a>
                            </h1>

                            <div className="left">
                                <div className="imgs">
                                    <a target="_blank">
                                        <img src="images/lifeInsurance/financial1.jpg" width="170px"
                                             height="100px"/>
                                    </a>
                                </div>
                            </div>
                            <div className="right">
                                <fieldset>
                                    <p className="assurance">
                                        <label className="title">推荐星级</label>
                                        <label className="longtxt">
                                            {stars}
                                        </label>
                                    </p>

                                    <p className="period">
                                        <label className="title">险种类型</label>
                                        <label className="longtxt">{type} </label>
                                    </p>

                                    <p className="amount">
                                        <label className="title">公司名称</label>
                                        <label>{item.companyName} </label>
                                    </p>

                                    <p className="premium">
                                        <label className="title">保<span
                                            className="txt_indent">额</span>
                                        </label>
                                        <label>{item.insuranceQuota}</label>
                                    </p>
                                </fieldset>
                            </div>
                            <div className="btm_area">
                                <div className="left">
                                    <h2>个险营销员渠道
                                    </h2>
                                </div>
                                <div className="right">
                                    <div className="pointline"></div>
                                    <div className="btm_btn">
                                        <div className="detail_btn">
                                            <a onClick={ref.goToOthers.bind(null, 'detail', item.productId, item.productName, item.productStar, item.briefly, item.insuranceQuota)}
                                               title="了解详细" target="_blank"></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                });
            }
        }else{
            this.initialData();
        }
            switch (this.state.nav) {
                case 'detail':
                    //container=<Detail Branch={this.Branch} productId={this.state.propProductId} productName={this.state.propProductName} productStar={this.state.propStar} briefly={this.state.propBriefly}/>
                    container = <Detail productId={this.state.propProductId} productName={this.state.propProductName}
                                        productStar={this.state.propStar} insuranceQuota={this.state.propQuota}/>
                    break;
                case undefined:
                    container =
                        <div>
                            <div className="w1008 margin mar_20">
                                <div className="pro_L " style={{float: 'left'}}>
                                    <form id="formForward">
                                        <div className="menu ">
                                            <h3 className="font_15">快速筛选</h3>
                                            <div id="inputStarLevel">
                                                <h3 className="font_15">推荐星级</h3>
                                                <ul onClick={this.getInfoBySlide.bind(null, 'inputStarLevel')}>
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" value="5"/>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="quickSearchSpanText">5 星</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" value="4"/>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="quickSearchSpanText">4 星</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" value="3"/>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span>3 星</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" value="2"/>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="quickSearchSpanText">2 星</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" value="1"/>
                                                            <span className="glyphicon glyphicon-star"></span>
                                                            <span className="quickSearchSpanText">1 星</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div id="inputCompany">
                                                <h3 className="font_15">推荐公司</h3>
                                                <ul onClick={this.getInfoBySlide.bind(null, 'inputCompany')}>
                                                    <li>
                                                        <label>
                                                            <input id="price1" type="checkbox" value="8"/>
                                                            <span className="quickSearchSpanText">中国人寿</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input id="price1" type="checkbox" value="18"/>
                                                            <span className="quickSearchSpanText">国华保险</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div id="inputCompanyType">
                                                <h3 className="font_15">公司类型</h3>
                                                <ul onClick={this.getInfoBySlide.bind(null, 'inputCompanyType')}>
                                                    <li>
                                                        <label>
                                                            <input id="price1" type="checkbox" value="8"/>
                                                            <span className="quickSearchSpanText">中资公司</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input id="price1" type="checkbox" value="8"/>
                                                            <span className="quickSearchSpanText">外资公司</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input id="price1" type="checkbox" value="8"/>
                                                            <span className="quickSearchSpanText">合资公司</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div id="inputIncrement">
                                                <h3 className="font_15">有无增值服务</h3>
                                                <ul onClick={this.getInfoBySlide.bind(null, 'inputIncrement')}>
                                                    <li>
                                                        <label>
                                                            <input type="radio" name="hideRegionId" value="all"/>
                                                            <span className="quickSearchSpanText">全部</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="radio" name="hideRegionId" value="all"/>
                                                            <span className="quickSearchSpanText">有增值服务</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type="radio" name="hideRegionId" value="all"/>
                                                            <span className="quickSearchSpanText">无增值服务</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="pro_C mar_20 " style={{float: 'left'}}>
                                        <div className="pro_C_img margin">
                                            <img src="images/PRO_29.jpg" width="221" height="94"/>
                                        </div>
                                        <p>
                                            <span style={{fontSize: '14px', color: '#337fe5'}}>汽车保险销售</span><span
                                            style={{fontSize: '14px', color: '#337fe5'}}>有限公司</span>
                                        </p>

                                        <p>
                                            <span style={{fontSize: '14px', color: '#337fe5'}}>地址：青岛市##区##路##号</span>
                                        </p>

                                        <p>
                                            <span style={{fontSize: '14px', color: '#337fe5'}}>电话：0531-12345678</span>
                                        </p>
                                    </div>

                                </div>
                                <div className="pro_R fr bg">
                                    <div className="pro_bg">
                                        <span className="fr pad_L">您的位置： <a href="home.jsp">主页</a> &gt; 人寿保险 &gt;</span>
                                    </div>
                                    <div className="article">
                                        <div className="visual">
                                            <h3 className="font_15 text">产品搜索</h3>
                                            <div className="lifeSearch">
                                                <ul>
                                                    <li className="searchContain searchContain_pro">
                                                        <h3 className="searchTitle">产品名:</h3>
                                                        <div>
                                                            <form>
                                                                <input onChange={this.onSaveInput}
                                                                       className="searchInput" type="text"/>
                                                            </form>
                                                        </div>
                                                    </li>
                                                    <li className="searchContain searchContain_com">
                                                        <h3 className="searchTitle">公司选择:</h3>
                                                        <div  >
                                                            <select id="company" onChange={this.getSelectCompany}
                                                                    className="searchSelect">
                                                                <option value="null">{"无"}</option>
                                                                {trs}
                                                            </select>
                                                        </div>
                                                    </li>
                                                    <li className="searchContain searchContain_ins">
                                                        <h3 className="searchTitle">险种类型:</h3>
                                                        <div>
                                                            <select id="lifeInsuranceType"
                                                                    onChange={this.getSelectLifeInsuranceType}>
                                                                <option value="0">无</option>
                                                                <option value="1">重疾险</option>
                                                                <option value="2">意外险</option>
                                                                <option value="3">养老险</option>
                                                                <option value="4">理财险</option>
                                                                <option value="5">医疗险</option>
                                                            </select>
                                                        </div>
                                                    </li>
                                                    <li className="searchContain searchContain_sea">
                                                        <div >
                                                            <form>
                                                                <input className="search"
                                                                       onClick={this.getLimitInsurancesList}
                                                                       defaultValue="查询"/>
                                                            </form>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="productDetails">
                                            <h3 className="font_15 text">寿险产品</h3>

                                            <div className="mframe">
                                                <div className="mcontent">
                                                    <div className="result">
                                                        {lrs}
                                                        <div >
                                                            <PageNavigator
                                                                capacity={len}
                                                                threshold={5}
                                                                pageIndex={this.state.pageIndex}
                                                                pageBegin={1}
                                                                previousCb={this.previousCb}
                                                                pageCb={this.pageCb}
                                                                nextCb={this.nextCb}
                                                                isChange={this.state.isChange}
                                                                paginate={Page}
                                                            />
                                                        </div>


                                                        <div className="pointline"></div>
                                                        <div className="grayline"></div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    break;
            }
            return container;
        }

});
module.exports = LifeInsurance;