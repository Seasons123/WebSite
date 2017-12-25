import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import '../../../css/insurance/components/commonTopSupnuevo.css';
import '../../../css/insurance/components/navcontent.css';
import '../../../css/insurance/components/pagination.css';
import '../../../css/insurance/components/productIntroduction.css';
import '../../../css/insurance/components/buyPage.css';
import AddRelatedPersonInfo from './AddRelatedPersonInfo.jsx';
import Footer from '../modules/Footer';
var SyncStore = require('../../../components/flux/stores/SyncStore');
var ProxyQ = require('../../../components/proxy/ProxyQ');
var LifeInsuranceBuyPage = React.createClass({
    getInsurant:function(){
        var url="/func/insurance/getInsurant";

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
    getCompany:function (elementId) {
        if(elementId!="childCompany1") {
            var a = elementId.substr(0, 12);
            var b = elementId.substr(12, 13);
            var item = a + (parseInt(b) - 1).toString();
            var compId = $('#' + item + ' option:selected').val();
        }
        if(compId==-1||compId=="-1"){
            alert("请选择要的投保公司！")
        }else {
            if(compId==undefined){
                var id=this.state.companyId;
                var url = "/func/insurance/getChildCompany";
                var params = {
                    companyid: id
                };
                ProxyQ.query(
                    'post',
                    url,
                    params,
                    null,
                    function (ob) {
                        this.setState({company: ob.data});

                    }.bind(this),

                    function (xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                );
            }else {
                var url = "/func/insurance/getChildCompany";
                var params = {
                    companyid: compId
                };
                ProxyQ.query(
                    'post',
                    url,
                    params,
                    null,
                    function (ob) {
                        if(ob.data=="fail"){
                                var exam = document.getElementById(elementId);
                                exam.innerHTML=null;
                                var crs ="<option key={'company'+"+ -1+"} value="+0+">"+"无"+"</option>";
                                exam.innerHTML +=crs;

                        }else{
                            var company = ob.data;
                            var exam = document.getElementById(elementId);
                            exam.innerHTML="<option value=-1>请选择！</option>";
                            company.map(function (item, i) {
                                exam = document.getElementById(elementId);
                                var crs ="<option key={'company'+"+ i+"} value="+item.companyId+">"+item.companyName+"</option>";
                                exam.innerHTML +=crs;

                            })
                        }
                    }.bind(this),

                    function (xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                );
            }

        }
    },
    getSelectedInsurant:function(){
        var selected=$('#Insurant option:selected').val();
        this.state.selectInsurant=selected;
    },
    getSelectBenefit:function () {
        var selected=$('#benefit option:selected').val();
        this.state.selectBenefit=selected;
    },
    getSelectInsFeeType:function () {
        var selected=$('#insFeeType option:selected').val();
        this.state.selectInsFeeType=selected;
    },
    getSelectSocietyIns:function () {
        var selected=$('#societyIns option:selected').val();
        this.state.selectSocietyIns=selected;
    },
    getSelectBusinessIns:function () {
        var selected=$('#businessIns option:selected').val();
        this.state.selectBusinessIns=selected;
    },
    getSelectLegalBenefit:function () {
       if($('#legalBenefit').get(0).checked==true){
           $('#benefit').attr("disabled", "disabled");
           $('#createNewMan2').attr("disabled","disabled");
           this.state.selectLegalBenefit=1;
       }else {
           $('#benefit').removeAttr( "disabled");
           $('#createNewMan2').removeAttr("disabled");
           this.state.selectLegalBenefit=0;
       }
    },
    computeAttachInsFee:function (i,productId,insuranceQuota) {

            if ($('#baseAttachInsFee' + i).val() % insuranceQuota == 0 &&
                $('#baseAttachInsFee' + i).val() != 0) {
                if ($('#attachInsFeeCompute' + i).val() == "修改") {
                    var a = parseFloat($('#finalInsFee').attr("placeholder")) -
                        parseFloat($('#attachInsFeeResult' + i).attr("placeholder"));
                    $('#finalInsFee').attr("placeholder", a);
                    $('#attachInsFeeResult' + i).attr("placeholder", "")
                    $('#attachInsFeeCompute' + i).attr("value", "计算保费");
                    $('#baseAttachInsFee' + i).removeAttr("disabled");
                    var q = this.state.attachInsIds;
                    var c = [];
                    q.map(function (item, i) {
                        var id = parseInt(item.substr(0, 3));
                        if (id == productId) {
                            q[i] = null;
                        }
                    })
                    q.map(function (item, i) {
                        if (item != null) {
                            c.push(item);
                        }
                    });
                    this.state.attachInsIds = c;
                } else {
                    var attachQuota = null;
                    var attachInsFee = $('#baseAttachInsFee' + i).val();
                    var a = attachInsFee / insuranceQuota;
                    var url = "/func/insurance/getMeasure";
                    var params = {
                        productId: productId,
                        val: a,
                        payYears: this.state.selectInsFeeType,
                        personId: this.state.selectInsurant
                    };
                    ProxyQ.query(
                        'post',
                        url,
                        params,
                        null,
                        function (ob) {
                            $('#attachInsFeeResult' + i).attr("placeholder", ob.data);
                            $('#attachInsFeeCompute' + i).attr("value", "修改");
                            $('#baseAttachInsFee' + i).attr("disabled", "disabled");
                            var c = parseFloat($('#finalInsFee').attr("placeholder")) + ob.data;
                            $('#finalInsFee').attr("placeholder", c);
                            attachQuota = ob.data / a;
                            var b = productId.toString() + "," + $('#baseAttachInsFee' + i).val().toString() + "," + attachQuota.toString();
                            this.state.attachInsIds.push(b);
                        }.bind(this),
                        function (xhr, status, err) {
                            console.error(this.props.url, status, err.toString());
                        }.bind(this)
                    );

                }
            } else {
                alert("本产品最低保额为" + insuranceQuota + ",请您输入其整数倍的数字进行投保！");
            }

    },
    onSaveInput:function(event){

        this.setState({value: event.target.value});

    },
    insFeeCompute:function (productId,value,insuranceQuota) {
        if($('#childCompany1  option:selected').val()==-1||
            $('#childCompany1  option:selected').val()=="-1"||
            ($('#childCompany1  option:selected').val()!=-1&&
            $('#childCompany2  option:selected').val()==-1)
        ){
            alert("请您选择要投保的公司！");
        }else {

            if($('#childCompany1  option:selected').val()!=-1&&
                $('#childCompany2  option:selected').val()!=-1&&
                $('#childCompany3  option:selected').val()==0){
                this.state.selectCompany=$('#childCompany2  option:selected').val();
            }else{
                this.state.selectCompany=$('#childCompany1  option:selected').val();
            }
            var a = value / insuranceQuota;
            if ($('#insBasicFee').val() % insuranceQuota == 0 &&
                $('#insBasicFee').val() != 0) {
                var personId = this.state.selectInsurant;
                var fit = this.state.insInfo.insuranceLifeProduct.fitPeople;
                var ns = fit.split("-");
                var start = ns[0].replace(/[^0-9]/ig, "");
                var final = ns[1].replace(/[^0-9]/ig, "");

                var n = this.state.attachIns.length;
                if ($('#insFeeCompute').val() == "修改") {
                    for (var i = 0; i < n; i++) {
                        $(this.refs["attach" + i]).attr("disabled", "disabled");//禁止附加险
                        $(this.refs["attach" + i]).attr("checked", false);
                        $('#addInsModal' + i).attr("hidden", true);
                        $('#attachInsFeeResult' + i).attr("placeholder", "");//重置附加险
                        $('#attachInsFeeCompute' + i).attr("value", "计算保费");
                        $('#baseAttachInsFee' + i).removeAttr("disabled");
                        this.state.attachInsIds = [];

                    }
                    $('#insFeeCompute').attr("value", "计算保费");
                    $('#Insurant').removeAttr("disabled");
                    $('#insFeeType').removeAttr("disabled");
                    $('#insBasicFee').removeAttr("disabled");
                    $('#benefit').removeAttr("disabled");
                    $('#legalBenefit').removeAttr("disabled");
                    $('#legalBenefit').attr("checked",false);
                    $('#societyIns').removeAttr("disabled");
                    $('#businessIns').removeAttr("disabled");
                    $('#childCompany1').removeAttr("disabled");
                    $('#childCompany2').removeAttr("disabled");
                    $('#childCompany3').removeAttr("disabled");
                    $('#createNewMan1').removeAttr("disabled");
                    $('#createNewMan2').removeAttr("disabled");
                    $('#finalInsFee').attr("placeholder", "0.0");
                    this.setState({"measure": null});
                    // $(this.refs[""]).removeAttr("disabled");//保险费
                } else {
                    for (var i = 0; i < n; i++) {
                        $(this.refs["attach" + i]).removeAttr("disabled");//开放附加险
                    }
                    $('#Insurant').attr("disabled", "disabled");
                    $('#insFeeType').attr("disabled", "disabled");
                    $('#insBasicFee').attr("disabled", "disabled");
                    $('#benefit').attr("disabled", "disabled");
                    $('#legalBenefit').attr("disabled","disabled");
                    $('#societyIns').attr("disabled", "disabled");
                    $('#businessIns').attr("disabled", "disabled");
                    $('#childCompany1').attr("disabled", "disabled");
                    $('#childCompany2').attr("disabled", "disabled");
                    $('#childCompany3').attr("disabled", "disabled");
                    $('#createNewMan1').attr("disabled","disabled");
                    $('#createNewMan2').attr("disabled","disabled");

                    // $(this.refs[""]).attr("","");//保险费
                    //查询保费
                    var url = "/func/insurance/getMeasure";
                    var params = {
                        productId: productId,
                        val: a,
                        payYears: this.state.selectInsFeeType,
                        personId: this.state.selectInsurant
                    };
                    ProxyQ.query(
                        'post',
                        url,
                        params,
                        null,
                        function (ob) {
                            this.setState({measure: ob.data});
                            $('#insFeeCompute').attr("value", "修改");
                            $('#finalInsFee').attr("placeholder", ob.data);
                        }.bind(this),
                        function (xhr, status, err) {
                            console.error(this.props.url, status, err.toString());
                        }.bind(this)
                    );
                }
            } else {
                alert("本产品最低保额为" + insuranceQuota + ",请您输入其整数倍的数字进行投保！")
            }
        }
    },
    showInsAddDetail:function (n,id) {

        if($('#attach'+n).get(0).checked==true){
            $('#addInsModal'+n).removeAttr("hidden");
        }else {
            $('#addInsModal'+n).attr("hidden",true);
            if($('#attachInsFeeResult' + n).attr("placeholder")!=""&&
                $('#attachInsFeeResult' + n).attr("placeholder")!=null){
                var a=parseFloat($('#finalInsFee').attr("placeholder"))-//重置缴费数额
                    parseFloat($('#attachInsFeeResult' + n).attr("placeholder"));
                $('#finalInsFee').attr("placeholder",a);
            }

            $('#attachInsFeeResult' + n).attr("placeholder", "");//重置附加险
            $('#attachInsFeeCompute' + n).attr("value", "计算保费");
            if(this.state.attachInsIds!=null&&this.state.attachInsIds!=undefined&&this.state.attachInsIds.length!=0){
                var q=this.state.attachInsIds;
                var c=[];
                q.map(function (item,i) {
                    var b=parseInt(item.substr(0,3));
                    if(b==id){
                        q[i]=null;
                    }
                });
                q.map(function(item,i){
                    if(item!=null) {
                        c.push(item);
                    }
                });
                this.state.attachInsIds=c;

            }


        }

    },
    createLifeInsOrder:function (productId) {
        var flag=0;
        if($('#insFeeCompute').val() == "修改"){

            $("#addInsPro input:checkbox:checked").each(function (index, domEle) {
                if ($('#attachInsFeeCompute' + index).attr("value")!="修改"){
                    flag=1;
                }
            });
            if (flag==1){
                alert("附加险保费未计算！")
            }else{
                if(this.state.attachInsIds!=null) {
                    var attachInsIds = "";
                    this.state.attachInsIds.map(function (item, i) {
                        attachInsIds += item + ";";
                    })
                }
                var url = "/func/insurance/createInsuranceLifeOrder";
                var params = {
                    productId: productId,
                    payYears: this.state.selectInsFeeType,
                    insurancederId: this.state.selectInsurant,
                    measure:this.state.value,
                    businessIns:this.state.selectBusinessIns,
                    societyIns:this.state.selectSocietyIns,
                    benefiterId:this.state.selectBenefit,
                    attachInsIds:attachInsIds,
                    childCompany:this.state.selectCompany,
                    legalBenefit:this.state.selectLegalBenefit

                };
                ProxyQ.query(
                    'post',
                    url,
                    params,
                    null,
                    function (ob) {
                        if(ob.data=="success"){
                            var successModal = this.refs['successModal'];
                            $(successModal).modal('show');
                        }
                    }.bind(this),
                    function (xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                );
            }
        }else{
            alert("主险保费未计算！")
        }

    },
    initialData:function(){
        this.getInsurant();
        this.getCompany("childCompany1");
    },
    getInitialState: function() {
        var temporaryStore=SyncStore.getPageData();
        if(temporaryStore[0]==null||temporaryStore[0]==undefined
            ||temporaryStore[1]==null||temporaryStore[1]==undefined){
            return{
                mainPage:0
            }
        }else {
            var insInfo = temporaryStore[0];
            var attachIns = temporaryStore[1];
            SyncStore.setPageData(null);
            SyncStore.setRouter(null);
            return {
                selectInsurant: 0,
                selectBenefit: 0,
                selectSocietyIns: 0,
                selectBusinessIns: 0,
                selectInsFeeType: 2,
                insInfo: insInfo,
                attachIns: attachIns,
                measure: null,
                attachInsIds: [],
                companyId:insInfo.insuranceLifeProduct.companyId,
                selectCompany:null,
                selectLegalBenefit:null
            }
        }
    },
    closeModal:function(ob){ //保存跳转的页面信息
        var Modal = this.refs[ob];
        $(Modal).modal('hide');

    },
    addNewMan:function () {
        var addNewManModal = this.refs['addNewManModal'];
        $(addNewManModal).modal('show');
    },
    render:function () {

        var container = null;
        if(this.state.mainPage ==undefined){
            if (this.state.data !== null && this.state.data !== undefined) {
                var productName = this.state.insInfo.insuranceLifeProduct.productName;
                var safeGuardPeriod = this.state.insInfo.safeGuardPeriod;
                var paymentType = this.state.insInfo.paymentType;
                var productId = this.state.insInfo.productId;
                var paymentPeriod = this.state.insInfo.paymentPeriod;
                var insuranceQuota = this.state.insInfo.insuranceLifeProduct.insuranceQuota;
                var attach = this.state.attachIns;
                var attach_item = [];
                var ref = this;
                attach.map(function (item, i) {
                    attach_item.push(
                        <div key={i}>
                                <span >
                                    <input type="checkbox" onChange={ref.showInsAddDetail.bind(null, i, item.productId)}
                                           ref={'attach' + i} id={'attach' + i} disabled="disabled"/>
                                    附加：{item.productName}
                                </span>
                            <span style={{color: 'blue', paddingLeft: '5px'}}>被保人年龄范围在28 天-55周岁之间方可附加本险种</span>
                            <div id={"addInsModal" + i} hidden="hidden">
                                <table className="planContain insAdd">
                                    <tbody>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">基本保险金额：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <input id={"baseAttachInsFee" + i} type="text"/>
                                        </td>
                                        <td className="plan_td_3">&nbsp;
                                            <span >*</span>
                                            <span style={{color: 'red', paddingLeft: '5px'}}></span>
                                            <input id={"attachInsFeeCompute" + i} style={{padding: '2.5px 10px'}}
                                                   type="button" defaultValue="计算保费"
                                                   onClick={ref.computeAttachInsFee.bind(null, i, item.productId, item.insuranceQuota)}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">保险费：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <input style={{borderStyle: 'none'}} disabled="disabled"
                                                   id={"attachInsFeeResult" + i} type="text"/>
                                        </td>
                                        <td ></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td colSpan="4" style={{textAlign: 'left', color: 'blue'}}>被保人年龄范围在28
                                            天-55周岁之间方可附加本险种！
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })
                var data = this.state.data;
                var rrs = [];//相关人员项
                var myRelative = data;
                myRelative.map(function (item, i) {
                    rrs.push(
                        <option key={i} value={item.personId}>{item.perName}</option>
                    )
                });
                var company = this.state.company;
                var crs = [];
                company.map(function (item,i) {
                    crs.push(
                        <option key={"company"+i} value={item.companyId}>{item.companyName}</option>
                    )
                });
                container = <div>
                    <div className="buyPage margin">
                        <div className="w900 margin">
                            <div className="topLogo">
                                <img src="images/logo_02.png"/>
                            </div>
                            <div className="MenuItem_select">
                                <table className="menuTable">
                                    <tbody>
                                    <tr>
                                        <td style={{width: "45px", height: "32px"}}>&nbsp;</td>
                                        <td className="menuItems ">
                                            1&nbsp;<span>选择保险计划</span></td>
                                        <td className="menuImg"><img src="images/menuRight1.png"/></td>
                                        <td className="menuItems item_select">
                                            2&nbsp;<span>填写投保信息</span></td>
                                        <td className="menuImg"><img src="images/menuRight1.png"/></td>
                                        <td className="menuItems">
                                            3&nbsp;<span>投保确认</span></td>
                                        <td className="menuImg"><img src="images/menuRight1.png"/></td>
                                        <td className="menuItems">
                                            4&nbsp;<span>支付并获得保单</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="insuranceName">
                        <span className="nameTitle" style={{
                            paddingLeft: '50px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'rgb(44, 126, 235)'
                        }}>
                            {productName}</span>
                            </div>
                            <div className="insurancePlan">
                                <div className="article">
                                    <h3 className="font_15 text">填写您的保险计划</h3>
                                </div>
                                <table className="planContain">
                                    <tbody>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">被保险人：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <select style={{width: '130px'}} onChange={this.getSelectedInsurant}
                                                    id="Insurant">
                                                <option value={0}>自己</option>
                                                {rrs}
                                            </select>
                                        </td>
                                        <td className="plan_td_3">&nbsp;
                                            <span style={{color: 'red'}}>*</span>
                                            <span id="insBirthday_err"
                                                  style={{fontSize: 'smaller'}}>若没有您需要的人员信息，请点击新增人员！</span>
                                            <label >
                                                <form >
                                                    <input onClick={this.addNewMan} className="createNew_man" id="createNewMan1" type="button" defaultValue="新增人员"/>
                                                </form>
                                            </label></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">受益人：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <span><input type="checkbox" id="legalBenefit" onChange={this.getSelectLegalBenefit}/>选用法定受益人</span>
                                        </td>
                                        <td className="plan_td_3">&nbsp;
                                            <span style={{color: 'red'}}>*</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1"></td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <select style={{width: '130px'}} onChange={this.getSelectBenefit}
                                                    id="benefit">
                                                <option value={0}>自己</option>
                                                {rrs}
                                            </select>
                                        </td>
                                        <td className="plan_td_3">&nbsp;
                                            <span style={{color: 'red'}}>*</span>
                                            <span id="insBirthday_err"
                                                  style={{fontSize: 'smaller'}}>若没有您需要的人员信息，请点击新增人员！</span>
                                            <label >
                                                <form >
                                                    <input onClick={this.addNewMan} className="createNew_man" id="createNewMan2" type="button" defaultValue="新增人员"/>
                                                </form>
                                            </label></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">公司选择：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                                <select style={{width: '130px'}} id="childCompany1" onChange={this.getCompany.bind(null,"childCompany2")}>
                                                    <option value={-1}>请选择！</option>
                                                    {crs}
                                                </select>
                                        </td>
                                        <td className="plan_td_3">
                                            <select style={{width: '130px'}} id="childCompany2" onChange={this.getCompany.bind(null,"childCompany3")}>
                                                <option value={-1}>请选择！</option>
                                            </select>
                                            <span style={{marginLeft:'22px'}}></span>
                                            <select style={{width: '130px'}} id="childCompany3">

                                            </select>
                                            <span style={{color: 'red',marginLeft:'22px'}}>*</span></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">保障期限：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            {safeGuardPeriod}
                                        </td>
                                        <td ></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">缴费方式：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            {paymentType}
                                        </td>
                                        <td ></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">缴费期间：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <select style={{width: '130px'}} onChange={this.getSelectInsFeeType}
                                                    id="insFeeType" name="user_feeType">
                                                <option value={2}>5年</option>
                                                <option value={3}>10年</option>
                                                <option value={4}>15年</option>
                                                <option value={5}>20年</option>
                                            </select>

                                        </td>
                                        <td className="plan_td_3"><span style={{color: 'red'}}>*</span></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">有无社会保险：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <select style={{width: '130px'}} onChange={this.getSelectSocietyIns}
                                                    id="societyIns" name="user_feeType">
                                                <option value={0}>无</option>
                                                <option value={1}>有</option>
                                            </select>
                                        </td>
                                        <td className="plan_td_3"><span style={{color: 'red'}}>*</span></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">有无商业保险：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <select style={{width: '130px'}} onChange={this.getSelectBusinessIns}
                                                    id="businessIns" name="user_feeType">
                                                <option value={0}>无</option>
                                                <option value={1}>有</option>
                                            </select>
                                        </td>
                                        <td className="plan_td_3"><span style={{color: 'red'}}>*</span></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">基本保险金额：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <input id="insBasicFee" onChange={this.onSaveInput} type="text"
                                                   name="user_BasicFee"/>
                                        </td>
                                        <td className="plan_td_3">&nbsp;
                                            <span style={{color: 'red'}}>*</span>
                                            <span id="insBirthday_err"
                                                  style={{color: 'red', paddingLeft: '5px'}}></span>
                                            <input id="insFeeCompute"
                                                   onClick={this.insFeeCompute.bind(null, productId, this.state.value, insuranceQuota)}
                                                   style={{padding: '2.5px 10px'}} type="button" name="user_compute"
                                                   defaultValue={"计算保费"}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">保险费：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            {this.state.measure}
                                        </td>
                                        <td ></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className="insWarn">
                                    本合同最低基本保险金额：0-49周岁（含）为5万元保额，50周岁-55周岁（含） 3万元保额。基本保险金额以万元为递增单位。
                                </div>
                                <div className="article">
                                    <h3 className="font_15 text">选择您的附加产品</h3>
                                </div>
                                <div className="addInsPro" id="addInsPro">
                                    {attach_item}
                                </div>
                                <table className="planContain" style={{marginTop: '40px'}}>
                                    <tbody>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    <tr className="plan_tr">
                                        <td className="plan_td_1">缴纳费用：</td>
                                        <td width="5px"></td>
                                        <td className="plan_td_2">
                                            <input style={{borderStyle: 'none'}} disabled="disabled" id="finalInsFee"
                                                   placeholder="0.0" type="text"/>
                                        </td>
                                        <td width="360px"></td>
                                    </tr>
                                    <tr>
                                        <td className="plan_line" colSpan="4"></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div style={{margin: '25px 0px 45px 365px'}}>
                                    <input className="nextTo" onClick={this.createLifeInsOrder.bind(null, productId)}
                                           defaultValue="提交计划"/>
                                </div>
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
                         style={{zIndex: 1045}}
                    >
                        <div className="modal-dialog modal-sm"
                             style={{position: 'absolute', top: '30%', width: '50%', marginLeft: '25%'}}>
                            <div className="modal-content"
                                 style={{position: 'relative', width: '100%', padding: '40px'}}>

                                <div className="modal-body">
                                    <div className="form-group" style={{position: 'relative'}}>
                                        <div>{'寿险计划已经提交，请等待客服人员报价后在个人中心处查看！'}</div>
                                        <Link to={window.App.getAppRoute() + "/personalCenter"}>
                                            <input type='button' className="modalCloseBtn"
                                                   onClick={this.closeModal.bind(null, 'successModal')} value="OK"/>
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
                                <div className="close" onClick={this.closeModal.bind(this,'addNewManModal')}> </div>
                                <div className="modal-body">
                                    <div className="form-group" style={{position: 'relative'}}>
                                        <div >
                                            <AddRelatedPersonInfo customerId={this.state.customerId} flush={this.initialData}/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            } else {
                this.initialData();
            }
        } else {
            container =
                <div>
                    <div style={{textAlign: 'center', marginTop: '60px'}}>数据项为空，错误代码：404！</div>
                    <Link to={window.App.getAppRoute() + "/mainPage"}>
                        <div style={{fontSize: 'large', textAlign: 'center', marginTop: '60px'}}>返回首页</div>
                    </Link>
                </div>
        }
        return container;
    }






});
module.exports=LifeInsuranceBuyPage;