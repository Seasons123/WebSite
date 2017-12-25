/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';

import PageNavigator from '../modules/PageNavigator.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore')

var ServiceOrder=React.createClass({
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

    detailClick:function(i){
        var data=this.state.data; //所有订单数据
        var pageIndex=this.state.pageIndex; //页面索引
        var orderDetail;
        orderDetail=data[pageIndex*10+i]; //得到点击的订单条目信息
        this.setState({orderDetail:orderDetail, currentContent:'serviceOrderDetail'});
    },

    return:function(tab){
        this.setState({currentContent:tab});
    },

    initialData:function(){
        var url="/func/insurance/getInsuranceCarServiceOrder";

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
        return ({currentContent:'serviceOrder', data:null,
            pageIndex:0, orderDetail:null, isChange:false});
    },

    render:function(){

        var mainContent=null;
        var orders=[];
        var trs=[];
        var detail_trs=[]; //订单信息
        var serviceOrderList=null; //服务订单列表
        var data;
        var slideDetail=this.detailClick;
        var ins=this;  //用在map()函数里面，外面的this不能在里面用
        if(this.state.data!==undefined&&this.state.data!==null) {
            serviceOrderList = this.state.data;
            data = this.paginationData(this.state.data, this.state.pageIndex);
            data.map(function (order, i) {
                orders.push({orderNum: order.orderNum});
                trs.push(
                    <tr key={i}>
                        <td>
                            <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                        </td>
                        <td>
                            {order.serviceType}
                        </td>
                        <td>
                            {order.orderFinishDate}
                        </td>
                        <td>
                            {order.orderStateStr}
                        </td>
                        <td>
                            {order.fee}
                        </td>
                    </tr>
                );
            });

            if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                var orderDetail = this.state.orderDetail;
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
            }

            switch (this.state.currentContent) {
                case 'serviceOrder':
                    mainContent =(
                        <div className='serviceOrder'>
                            <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table" style={{textAlign:'center'}}>
                                            <thead className="table-head">
                                            <tr>
                                                <th width="330">订单编号</th>
                                                <th width="330">服务类型</th>
                                                <th width="330">订单完成时间</th>
                                                <th width="330">订单状态</th>
                                                <th width="330">费用</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <PageNavigator
                                                        capacity={serviceOrderList.length}
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
                case 'serviceOrderDetail':
                    mainContent =(
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

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>订单信息:</strong></h4></td></tr></tbody>
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
                                                <input className="ret" type="button" value="返  回" onClick={this.return.bind(null,"serviceOrder")} />
                                            </span>

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
module.exports=ServiceOrder;



