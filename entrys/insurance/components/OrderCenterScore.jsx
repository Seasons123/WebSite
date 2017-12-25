/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';
import PageNavigator from '../modules/PageNavigator.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore')

var OrderCenterScore=React.createClass({
    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(10,capacity,pageIndex,function(ob){ //10表示每页显示10条数据
            slices=data.slice(ob.begin,ob.end);
        });
        return slices;
    },

    previousCb:function (index,isChange) { //向前跳页,isChange为true(比如5,6,7,8变为1,2,3,4)
        this.setState({pageIndex:index,isChange:isChange});
    },

    pageCb:function(index,isChange) { //进入指定页的列表，isChange为false
        this.setState({pageIndex:index,isChange:isChange});
    },
    nextCb:function(index,isChange){ //向后跳页,isChange为true (比如1,2,3,4变为5,6,7,8)
        this.setState({pageIndex:index,isChange:isChange});
    },

    //积分tab
    scoreTabChange:function(tab){

        var all = this.refs.all; //用引用设置字体颜色
        var income=this.refs.income;
        var used=this.refs.used;
        switch (tab) {
            case 'all':
                $(all).css("color","#288329");
                $(income).css("color","#0287ca");
                $(used).css("color","#0287ca");
                break;
            case 'income':
                $(all).css("color","#0287ca");
                $(income).css("color","#288329");
                $(used).css("color","#0287ca");
                break;
            case 'used':
                $(all).css("color","#0287ca");
                $(income).css("color","#0287ca");
                $(used).css("color","#288329");
                break;
        }

        this.setState({scoreTabCurrent:tab});
    },

    detailClick:function(i){
        var data=this.state.data; //所有订单数据
        var pageIndex=this.state.pageIndex; //页面索引
        var orderDetail;
        switch(this.state.scoreTabCurrent){
            case 'all':
                var allList=data.carOrder;
                allList = allList.concat(data.lifeOrder)
                allList = allList.concat(data.serviceOrder)
                orderDetail=allList[pageIndex*10+i];
                this.setState({orderDetail:orderDetail, currentContent:'scoreDetail'});
                break;
            case 'income':
                var incomeList=data.carOrder;
                incomeList = incomeList.concat(data.lifeOrder)
                orderDetail=incomeList[pageIndex*10+i];
                this.setState({orderDetail:orderDetail, currentContent:'scoreDetail'});
                break;
            case 'used':
                orderDetail=data.serviceOrder[pageIndex*10+i];
                this.setState({orderDetail:orderDetail, currentContent:'scoreDetail'});
                break;
        }
    },

    return:function(tab){
        this.setState({currentContent:tab});
    },

    initialData:function(){
        var url="/func/insurance/getCustomerScore";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                var re = ob.re;
                if(re!==undefined && re!==null && (re ==2 || re =="2")) { //登录信息为空
                    return;
                }
                var data=ob.data;
                this.setState({data:data});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    getInitialState:function(){ //currentContent 用于右侧面板的显示
        return ({currentContent:'score', data:null, scoreTabCurrent:'all',
            pageIndex:0, orderDetail:null, isChange:false});
    },

    render:function(){
        var mainContent=null;
        var orders=[];
        var trs=[];
        var detail_trs=[]; //订单信息
        var scoreList=null; //积分列表（明细，收入，支出）
        var data;
        var slideDetail=this.detailClick;
        var ins=this;  //用在map()函数里面，外面的this不能在里面用
        if(this.state.data!==undefined&&this.state.data!==null) {

            data = this.state.data;
            var score = data.score;
            var score_carOrderList = data.carOrder;
            var score_lifeOrderList = data.lifeOrder;
            var score_serviceOrderList = data.serviceOrder;
            switch (this.state.scoreTabCurrent) {
                case 'all':
                    scoreList = score_carOrderList;
                    scoreList = scoreList.concat(score_lifeOrderList)
                    scoreList = scoreList.concat(score_serviceOrderList)
                    //Array.prototype.push.apply(scoreList, lifeOrderList);
                    //Array.prototype.push.apply(scoreList, serviceOrderList);
                    data = this.paginationData(scoreList, this.state.pageIndex);

                    if(data!==null){
                        data.map(function (order, i) {
                            orders.push({orderNum: order.orderNum});
                            trs.push(
                                <tr key={i}>
                                    <td>
                                        <a href="javascript:void(0)"
                                           onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                    </td>
                                    <td>
                                        {order.scoreResource}
                                    </td>
                                    <td>
                                        {order.score}
                                    </td>
                                    <td>
                                        {order.orderDate}
                                    </td>
                                    <td>
                                        {order.orderStateStr}
                                    </td>
                                </tr>
                            );
                        });
                    }
                    break;

                case 'income':
                    scoreList = score_carOrderList;
                    scoreList = scoreList.concat(score_lifeOrderList)
                    data = this.paginationData(scoreList, this.state.pageIndex);

                    if(data!==null){
                        data.map(function (order, i) {
                            orders.push({orderNum: order.orderNum});
                            trs.push(
                                <tr key={i}>
                                    <td>
                                        <a href="javascript:void(0)"
                                           onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                    </td>
                                    <td>
                                        {order.scoreResource}
                                    </td>
                                    <td>
                                        {order.score}
                                    </td>
                                    <td>
                                        {order.orderDate}
                                    </td>
                                    <td>
                                        {order.orderStateStr}
                                    </td>
                                </tr>
                            );
                        });
                    }
                    break;

                case 'used':
                    scoreList = score_serviceOrderList;
                    data = this.paginationData(scoreList, this.state.pageIndex);
                    if(data!==null){
                        data.map(function (order, i) {
                            orders.push({orderNum: order.orderNum});
                            trs.push(
                                <tr key={i}>
                                    <td>
                                        <a href="javascript:void(0)"
                                           onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                    </td>
                                    <td>
                                        {order.scoreResource}
                                    </td>
                                    <td>
                                        {order.score}
                                    </td>
                                    <td>
                                        {order.orderDate}
                                    </td>
                                    <td>
                                        {order.orderStateStr}
                                    </td>
                                </tr>
                            );
                        });
                    }
                    break;
            }

            if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                var orderDetail = this.state.orderDetail;
                var flag = orderDetail.flag;
                switch (flag) {
                    case 'carOrder':
                        detail_trs.push( //订单信息
                            <tr key={0}>
                                <td>订单号：{orderDetail.orderNum}</td>
                                <td>保单号：{orderDetail.insuranceNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>客户：{orderDetail.customerName}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>申请时间：{orderDetail.applyTime}</td>
                                <td>缴费时间：{orderDetail.feeDate}</td>
                                <td>出单时间：{orderDetail.orderDate}</td>
                                <td>保单起期：{orderDetail.insuranceDate}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>投保人：{orderDetail.insurerName}</td>
                                <td>被保险人：{orderDetail.insurancederName}</td>
                                <td>受益人：{orderDetail.benefiterName}</td>
                                <td>保险公司：{orderDetail.companyName}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={3}>
                                <td>商业基准保费：{orderDetail.insuranceBusinessFee}</td>
                                <td>商业险折扣：{orderDetail.businessDiscount}</td>
                                <td>交强险基准保费：{orderDetail.insuranceCompulsoryFee}</td>
                                <td>交强险折扣：{orderDetail.compulsoryDiscount}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={4}>
                                <td>车船税：{orderDetail.carTax}</td>
                                <td>签单保费：{orderDetail.contractFee}</td>
                                <td>佣金：{orderDetail.commission}</td>
                                <td>积分：{orderDetail.score}</td>
                            </tr>
                        );
                        break;
                    case 'lifeOrder':
                        detail_trs.push(//订单信息
                            <tr key={0}>
                                <td>订单号：{orderDetail.orderNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>申请时间：{orderDetail.applyTime}</td>
                                <td>出单时间：{orderDetail.orderDate}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>客户编号：{orderDetail.customerNum}</td>
                                <td>客户姓名：{orderDetail.customerName}</td>
                                <td>客户电话：{orderDetail.customerPhone}</td>
                                <td>保障类型：{orderDetail.insuranceType}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>是否有社保：{orderDetail.hasSocietyInsurance}</td>
                                <td>是否有商业保险：{orderDetail.hasCommerceInsurance}</td>
                                <td>计划保费：{orderDetail.planInsuranceFee}</td>
                                <td>保费金额：{orderDetail.insuranceFeeTotal}</td>
                            </tr>
                        );
                        break;
                    case 'serviceOrder':
                        detail_trs.push(//订单信息
                            <tr key={0}>
                                <td>订单编号：{orderDetail.orderNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>预约时间：{orderDetail.estimateTime}</td>
                                <td>申请时间：{orderDetail.applyTime}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>车牌号：{orderDetail.carNum}</td>
                                <td>服务类型：{orderDetail.serviceType}</td>
                                <td>服务项目：{orderDetail.subServiceTypeNames}</td>
                                <td>服务地点：{orderDetail.servicePlace}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>服务人员编号：{orderDetail.servicePersonNum}</td>
                                <td>服务人员姓名：{orderDetail.servicePersonName}</td>
                                <td>客户编号：{orderDetail.customerNum}</td>
                                <td>客户姓名：{orderDetail.customerName}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={3}>
                                <td>接单时间：{orderDetail.takeOrderDate}</td>
                                <td>完成时间：{orderDetail.orderFinishDate}</td>
                                <td>结算时间：{orderDetail.feeDate}</td>
                                <td>服务费用：{orderDetail.fee}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={4}>
                                <td>改派时间：{orderDetail.reassignDate}</td>
                                <td>是否送车：{orderDetail.isAgent}</td>
                                <td>评价等级：{orderDetail.evaluate}</td>
                                <td>建议：{orderDetail.proposal}</td>
                            </tr>
                        );
                        break;
                }
            }

            var scoreCommon=(
                <div>
                    <div className="nav-collapse">
                        <ul className="nav-person-center" >
                            <li className="all" onClick={this.scoreTabChange.bind(null,'all')} >
                                <a className='all' ref='all' style={{color:'#288329', fontSize:'17px'}}>
                                    积分明细
                                </a>
                            </li>
                            <li className="income" onClick={this.scoreTabChange.bind(null,'income')} >
                                <a className='income' ref='income' style={{color:'#0287ca', fontSize:'17px'}}>
                                    积分收入
                                </a>
                            </li>
                            <li className="used" onClick={this.scoreTabChange.bind(null,'used')} >
                                <a className='used' ref='used' style={{color:'#0287ca', fontSize:'17px'}}>
                                    积分支出
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="score" style={{paddingtop:'8px'}}>
                        <div className="summary clearfix">
                            <div className="item valid">
                                <span className="desc" style={{display:'block',float:'left'}}>可用积分:</span>
                                <span className="point">{score}</span>
                            </div>
                            <div className="item exchange">
                                <a href="javascript:void(0);" target="_blank">暂不可充值</a>
                            </div>
                        </div>
                    </div>
                </div>
            );

            switch (this.state.currentContent) {
                case 'score':
                    mainContent =(
                        <div className="score">
                            {scoreCommon}

                            <div className="slider" ref="slider" style={{width:'100%',marginTop:'20px',position:'relative'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table" style={{textAlign:'center'}}>
                                            <thead className="table-head">
                                            <tr>
                                                <th width="330">订单编号</th>
                                                <th width="330">来源/用途</th>
                                                <th width="330">积分变化</th>
                                                <th width="330">出单时间</th>
                                                <th width="330">订单状态</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <PageNavigator
                                                        capacity={scoreList.length}
                                                        pageIndex={this.state.pageIndex}
                                                        pageBegin={1}
                                                        previousCb={this.previousCb}
                                                        pageCb={this.pageCb}
                                                        nextCb={this.nextCb}
                                                        isChange={this.state.isChange}
                                                        paginate={Page}
                                                        />
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>);
                    break;

                case 'scoreDetail':
                    mainContent =(
                        <div className="score">
                            {scoreCommon}
                            <div id="order_detail">
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                            <tr>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {detail_trs}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="nav-return" ref="ack">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}}/>

                                    <div className="clear">
                                    </div>
                                    <div className="return-and-ack">
                                        <div className="only-btn-return">
                                            <span>
                                                <input className="ret" type="button" value="返  回" onClick={this.return.bind(null,"score")} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>);
                    break;
            }

        } else{
            //初始化内容详情
            this.initialData();
        }

        return(
            <div>
                {mainContent}
            </div>
        )
    }
});
module.exports=OrderCenterScore;



