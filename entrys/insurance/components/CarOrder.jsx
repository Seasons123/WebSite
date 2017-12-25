/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';

import PageNavigator from '../modules/PageNavigator.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../modules/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore')

var CarOrder=React.createClass({
    //显示提示框，目前三个参数(txt：要显示的文本；time：自动关闭的时间（不设置的话默认1500毫秒）；status：默认0为错误提示，1为正确提示；)
    showTips:function(txt,time,status) {
        var htmlCon = '';
        if(txt != ''){
            if(status != 0 && status != undefined){
                htmlCon = '<div class="tipsBox" style="width:220px;padding:10px;background-color:#4AAF33;border-radius:4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;color:#fff;box-shadow:0 0 3px #ddd inset;-webkit-box-shadow: 0 0 3px #ddd inset;text-align:center;position:fixed;top:25%;left:50%;z-index:999999;margin-left:-120px;">'+txt+'</div>';
            }else{
                htmlCon = '<div class="tipsBox" style="width:220px;padding:10px;background-color:#D84C31;border-radius:4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;color:#fff;box-shadow:0 0 3px #ddd inset;-webkit-box-shadow: 0 0 3px #ddd inset;text-align:center;position:fixed;top:25%;left:50%;z-index:999999;margin-left:-120px;">'+txt+'</div>';
            }
            $('body').prepend(htmlCon);
            if(time == '' || time == undefined){
                time = 1500;
            }
            setTimeout(function(){ $('.tipsBox').remove(); },time);
        }
    },

    paginationData:function (data,pageIndex) {
        var capacity=data.length;
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
        this.setState({orderDetail:orderDetail, currentContent:'carOrderDetail'});
    },

    return:function(tab){
        this.setState({currentContent:tab});
    },

    checkBoxChange:function(){
        var a=null;
        $("#isAgree input:checkbox:checked").each(function (index, domEle) {
            a= $(domEle).val();
        });
        if(a!==undefined&&a!==null){
           this.setState({checkBox:true});
            $("#ackQuotation").attr("style","");

        }else {
            this.setState({checkBox:false});
            $("#ackQuotation").attr("style","background:darkgrey");
        }
    },

    checkBoxSelect:function(ob,evt){ //控制选项框只能选一个
        var target=evt.target;
        var priceId=$(target).attr("value");
        var i=ob;
        $("#priceList input:checkbox").each(function (index, domEle) {
            //a= $(domEle).val();
            if(index!=i){
                $(domEle).attr("checked",false);
            }
        });

        this.setState({choosePriceId:priceId});

    },

    ack:function() {
        var orderId=this.state.orderDetail.orderId;
        var priceId=this.state.choosePriceId;
        if(priceId==undefined || priceId==null){
            this.showTips('请选择报价单~');
            return;
        }

        var msg = "您真的确定该报价吗？\n\n请再次确认！";
        if (confirm(msg)==false){
            return;
        }

        var url="/func/insurance/ackInsuranceCarOrderState";
        var params={

            orderId:orderId,
            priceId:priceId

        };

        ProxyQ.query(
           'post',
           url,
           params,
           null,
           function(ob){

           }.bind(this),
           function(xhr, status, err) {
               console.error(this.props.url,status,err.toString());
           }.bind(this)
        );
    },

    initialData:function(){
        var url="/func/insurance/getInsuranceCarOrder";


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
        return ({currentContent:'carOrder', data:null, checkBox:false, choosePriceId:null,
            pageIndex:0, orderDetail:null, isChange:false});
    },

    render:function(){

        var mainContent=null;
        var orders=[];
        var trs=[];
        var detail_trs=[]; //订单信息
        var insurer_trs=[]; //投保人信息（车险）
        var insuranceder_trs=[]; //被保险人信息（车险）
        var benefiter_trs=[] //受益人信息（车险）
        var carInfo_trs=[]; //汽车详细（车险的）
        var product_trs=[]; //产品信息（车险）
        var price_trs=[]; //报价列表
        var carOrderList=null; //车险订单列表

        var data;
        var ack=null;

        var slideDetail=this.detailClick;
        var checkBoxSelect=this.checkBoxSelect;
        var ins=this;  //用在map()函数里面，外面的this不能在里面用
        if(this.state.data!==undefined&&this.state.data!==null) {
            carOrderList = this.state.data;
            data = this.paginationData(this.state.data, this.state.pageIndex);
            data.map(function (order, i) {
                orders.push({orderNum: order.orderNum});
                trs.push(
                    <tr key={i}>
                        <td>
                            <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                        </td>
                        <td>
                            {order.insuranceNum}
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
                var product = orderDetail.product;
                var insurer = orderDetail.insurer; //投保人
                var insuranceder = orderDetail.insuranceder; //被保险人
                var benefiter = orderDetail.benefiter; //受益人
                var carInfo = orderDetail.carInfo;
                var priceFlag = orderDetail.priceFlag;
                var price = orderDetail.price; //报价列表里

                if (priceFlag == 1 || priceFlag == "1") { //表示已报价,需要用户进行确认
                    ack = true;
                }

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

                if (product !== undefined && product !== null) {
                    product.map(function (item, i) {
                        product_trs.push( //产品信息
                            <tr key={i}>
                                <td>产品名称：{item.productName}</td>
                                <td>保额：{item.insuranceType}</td>
                                <td>保费：{item.insuranceFeeTotal}</td>
                                <td>车船税：{item.carTax}</td>
                            </tr>
                        );
                    });
                }

                if (insurer !== undefined && insurer !== null) {
                    insurer_trs.push( //投保人信息
                        <tr key={0}>
                            <td>编号：{insurer.perNum}</td>
                            <td>姓名：{insurer.perName}</td>
                            <td>身份证号：{insurer.perIdCard}</td>
                            <td>地址：{insurer.perAddress}</td>
                            <td></td>
                        </tr>
                    );
                }

                if (insuranceder !== undefined && insuranceder !== null) {
                    insuranceder_trs.push( //被保险人信息
                        <tr key={0}>
                            <td>编号：{insuranceder.perNum}</td>
                            <td>姓名：{insuranceder.perName}</td>
                            <td>身份证号：{insuranceder.perIdCard}</td>
                            <td>地址：{insuranceder.perAddress}</td>
                            <td></td>
                        </tr>
                    );
                }

                if (benefiter !== undefined && benefiter !== null) {
                    benefiter_trs.push( //受益人信息
                        <tr key={0}>
                            <td>编号：{benefiter.perNum}</td>
                            <td>姓名：{benefiter.perName}</td>
                            <td>身份证号：{benefiter.perIdCard}</td>
                            <td>地址：{benefiter.perAddress}</td>
                            <td></td>
                        </tr>
                    );
                }

                if (carInfo !== undefined && carInfo !== null) {
                    carInfo_trs.push( //行驶证信息
                        <tr key={0}>
                            <td>车牌号：{carInfo.carNum}</td>
                            <td>车主姓名：{carInfo.ownerName}</td>
                            <td>车主身份证号：{carInfo.ownerIdCard}</td>
                            <td>车主地址：{carInfo.ownerAddress}</td>
                        </tr>
                    );
                    carInfo_trs.push(
                        <tr key={1}>
                            <td>注册日期：{carInfo.firstRegisterDate}</td>
                            <td>发证日期：{carInfo.issueDate}</td>
                            <td>校验日期：{carInfo.validityDate}</td>
                            <td>保险起期：{carInfo.startInsuranceDate}</td>
                        </tr>
                    );
                    carInfo_trs.push(
                        <tr key={2}>
                            <td>车辆类型：{carInfo.carType}</td>
                            <td>使用性质：{carInfo.useType}</td>
                            <td>车辆状态：{carInfo.carState}</td>
                            <td>品牌型号：{carInfo.factoryNum}</td>
                        </tr>
                    );
                    carInfo_trs.push(
                        <tr key={3}>
                            <td>车辆识别代码：{carInfo.frameNum}</td>
                            <td>发动机号码：{carInfo.engineNum}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    );
                }

                if (price !== undefined && price !== null) {
                    price.map(function (item, i) {
                        price_trs.push( //报价列表
                            <tr key={2*i+0}>
                                <td><input type="checkbox" value={item.priceId} onChange={checkBoxSelect.bind(ins,i)} /></td>
                                <td>保险公司：{item.companyName}</td>
                                <td>商业险基准保费：{item.insuranceBusinessFee}</td>
                                <td>商业险折扣：{item.businessDiscount}</td>
                                <td>交强险基准保费：{item.insuranceCompulsoryFee}</td>
                                <td>交强险折扣：{item.compulsoryDiscount}</td>
                            </tr>
                        );
                        price_trs.push(
                            <tr key={2*i+1}>
                                <td></td>
                                <td>车船税：{item.carTax}</td>
                                <td>签单保费：{item.contractFee}</td>
                                <td>佣金：{item.commission}</td>
                                <td>积分：{item.score}</td>
                                <td>不计免赔金额：{item.nonDeductibleInsurance}</td>
                            </tr>
                        );
                    });
                }
            }

            switch (this.state.currentContent) {
                case 'carOrder':
                    mainContent = (
                        <div className='carOrder'>
                            <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table" style={{textAlign:'center'}}>
                                            <thead className="table-head">
                                            <tr>
                                                <th width="300">订单编号</th>
                                                <th width="300">保单号</th>
                                                <th width="300">产品名称</th>
                                                <th width="300">订单时间</th>
                                                <th width="300">订单状态</th>
                                                <th width="300">保费</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={6}>
                                                    <PageNavigator
                                                        capacity={carOrderList.length}
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

                case 'carOrderDetail':
                    mainContent = (
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

                                        <tbody><tr><td><h4 style={{marginTop:'15px'}}><strong>行驶证信息:</strong></h4></td></tr></tbody>
                                        <tbody>
                                        {carInfo_trs}
                                        </tbody>

                                        <tbody><tr><td colSpan={5}><h4 style={{marginTop:'15px'}}><strong>产品信息:</strong></h4></td></tr></tbody>
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


                                    {ack?
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                            <tr>
                                                <th width="50"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                            </tr>
                                            </thead>

                                            <tbody id="priceList">
                                            <tr><td colSpan={6}><h4 style={{marginTop:'15px'}}><strong>报价列表:</strong></h4> </td></tr>
                                            {price_trs}
                                            </tbody>
                                        </table>
                                        :
                                        null}

                                </div>
                            </div>

                            {ack?
                                <div className="nav-return" ref="ack">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}}/>

                                    <div className="clear">
                                    </div>
                                    <div className="return-and-ack">
                                        <div className="btn-return">
                                            <span>
                                                <input className="ret" type="button" value="返  回" onClick={this.return.bind(null,"carOrder")} />
                                            </span>
                                        </div>
                                        <div className="btn-ack" id="isAgree">
                                            <span>
                                                <input type="checkbox"  onChange={this.checkBoxChange} />
                                            </span>
                                            <span style={{margin:'0 50px 0 10px'}}>我同意xxxxxxxxxxxxx条款</span>
                                            <span>
                                                <input className="ack" id="ackQuotation" type="button" value="确认报价"  disabled={this.state.checkBox==true?false:true} style={{background: 'darkgrey'}}  onClick={this.ack} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="nav-return" ref="ack">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}}/>

                                    <div className="clear">
                                    </div>
                                    <div className="return-and-ack">
                                        <div className="only-btn-return">
                                            <span>
                                                <input className="ret" type="button" value="返  回" onClick={this.return.bind(null,"carOrder")} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

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
module.exports=CarOrder;