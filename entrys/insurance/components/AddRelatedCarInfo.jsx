/**
 * Created by douxiaobin on 2017/03/07.
 */
import React from 'react';
import { render } from 'react-dom';

import Calendar from '../../../components/basic/Calendar.jsx';
import carData from '../data/carData.json';

var today=new Date().toLocaleDateString().replace("/", "-").replace("/", "-");

var ProxyQ = require('../../../components/proxy/ProxyQ');

var AddRelatedCarInfo=React.createClass({

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

    checkBoxChange:function(ob){ //根据是否是车主 和是否是过户二手车显示 车主身份证 和 过户日期
        switch(ob){
            case 'isOwner':
                var addCarInfo=this.refs.addCarInfo;
                var value=$(addCarInfo).find("input[name='isOwner']:checked").val();
                if(value!==undefined && value!==null) {
                    this.setState({isOwner: true})
                } else{
                    this.setState({isOwner: null})
                }
                break;
            case 'isSecondHand':
                var addCarInfo=this.refs.addCarInfo;
                var value=$(addCarInfo).find("input[name='isSecondHand']:checked").val();
                if(value!==undefined && value!==null) {
                    this.setState({isSecond: true})
                } else{
                    this.setState({isSecond: null})
                }
                break;
        }
    },

    selectChanged:function(){
        var carCity=$('#carCity option:selected').val(); //根据用车城市确定车牌前缀
        var addCarInfo = this.refs.addCarInfo;
        carData.map(function(item, i){
            if(item.city == carCity){
                $(addCarInfo).find("input[name='carNum']").val(item.carNum);
            }
        });
    },

    doSaveCarInfo:function(){
        var addCarInfo = this.refs.addCarInfo;

        var carCity=$('#carCity option:selected').val()
        var carNum=$(addCarInfo).find("input[name='carNum']").val();
        var ownerName=$(addCarInfo).find("input[name='ownerName']").val();
        var isOwner=$(addCarInfo).find("input[name='isOwner']:checked").val();
        var isSecondHand=$(addCarInfo).find("input[name='isSecondHand']:checked").val();
        var perIdCard=$(addCarInfo).find("input[name='perIdCard']").val();
        var transferDate=$(addCarInfo).find("input[name='transferDate']").val();
        var factoryNum=$(addCarInfo).find("input[name='factoryNum']").val();
        var engineNum=$(addCarInfo).find("input[name='engineNum']").val();
        var frameNum=$(addCarInfo).find("input[name='frameNum']").val();
        var registerDate=$(addCarInfo).find("input[name='registerDate']").val();
        var issueDate=$(addCarInfo).find("input[name='issueDate']").val();

        if (carCity == '请选择用车城市') {
            this.showTips('请选择用车城市~');
        } else if (carNum == "") {
            this.showTips('请填写车牌号~');
        } else if (carNum.length<7) {
            this.showTips('请填写正确的车牌号~');
        } else if (ownerName == "") {
            this.showTips('请填写姓名~');
        } else if (isOwner !== undefined && isOwner !== null && perIdCard == "") {
            this.showTips('请填写车主身份证号~');
        } else if (isOwner !== undefined && isOwner !== null && perIdCard.length<18) {
            this.showTips('请填写正确的车主身份证号~');
        } else if (isSecondHand !== undefined && isSecondHand !== null && transferDate == "") {
            this.showTips('请选择过户日期~');
        } else if (factoryNum == "") {
            this.showTips('请填写场牌型号~');
        } else if (engineNum == "") {
            this.showTips('请填写发动机号~');
        } else if (engineNum.length<6) {
            this.showTips('至少输入6位发动机号~');
        }else if (frameNum == "") {
            this.showTips('请填写车架号~');
        } else if (frameNum.length<17) {
            this.showTips('请填写17位车架号~');
        } else if (registerDate == "") {
            this.showTips('请选择注册日期~');
        } else if (issueDate == "") {
            this.showTips('请选择发证日期~');
        } else {
            var url="/func/insurance/addInsuranceRelatedCarInfo";
            var params={
                customerId:this.state.customerId,
                carCity:carCity,
                carNum:carNum,
                ownerName:ownerName,
                perIdCard:perIdCard,
                transferDate:transferDate,
                factoryNum:factoryNum,
                engineNum:engineNum,
                frameNum:frameNum,
                registerDate:registerDate,
                issueDate:issueDate,
            };

            ProxyQ.query(
                'post',
                url,
                params,
                null,
                function(ob) {
                    var re = ob.re;
                    if(re!==undefined && re!==null && (re ==1 || re =="1")) { //添加信息成功
                        if(this.props.flush!==undefined && this.props.flush!==null){
                            this.props.flush('addNewCarModal');
                        }
                    }
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },

    getInitialState:function(){
        var customerId;
        if(this.props.customerId!==undefined && this.props.customerId!==null){
            customerId=this.customerId;
        }

        return ({customerId:customerId,
            isOwner:null, isSecond:null
        });
    },

    render:function(){
        var carCityList=[];

        carData.map(function(item, i){
            carCityList.push(<option key={i} value={item.city}>{item.city}</option>);
        });

        var mainContent=
            <div ref="addCarInfo">
                <div className="article" style={{padding:'0',borderTop: '1px dashed #CCCCCC'}}>
                    <h3 className="font_15 text">添加车辆信息</h3>
                </div>
                <div style={{float:'left',width:'100%'}}>
                    <div className="carInfo">
                        <div style={{float:'left'}}>
                            <label className="car_label">用车城市</label>
                            <select style={{width:'200px',height:'35px'}} id="carCity" onClick={this.selectChanged}>
                                {carCityList}
                            </select>
                        </div>
                        <div>
                            <label className="car_label">车&nbsp;&nbsp;&nbsp;&nbsp;牌</label>
                            <div className="self_controls">
                                <input name="carNum" defaultValue="" maxLength='7' className="car_input"/>
                            </div>
                        </div>
                    </div>

                    <div className="carInfo">

                        <div style={{float:'left'}}>
                            <label className="car_label">姓&nbsp;&nbsp;&nbsp;&nbsp;名</label>
                            <div className="self_controls">
                                <input name="ownerName" className="car_input" />
                            </div>
                        </div>

                        <div>
                            <div style={{float:'left'}}>
                                <label className="car_label">是否车主</label>
                                <div className="self_controls">
                                    <input type="checkbox" name="isOwner" className="car_input" onClick={this.checkBoxChange.bind(null,'isOwner')}/>
                                </div>
                            </div>

                            <div>
                                <label className="car_label" style={{width:'160px',marginLeft:'30px'}}>是否一年内过户的二手车</label>
                                <div className="self_controls">
                                    <input type="checkbox" name="isSecondHand" className="car_input" onClick={this.checkBoxChange.bind(null,'isSecondHand')}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carInfo">
                        {this.state.isOwner ?
                            <div style={{float:'left'}}>
                                <label className="car_label">车主身份证</label>
                                <div className="self_controls">
                                    <input name="perIdCard" defaultValue="" maxLength='18' className="car_input"/>
                                </div>
                            </div> : null}

                        {this.state.isSecond ?
                            <div>
                                <label className="car_label">过户日期</label>
                                <div className="self_controls">
                                    <span>
                                        <Calendar data={today} ctrlName='transferDate'/>
                                    </span>
                                </div>
                            </div> : null}
                    </div>

                    <div className="carInfo">
                        <div style={{float:'left'}}>
                            <label className="car_label">厂牌型号</label>
                            <div className="self_controls">
                                <input name="factoryNum" defaultValue="" className="car_input"/>
                            </div>
                        </div>
                        <div>
                            <label className="car_label">发动机号</label>
                            <div className="self_controls">
                                <input name="engineNum" defaultValue="" className="car_input"/>
                            </div>
                        </div>
                    </div>

                    <div className="carInfo">
                        <div style={{float:'left'}}>
                            <label className="car_label">车架号</label>
                            <div className="self_controls">
                                <input name="frameNum" defaultValue="" maxLength='17' className="car_input"/>
                            </div>
                        </div>
                        <div>
                            <label className="car_label">注册日期</label>
                            <div className="self_controls">
                                <span>
                                    <Calendar data={today} ctrlName='registerDate'/>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="carInfo">
                        <div style={{float:'left'}}>
                            <label className="car_label">发证日期</label>
                            <div className="self_controls">
                                <span>
                                    <Calendar data={today} ctrlName='issueDate'/>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="clear">
                    </div>

                    <div className="toolBar">
                        <a className="saveBtn btn_primary" href="javascript:void(0)" onClick={this.doSaveCarInfo}>保存</a>
                    </div>
                </div>
            </div>

        return(
            <div>
                {mainContent}
            </div>
        )
    }
});
module.exports=AddRelatedCarInfo;
/**
 * Created by douxiaobin on 2017/03/07.
 */


