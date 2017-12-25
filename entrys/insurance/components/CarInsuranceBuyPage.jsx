import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import '../../../css/insurance/components/commonTopSupnuevo.css';
import '../../../css/insurance/components/navcontent.css';
import '../../../css/insurance/components/pagination.css';
import '../../../css/insurance/components/productIntroduction.css';
import '../../../css/insurance/components/personInfoBase.css';
import '../../../css/insurance/components/personInfoLayout.css';
import AddRelatedCarInfo from './AddRelatedCarInfo.jsx';
import AddRelatedPersonInfo from './AddRelatedPersonInfo.jsx';
import Footer from '../modules/Footer';
import Upload from '../../../entrys/insurance/components/Upload';
var ProxyQ = require('../../../components/proxy/ProxyQ');
var SyncStore = require('../../../components/flux/stores/SyncStore');

var CarInsuranceBuyPage = React.createClass({
    closeModal:function(ob){ //保存跳转的页面信息
        var Modal = this.refs[ob];
        $(Modal).modal('hide');

    },
    openCompanyInput:function(){
        $('#carCompany').selectpicker('refresh');
        $('#carCompany').selectpicker('show');
    },
    getInitialState: function() {
        var temporaryStore=SyncStore.getPageData();
        if(temporaryStore[0]==null||temporaryStore[0]==undefined
        ||temporaryStore[1]==null||temporaryStore[1]==undefined
            ||temporaryStore[2]==null||temporaryStore[2]==undefined){
            return{
                mainPage:0
            }
        }else {
        var info='';
        // for(
        //     var i=0;i<this.props.info.length;i++){
        //     info+=this.props.info[i]+',';
        // }
        for(var i=0;i<temporaryStore[0].length;i++){
            info+=temporaryStore[0][i]+',';
        }
        var attach=[];
        // attach=this.props.attach;
        attach=temporaryStore[1];
        var jqx=null;
        jqx=temporaryStore[2]
        SyncStore.setPageData(null);
        SyncStore.setRouter(null);
        return {
            info:info,
            attach:attach,
            remove:[],
            insuranceType:[],
            typeNum:0,
            selectCarCompany:0,
            selectCar:0,
            selectRelative:0,
            load:null,
            myRelatives:null,
            myCars:null,
            company:null,
            jqx:jqx
        }
        }
    },
    getMyRelativeAndMyCar:function(){
        var url="/func/insurance/getMyRelativeAndMyCar";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {

                   // this.state.myRelatives=ob.relative;
                   //  this.state.myCars=ob.car;

                this.setState({myRelatives:ob.relative});
                this.setState({myCars:ob.car});

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getCarInsurancesInfo:function(){
        var url="/func/insurance/getInsuranceCarProductInfo";
        var params={
            productName:this.state.info
        };

        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.state.insInfo=ob.data;
                if(this.state.typeNum==0) {
                    var ref = this;
                    this.state.insInfo.map(function (item, i) {//保险类型项
                        if (item.insuranceType != null && item.insuranceType.length != 0) {
                            ref.state.typeNum = ref.state.typeNum + 1;
                        }
                    });
                }
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getCarCompanies:function(){
        var url="/func/insurance/getCarInsuranceCompany";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                this.setState({company:ob.data});
                this.openCompanyInput();
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );

    },
    getSelectCompany:function(){
        var selected=$('#carCompany').val();
        if(selected!=null&&selected!=""){
            var select=selected.toString();
            this.state.selectCarCompany=select;
        }

    },
    getSelectCar:function(){
        var selected=$('#myCar option:selected').val();
        this.state.selectCar=selected;
    },
    getSelectRelative:function(){
        var selected=$('#myRelative option:selected').val();
        this.state.selectRelative=selected;
    },
    getSelectInsuranceType:function(num,name){
        var itm=this.refs['radio'+name+num];
        var fd=false;
        this.state.insuranceType.map(function(item,i){
            if(item[0]==name){
                item[1]=itm.value;
                fd=true;
            }
        });
        if(fd==false){
            this.state.insuranceType.push([itm.name,itm.value]);
        }


    },
    updateOrderInfo:function(){
        if(this.state.insuranceType.length==this.state.typeNum){
            if(this.state.selectCar!==0&&this.state.selectCarCompany!==0){
                var ref=this;
                var att=[];
                this.state.attach.map(function(item,i){
                    att.push(item);
                });
                var c=[];
                att.map(function(item,i){
                    for(var v=0;v<ref.state.remove.length;v++){
                        if(ref.state.remove[v]==item[0]){
                            att[i]=null;
                        }
                    }
                    if(att[i]!=null) {
                        c.push([item[0],item[1],null]);
                    }
                });
                c.map(function(item,i){
                    if(ref.state.insuranceType.length==0){
                        c[i][2]='none';
                    }else {
                        for (var z = 0; z < ref.state.insuranceType.length; z++) {
                            if (ref.state.insuranceType[z][0] == item[0]) {
                                c[i][2] = ref.state.insuranceType[z][1];
                            }
                        }
                    }
                });
                c.map(function (item,i) {
                   if(item[2]==null){
                       c[i][2]='none';
                   }
                });
                this.state.update=c;
                var b= c.join("-");
                var url="/func/insurance/createInsuranceCarOrder";
                var params={
                    update:b,
                    carId:this.state.selectCar,
                    companyId:this.state.selectCarCompany,
                    insurancederId:this.state.selectRelative

                };

                ProxyQ.query(
                    'post',
                    url,
                    params,
                    null,
                    function(ob) {
                        if(ob.data=='success'){
                            // alert('您的车险计划单已提交成功，请等待客服人员报价！')
                            var successModal = this.refs['successModal'];
                            $(successModal).modal('show');
                        }

                    }.bind(this),

                    function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                );
            }else{
                alert('您未选择公司或车辆！请选择！');
            }
        }else{
            alert('请选择产品类型！');
        }
    },
    closeItem:function(num,name){
        //$(document).ready(function(c) {
        // $('.close1').on('click', function(c){
        var ref=this;
        if(name=='车辆损失险'){
            this.state.attach.map(function(item,i){
                if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'||item[0]=='自燃损失险'
                    ||item[0]=='车损险无法找到第三方'||item[0]=='新增设备损失险'||item[0]=='发动机涉水损失险'){
                    $(ref.refs['cart-header'+i]).fadeOut('slow', function(c){
                        $( ref.refs['cart-header'+i]).remove();
                    });
                    ref.state.remove.push(item[0]);
                    if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'){
                        ref.state.typeNum=ref.state.typeNum-1;
                    }
                }
            });
        }
        else{
            if(name=='第三者责任险'){
                this.state.attach.map(function(item,i){
                    if(item[0]=="车上人员责任险（乘客）"||item[0]=='车上人员责任险（驾驶员）'){
                        $(ref.refs['cart-header'+i]).fadeOut('slow', function(c){
                            $( ref.refs['cart-header'+i]).remove();
                        });
                        ref.state.remove.push(item[0]);
                        ref.state.typeNum=ref.state.typeNum-1;
                    }
                });
            }

        }
        var item=this.refs['cart-header'+num];
        $(item).fadeOut('slow', function(c){
            $(item).remove();
            if(name=="车上人员责任险（乘客）"||name=='车上人员责任险（驾驶员）'||
                name=="玻璃单独破碎险"||name=='车身划痕损失险'||name=='第三者责任险'){
                ref.state.typeNum=ref.state.typeNum-1;
            }
        });
        this.state.remove.push(name);
        setTimeout(function(){
            var len=$('.cart-header').length;
            if(len==0){
                ref.setState({noIns:true});
            }
        },1000);


        //   });
        // });
    },
    initialData:function(){
        this.getCarInsurancesInfo();
        this.getMyRelativeAndMyCar();
        this.getCarCompanies();
    },
    addNewMan:function () {
        var addNewManModal = this.refs['addNewManModal'];
        $(addNewManModal).modal('show');
    },
    addNewCar:function () {
        var addNewCarModal = this.refs['addNewCarModal'];
        $(addNewCarModal).modal('show');
    },
    flush:function (a) {
            var addInfoSuccessModal = this.refs['addInfoSuccessModal'];
            $(addInfoSuccessModal).modal('show');
            this.closeModal(a);
            this.initialData();

    },

    render: function () {
        var container=null;
        if(this.state.mainPage ==undefined){
        if(this.state.company!=null&&this.state.company!=undefined
        &&this.state.insInfo!=null&&this.state.insInfo!=undefined
        &&this.state.myRelatives!=null&&this.state.myRelatives!=undefined
        &&this.state.myCars!=null&&this.state.myCars!=undefined){
            var trs=[];//公司选项
            var company=this.state.company;
            company.map(function(item,i){
                trs.push(
                    <option key={i} value={item.companyId}>{item.companyName}</option>
                )

            });
            var TRS=[];
            TRS.push(
                <select  key='selectCompany' id="carCompany" onChange={this.getSelectCompany} name="usertype" className="selectpicker show-tick form-control" multiple data-live-search="true">
                    {trs}
                </select>
            );

            var crs = [];//汽车选项
            var myCar=this.state.myCars;
            myCar.map(function(item,i){
                crs.push(
                    <option key={i} value={item[0]}>{item[1]}</option>
                )
            });
            var rrs=[];//相关人员项
            var myRelative=this.state.myRelatives;
            myRelative.map(function(item,i){
                rrs.push(
                    <option key={i} value={item.personId}>{item.perName}</option>
                )
            });
            var lrsNothing=[];
            lrsNothing.push(
                <div className="cart-header"  key={"nothing"+1}>
                    <ul className="carPlan-detail-item-list" >
                        <li className="item clearfix" style={{textAlign:'center'}}>
                            您没有购买任何产品！
                        </li>
                    </ul>
                </div>
            );
            var lrs = [];//车险信息项
            var data=this.state.insInfo;
            var ref=this;
            data.map(function (item, i) {//保险类型项
                if(item.insuranceType!=null&&item.insuranceType.length!=0){
                    // ref.state.typeNum=ref.state.typeNum+1;
                    var strs=item.insuranceType.split(",");
                    var nrs =[];
                    var name=item.productName;
                    strs.map(function(item,i){
                        if(item!=null&&item.length!=0){
                            nrs.push(
                                <label className="check" key={name+i} onChange={ref.getSelectInsuranceType.bind(ref,i,name)}>
                                    <input type="radio"  ref={'radio'+name+i} name={name} value={item} style={{margin:'0px 5px 3px 2px'}}/>
                                     {item}
                                </label>
                            )}
                    });

                }
                var ath=null;//附加险项
                var nam=item.productName;
                ref.state.attach.map(function(opt,i){
                    if(opt[0]==nam){
                        ath=opt[1];
                    }
                });
                lrs.push(
                    <div className="cart-header"  ref={"cart-header"+i} key={i}>
                        <ul className="carPlan-detail-item-list" >
                            <li className="item clearfix" >
                                <div className="id">
                                    {i+1}
                                </div>
                                <div className="what">
                                    {item.productName}
                                </div>
                                <div className="type">
                                    {strs ? nrs :"暂无可选"}
                                </div>
                                <div className="attach">
                                    {ath=="none" ? "无":"不计免赔"}
                                </div>
                                <div className="delete"  >
                                    <div className="close" onClick={ref.closeItem.bind(null,i,item.productName)}> </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
            });
            container =  <div>
                <div className="buyPage margin">
                    <div className="w900 margin">
                        <div className="topLogo">
                            <img src="images/logo_02.png" />
                        </div>
                        <div className="MenuItem_select" >
                            <table className="menuTable" >
                                <tbody>
                                <tr>
                                    <td style={{width:"45px", height:"32px"}}>&nbsp;</td>
                                    <td className="menuItems ">
                                        1&nbsp;<span>选购车险产品</span></td>
                                    <td className="menuImg"> <img src="images/menuRight1.png"   /> </td>
                                    <td className="menuItems item_select">
                                        2&nbsp;<span>完善报价单</span></td>
                                    <td className="menuImg"><img src="images/menuRight1.png"  /> </td>
                                    <td className="menuItems">
                                        3&nbsp;<span>投保确认</span></td>
                                    <td className="menuImg"><img src="images/menuRight1.png"  /> </td>
                                    <td className="menuItems">
                                        4&nbsp;<span>支付并获得保单</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="article" style={{padding: '50px 0px 2px 0px'}}>
                            <h3 className="font_15 text">制定您的车险计划单</h3>
                        </div>
                        <div className="carPlan">
                            <ul className="carPlan-detail-masthead clearfix">
                                <li className="id"></li>
                                <li className="what">产品名程</li>
                                <li className="type">产品类型</li>
                                <li className="attach">附加险</li>
                                <li className="delete">移除</li>
                            </ul>
                            {lrs}
                            {this.state.noIns == true? lrsNothing:null}
                        </div>
                        {this.state.jqx == 'y'?
                            <div>
                                <div className="article" style={{padding: '15px 0px 2px 0px'}}>
                                    <h3 className="font_15 text">填写您的交强险公司</h3>
                                </div>
                                <div className="jqxNum margin10">
                                    <label className="sect_title">已购买交强险的公司：</label>
                                    <label><input className="addHaveInsNum" type="text"/></label>
                                </div>
                            </div>:null}
                        <div className="article" style={{padding: '20px 0px 2px 0px'}}>
                            <h3 className="font_15 text">完善您的计划单信息</h3>
                        </div>
                        <div className="carPlanInfo">
                            <div className="sect_company margin10" >
                                <label className="sect_title">选择公司(可多选):</label>
                                <label style={{width:'650px'}}>
                                    {TRS}
                                </label>
                            </div>
                            <div  className="sect_car margin10" >
                                <label className="sect_title">选择被保车辆:</label>
                                <label>
                                    <select id="myCar"  onChange={this.getSelectCar} className="sect_myCar">
                                        <option value={0}>无(必须选择一辆汽车!)</option>
                                        {crs}
                                    </select>
                                </label>
                                <label style={{color:'#0093de'}}>若没有您需要的车辆信息，请点击新增车辆！</label>
                                <label >
                                    <form >
                                        <input onClick={this.addNewCar} className="createNew_car" type="button" defaultValue="新增车辆"/>
                                    </form>
                                </label>
                            </div>
                            <div className="sect_relative margin10" >
                                <label className="sect_title">选择被保险人:</label>
                                <label>
                                    <select  onChange={this.getSelectRelative} id="myRelative" className="sect_myRelative">
                                        <option value={0}>自己</option>
                                        {rrs}
                                    </select>
                                </label>
                                <label style={{color:'#0093de'}}>若没有您需要的人员信息，请点击新增人员！</label>
                                <label >
                                    <form >
                                        <input onClick={this.addNewMan} className="createNew_man" type="button" defaultValue="新增人员"/>
                                    </form>
                                </label>
                            </div>
                        </div>
                        <div style={{margin:'25px 0px 55px 410px'}} >
                            <input onClick={this.updateOrderInfo} className="nextTo" defaultValue="提交报价单" />
                        </div>

                    </div>
                </div>
                <Footer/>

                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='successModal'
                     data-backdrop="static"
                     data-keyboard="false"
                     style={{zIndex:1045}}
                >
                    <div className="modal-dialog modal-sm"
                         style={{position: 'absolute', top: '30%', width: '50%', marginLeft: '25%'}}>
                        <div className="modal-content"
                             style={{position: 'relative', width: '100%', padding: '40px'}}>

                            <div className="modal-body">
                                <div className="form-group" style={{position: 'relative'}}>
                                    <div>{'车险计划已经提交，请等待客服人员报价后在个人中心处查看！'}</div>
                                    <Link to={window.App.getAppRoute() + "/personalCenter"}>
                                        <input type='button' className="modalCloseBtn"  onClick={this.closeModal.bind(null,'successModal')} defaultValue="OK"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='addNewManModal'
                     data-backdrop="static"
                     data-keyboard="false"
                     style={{zIndex:1045}}
                >
                    <div className="modal-dialog modal-sm"
                         style={{position: 'absolute', top: '30%', width: '920px', marginLeft: '20%'}}>
                        <div className="modal-content"
                             style={{padding: '30px 0px 0px 0px', height: '530px'}}>
                            <div className="close" onClick={this.closeModal.bind(null,'addNewManModal')}> </div>
                            <div className="modal-body">
                                <div className="form-group" style={{position: 'relative'}}>
                                    <div >
                                        <AddRelatedPersonInfo customerId={this.state.customerId} flush={this.flush}/>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='addNewCarModal'
                     data-backdrop="static"
                     data-keyboard="false"
                     style={{zIndex:1045}}
                >
                    <div className="modal-dialog modal-sm"
                         style={{position: 'absolute', width: '900px',marginLeft: '20%', top: '15%'}}>
                        <div className="modal-content"
                             style={{padding: '50px 0px 0px 0px',height: '600px'}}>
                            <div className="close" onClick={this.closeModal.bind(null,'addNewCarModal')}> </div>
                            <div className="modal-body">

                                <div className="form-group" style={{position: 'relative'}}>
                                    <div >
                                        <AddRelatedCarInfo customerId={this.state.customerId} flush={this.flush}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='addInfoSuccessModal'
                     data-backdrop="static"
                     data-keyboard="false"
                     style={{zIndex:1045}}
                >
                    <div className="modal-dialog modal-sm"
                         style={{position: 'absolute', top: '30%', width: '50%', marginLeft: '25%'}}>
                        <div className="modal-content"
                             style={{position: 'relative', width: '100%', padding: '40px'}}>
                            <div className="modal-body">
                                <div className="form-group" style={{position: 'relative'}}>
                                    <div>{'信息已经提交，请选择以继续您的订单！'}</div>
                                    <input type='button' className="modalCloseBtn"  onClick={this.closeModal.bind(null,'addInfoSuccessModal')} defaultValue="OK"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        }else {
            this.initialData();
        }
        }else {
            container =
                <div>
                    <div style={{ textAlign: 'center', marginTop: '60px'}}>数据项为空，错误代码：404！</div>
                    <Link to={window.App.getAppRoute() + "/mainPage"}>
                        <div style={{fontSize: 'large', textAlign: 'center', marginTop: '60px'}}>返回首页</div>
                    </Link>
                </div>
        }
        return container;
    }
});
module.exports = CarInsuranceBuyPage;
