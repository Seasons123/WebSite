import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

import '../../../css/insurance/components/productIntroduction.css';
var SyncStore = require('../../../components/flux/stores/SyncStore');
var ProxyQ = require('../../../components/proxy/ProxyQ');
var info={};

var CarInsurance = React.createClass({
    sendPageDate:function () {

            var temporaryStore=[];
            temporaryStore.push(this.state.buyName);
            temporaryStore.push(this.state.buyCheck);
            temporaryStore.push(this.state.jqx);
            SyncStore.setPageData(temporaryStore);
            SyncStore.setRouter('carInsuranceBuyPage');
    },
    getInitialState: function() {

        return {
            proNum:1,
            buyName:[],
            buyCheck:[],
            jqx:null
        }
    },
    checkJQX:function(){
            var item2=null;
            var check=null;
            $('#jqx input:radio:checked').each(function (index, domEle) {
               item2= $(domEle).val();
            });
            if(item2!=null){
                if(item2=='n'){
                    if(this.state.jqx!=='n'){
                        this.state.buyName.push("交强险");
                        this.state.buyCheck.push(['交强险','none']);
                        $(this.refs["nextTo"]).removeAttr("disabled");
                        $(this.refs["nextTo"]).attr("style","");
                        this.setState({jqx:item2});
                    }

                }else {
                    if(this.state.buyName.length!=0){
                        var buy=this.state.buyName;
                        buy.map(function(item,i){
                          if(item=='交强险'){
                              buy[i]=null;
                              check=true;
                          }
                        })
                        var buyName=[];
                        buy.map(function (item,i) {
                            if(item!=null){
                                buyName.push(item);
                            }

                        })
                        this.state.buyName=buyName;
                        if(check==true){
                            var bc=this.state.buyCheck;
                            bc.map(function(item,i){
                                if(item[0]=='交强险'){
                                    bc[i]=null;
                                }
                            })
                            var bck=[];
                            bc.map(function (item,i) {
                                if(item!=null){
                                    bck.push(item);
                                }

                            })
                            this.state.buyCheck=bck;
                        }

                        if(this.state.buyName.length!=0){
                            $(this.refs["nextTo"]).removeAttr("disabled");
                            $(this.refs["nextTo"]).attr("style","");
                            this.setState({jqx:item2});
                        }else {
                            if(check==true){
                                $(this.refs["nextTo"]).attr("disabled",true);
                                $(this.refs["nextTo"]).attr("style","background:darkgrey");
                                this.setState({jqx:item2});
                                $('#jqx input:radio:checked').each(function (index, domEle) {
                                    $(domEle).attr("checked",false);
                                });
                            }
                        }
                    }else {
                        alert('您为选购任何产品！');
                        $('#jqx input:radio:checked').each(function (index, domEle) {
                            $(domEle).attr("checked",false);
                        });
                    }
                }

            }else {
                alert("请选择是否拥有交强险！");
            }
    },
    changeBuyState:function(num,productName) {
        var step =null;
        var items = this.refs[num];
        var ref=this;
        if(productName=='玻璃单独破碎险'||productName=='车身划痕损失险'||productName=='自燃损失险'
            ||productName=='车损险无法找到第三方'||productName=='新增设备损失险'||productName=='发动机涉水损失险'){
            if(this.state.buyName.length!=0){
                this.state.buyName.map(function(item,i){
                    if(item=="车辆损失险"){
                        step=true;
                    }
                });
                if(step!=true){
                    alert("此险种不可单独购买！请先购买“车损险”，谢谢！");
                }
            }else{
                alert("此险种不可单独购买！请先购买“车损险”，谢谢！");
            }

        }else{
            if(productName=='车上人员责任险（乘客）'||productName=='车上人员责任险（驾驶员）')
            {
                if(this.state.buyName.length!=0) {
                    this.state.buyName.map(function (item, i) {
                        if (item == "第三者责任险") {
                            step = true;
                        }
                    });
                    if(step!=true){
                        alert("此险种不可单独购买！请先购买“第三者责任险”，谢谢！");
                    }
                }else{
                    alert("此险种不可单独购买！请先购买“第三者责任险”，谢谢！");
                }
            }
            else{
                step=true;
            }
        }
        if(step==true){
            //购买项
            if(this.state.buyName.length==0){
                this.state.buyName.push(productName);
                // this.state.buyName.push("交强险");

            }else{
                var q=this.state.buyName;

                var op=false;
                var c=[];
                q.map(function(item,i){
                    if(item==productName) {
                        if(productName=='车辆损失险'){
                            q.map(function(item,i){
                                if(item=="玻璃单独破碎险"||item=='车身划痕损失险'||item=='自燃损失险'
                                    ||item=='车损险无法找到第三方'||item=='新增设备损失险'||item=='发动机涉水损失险'){
                                    q[i]=null;
                                }
                            });
                        }else{if(productName=='第三者责任险'){
                            q.map(function(item,i){
                                if(item=="车上人员责任险（乘客）"||item=='车上人员责任险（驾驶员）'){
                                    q[i]=null;
                                }
                            });
                        }}
                        q[i]=null;
                        op=true;
                    }else{
                        if(op==false){
                            if(i==ref.state.buyName.length-1){
                                q.push(productName);
                            }
                        }
                    }
                });
                q.map(function(item,i){
                    if(item!=null) {
                        c.push(item);
                    }
                });
                this.state.buyName=c;
            }
            //购买项的不计免赔项
            if(this.state.buyCheck.length==0){
                if($(items).find(attach)[0]!=undefined){
                    var check=$(items).find(attach)[0].checked;
                    this.state.buyCheck.push([productName,check,num]);
                }else{
                    this.state.buyCheck.push([productName,'none',num]);
                }
                // this.state.buyCheck.push(['交强险','none']);
            }else {
                var p = this.state.buyCheck;
                var a = $(items).find(attach)[0];
                var b =[];
                var operate=false;
                p.map(function (item,i) {
                    if(item[0]==productName){
                        if(productName=='车辆损失险'){
                            p.map(function(item,i){
                                if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'||item[0]=='自燃损失险'
                                    ||item[0]=='车损险无法找到第三方'||item[0]=='新增设备损失险'||item[0]=='发动机涉水损失险'){
                                    p[i][1]=null;
                                    $(ref.refs[p[i][2]]).attr("style", "");
                                    $(ref.refs[p[i][2]]).attr("value","0");
                                    ref.setState({proNum:ref.state.proNum-1});
                                }
                            });
                        }else{if(productName=='第三者责任险'){
                            p.map(function(item,i){
                                if(item[0]=="车上人员责任险（乘客）"||item[0]=='车上人员责任险（驾驶员）'){
                                    p[i][1]=null;
                                    $(ref.refs[p[i][2]]).attr("style", "");
                                    $(ref.refs[p[i][2]]).attr("value","0");
                                    ref.setState({proNum:ref.state.proNum-1});
                                }
                            });
                        }}
                        p[i]=null;
                        operate=true;
                    }else{
                        if(operate==false){
                            if(i==ref.state.buyCheck.length-1){
                                if(a!=undefined){
                                    var check=a.checked;
                                    p.push([productName,check,num]);
                                }else{
                                    p.push([productName,'none',num]);
                                }
                            }
                        }
                    }
                });
                p.map(function(item,i){
                    if(item!=null&&item[1]!=null) {
                        b.push(item);
                    }
                });
                this.state.buyCheck=b;
            }

            var val=$(items).attr("value");
            var p = document.getElementById("XG"+num);

            if(val=='0'){
                $(items).attr("style", "background: #c4f4a1");
                $(items).attr("value","1");
                p.innerHTML = "取消";
                //this.setState({proNum:this.state.proNum+1});
            }else{
                $(items).attr("style", "");
                $(items).attr("value","0");
                //this.setState({proNum:this.state.proNum-1});
                p.innerHTML = "选购";
            }
            this.setState({proNum: this.state.buyName.length});
        }

    },
    initialData:function(){

        window.setTimeout(function () {

            this.setState({
                data:info.data
            })
        }.bind(this), 300);

    },
    getCarInsurances:function(){
        var url="/func/insurance/getInsuranceCarProduct";

        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                info=ob;
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    render: function () {
        var container=null;
        if(this.state.data!==undefined&&this.state.data!==null) {
            var trs = [];
            var jqx = [];
            var data = this.state.data;
            var ref=this;
            data.map(function (item, i) {
                if(item.productName=='交强险'){
                    jqx.push(
                    <div className="visual" key={i}>
                        <h3 className="font_15 text" style={{marginBottom: '10px'}}>重要通告声明</h3>
                        <p style={{color:'#0176cf'}}>
                        交强险为车险基础保障险,本如若您需要在本公司购买车险产品,本公司将默认您选购交强险!您如果已在他处购买交强险,请继续您的购买,在接下订单页面中,请务必填写已购交强险订单号并自行取消订单中的交强险!谢谢合作!</p>
                        <p><span style={{color:'#168750',fontWeight:'600'}}>交强险简介:</span>{item.description}</p>

                    </div>
                    )
                }
                else{
                    if(item.productName=='玻璃单独破碎险'||item.productName=='车损险无法找到第三方'){
                        trs.push(
                        <p className="carPro" key={i} value="0" ref={i}>
                            <label className="title">{item.productName}</label>
                            <span style={{paddingLeft:'3px',fontWeight:'800',fontSize: 'inherit'}}>简介:</span>
                            <textarea disabled="disabled" className="longtxt" value={item.description}></textarea>
                            <label className="checkLab" style={{height: '30px'}}>
                            </label>
                            <span className="buyCar">
                                <a id={"XG"+i} onClick={ref.changeBuyState.bind(null,i,item.productName)}>选购</a>
                            </span>
                        </p>
                    )
                    }else{
                        trs.push(
                        <p className="carPro" key={i} value="0" ref={i}>
                            <label className="title">{item.productName}</label>
                            <span style={{paddingLeft:'3px',fontWeight:'800',fontSize: 'inherit'}}>简介:</span>
                            <textarea disabled="disabled" className="longtxt" value={item.description}></textarea>
                            <label className="checkLab" >
                                <input id="attach" type="checkbox"  defaultChecked={true}/>
                                <span className="checkText">不计免赔</span>
                            </label>
                            <span className="buyCar">
                                <a id={"XG"+i} onClick={ref.changeBuyState.bind(null,i,item.productName)}>选购</a>
                            </span>
                        </p>
                        )
                    }

                }
            });
        }else{
            this.initialData();
        }
        switch (this.state.nav) {
            case undefined:
                container=
                    <div >
                        <div className="w1008 margin mar_20" onLoad={this.getCarInsurances()}>
                            <div className="pro_L " style={{float:'left'}}>

                            </div>
                            <div className="pro_R fr bg" style={{width:'1035px'}}>
                                <div className="pro_bg">
                            <span className="fr pad_L">您的位置： <a href="home.jsp">主页</a> &gt; 汽车保险 &gt;</span>
                                </div>

                                <div className="article">
                                    {jqx}
                                    <div className="productDetails">
                                        <div className="car_mframe">
                                            <div className="car_mcontent">
                                                <div className="result">
                                                    <div className="pro_detail_list">

                                                        <div className="car">
                                                            <fieldset>
                                                                {trs}
                                                            </fieldset>
                                                        </div>
                                                        <div className="car_btm_area">
                                                            <div className="pointline"></div>

                                                            <div className="btm_btn">
                                                                <div className="detail_btn_input">
                                                                    {SyncStore.getNote() ?
                                                                    <Link to={window.App.getAppRoute() + "/carInsuranceBuyPage"}>
                                                                        <input className="nextTo" ref="nextTo" type="button" style={{background: 'darkgrey'}} onClick={this.sendPageDate()} disabled="true" value="下一步" />
                                                                    </Link> :
                                                                    <Link to={window.App.getAppRoute() + "/login"}>
                                                                        <input className="nextTo" ref="nextTo" type="button" style={{background: 'darkgrey'}} onClick={this.sendPageDate()} disabled="true" value="下一步" />
                                                                    </Link>}
                                                                </div>
                                                            </div>
                                                            <div id="jqx" style={{float:'right',margin: '12px 12px'}} onClick={this.checkJQX}>
                                                            我已在他处购买交强险<input id="jqxY" type="radio" style={{margin: '0px 15px 2px 5px'}} name="jqx" value='y' />
                                                            我尚未拥有交强险<input id="jqxN" type="radio" style={{margin: '0px 15px 2px 5px'}} name="jqx" value='n' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grayline"></div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            default :
                break;
        }
        return container;
    }

});
module.exports = CarInsurance;
