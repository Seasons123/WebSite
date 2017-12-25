/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';

import PageNavigator from '../modules/PageNavigator.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore')

var LifeOrder=React.createClass({
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
        this.setState({orderDetail:orderDetail, currentContent:'lifeOrderDetail'});
    },

    return:function(tab){
        this.setState({currentContent:tab});
    },

    initialData:function(){
        var url="/func/insurance/getInsuranceLifeOrder";
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
        return ({currentContent:'lifeOrder', data:null,
            pageIndex:0, orderDetail:null, isChange:false});
    },

    render:function(){

        var mainContent=null;
        var orders=[];
        var trs=[];
        var detail_trs=[]; //订单信息
        var insurer_trs=[]; //投保人信息（车险、寿险）
        var insuranceder_trs=[]; //被保险人信息（车险、寿险）
        var product_trs=[]; //产品信息（车险的、寿险）
        var plan_trs=[] //计划书（寿险的）
        var benefiter_trs=[]; //受益人（寿险的）

        var lifeOrderList=null; //寿险订单列表
        var data;

        var slideDetail=this.detailClick;
        var ins=this;  //用在map()函数里面，外面的this不能在里面用
        if(this.state.data!==undefined&&this.state.data!==null) {
            lifeOrderList = this.state.data;
            data = this.paginationData(this.state.data, this.state.pageIndex);
            data.map(function (order, i) {
                orders.push({orderNum: order.orderNum});
                trs.push(
                    <tr key={i}>
                        <td>
                            <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                        </td>
                        <td>
                            {order.productName}
                        </td>
                        <td>
                            {order.orderDate}
                        </td>
                        <td>
                            {order.orderStateStr}
                        </td>
                        <td>
                            {order.insuranceFeeTotal}
                        </td>
                    </tr>
                );
            });

            if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                var orderDetail = this.state.orderDetail;
                var orderPlan = orderDetail.plan;
                var insurer = orderDetail.insurer;
                var insuranceder = orderDetail.insuranceder;
                var benefiter = orderDetail.benefiter;
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

                if(orderPlan!==undefined && orderPlan!==null){ //计划书
                    var j=0;
                    var k=0;
                    orderPlan.map(function (item, i) {
                        var productItem = item.productItem;
                        var insuranceNum = item.insuranceNum; //保单号
                        plan_trs.push( //计划书
                            <tr key={j++}>
                                <td>保单号：{item.insuranceNum}</td>
                                <td>签单日期：{item.feeDate}</td>
                                <td>起保日期：{item.insuranceDate}</td>
                                <td>申请时间：{item.applyTime}</td>
                            </tr>
                        );
                        plan_trs.push(
                            <tr key={j++}>
                                <td>保额：{item.insuranceQuota}</td>
                                <td>缴费年限类型：{item.feeYearType}</td>
                                <td>保障期限类型：{item.insuranceDuringType}</td>
                                <td>起保日期：{item.insuranceDate}</td>
                            </tr>
                        );
                        plan_trs.push(
                            <tr key={j++}>
                                <td>保费金额：{item.insuranceFee}</td>
                                <td>佣金：{item.commission}</td>
                                <td>积分：{item.score}</td>
                                <td></td>
                            </tr>
                        );

                        if(productItem!==undefined && productItem!==null) { //产品信息
                            productItem.map(function (item, i) {
                                product_trs.push(
                                    <tr key={k++}>
                                        <td>保单号：{insuranceNum}</td>
                                        <td>产品名称：{item.productName}</td>
                                        <td>保险公司：{item.companyName}</td>
                                        <td>保额：{item.insuranceQuota}</td>
                                    </tr>
                                );
                            });
                        }
                    });
                }
                if(insurer!==undefined && insurer!==null){
                    insurer_trs.push( //投保人信息
                        <tr key={0}>
                            <td>编号：{insurer.perNum}</td>
                            <td>姓名：{insurer.perName}</td>
                            <td>身份证号：{insurer.perIdCard}</td>
                            <td>地址：{insurer.perAddress}</td>
                        </tr>
                    );
                }
                if(insuranceder!==undefined && insuranceder!==null){
                    insuranceder_trs.push( //被保险人信息
                        <tr key={0}>
                            <td>编号：{insuranceder.perNum}</td>
                            <td>姓名：{insuranceder.perName}</td>
                            <td>身份证号：{insuranceder.perIdCard}</td>
                            <td>地址：{insuranceder.perAddress}</td>
                        </tr>
                    );
                }
                if(benefiter!==undefined && benefiter!==null){
                    benefiter_trs.push( //受益人信息
                        <tr key={0}>
                            <td>编号：{benefiter.perNum}</td>
                            <td>姓名：{benefiter.perName}</td>
                            <td>身份证号：{benefiter.perIdCard}</td>
                            <td>地址：{benefiter.perAddress}</td>
                        </tr>
                    );
                }
            }

            switch (this.state.currentContent) {
                case 'lifeOrder':
                    mainContent =(
                        <div className='lifeOrder'>
                            <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table" style={{textAlign:'center'}}>
                                            <thead className="table-head">
                                            <tr>
                                                <th width="200">订单编号</th>
                                                <th width="500">产品名称</th>
                                                <th width="330">订单时间</th>
                                                <th width="330">订单状态</th>
                                                <th width="200">保费</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <PageNavigator
                                                        capacity={lifeOrderList.length}
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

                case 'lifeOrderDetail':
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

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>计划书:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {plan_trs}
                                        </tbody>


                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>产品信息:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {product_trs}
                                        </tbody>

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>投保人信息:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {insurer_trs}
                                        </tbody>

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>被保险人信息:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {insuranceder_trs}
                                        </tbody>

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>受益人信息:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {benefiter_trs}
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
                                                <input className="ret" type="button" value="返  回" onClick={this.return.bind(null,"lifeOrder")} />
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
module.exports=LifeOrder;



