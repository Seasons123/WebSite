/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurance/components/personInfoBase.css';
import '../../../css/insurance/components/personInfoLayout.css';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var PersonInfo=React.createClass({

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

    doSaveSelfInfo:function(){
        var selfPersonInfo = this.refs.selfPersonInfo;
        var perName=$(selfPersonInfo).find("input[name='perName']").val();
        var perIdCard=$(selfPersonInfo).find("input[name='perIdCard']").val();
        var phoneNum=$(selfPersonInfo).find("input[name='phoneNum']").val();
        var postCode=$(selfPersonInfo).find("input[name='postCode']").val();
        var address=$(selfPersonInfo).find("input[name='address']").val();

        if (perName == '') {
            this.showTips('请填写您的姓名~');
        } else if (perIdCard == '') {
            this.showTips('请输入您的证件号码~');
        } else if (phoneNum == '') {
            this.showTips('请输入您的电话号码~');
        } else if (postCode == '') {
            this.showTips('请输入您的邮编~');
        } else if (address == '') {
            this.showTips('请输入您的地址~');
        } else {
            //this.showTips('提交成功~', 2500, 1);

            var url="/func/insurance/setInsuranceCustomerInfo";
            var params={
                customerId:this.state.customerId,
                perName:perName,
                perIdCard:perIdCard,
                phoneNum:phoneNum,
                postCode:postCode,
                address:address
            };

            ProxyQ.query(
                'post',
                url,
                params,
                null,
                function(rep) {
                    var a=rep;
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },

    initialData:function(){
        var url="/func/insurance/getInsuranceCustomerInfo";
        var params={

        };
        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                var re = ob.re;
                if(re!==undefined && re!==null && (re ==2 || re =="2")) { //登录信息为空
                    return;
                }
                var data=ob.data;
                var customerId=data.customerId;
                this.setState({
                    data:data,
                    customerId:customerId
                });
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    getInitialState:function(){
        return ({data:null,
            customerId:null,});
    },

    render:function(){
        var mainContent;
        var data;

        if(this.state.data!==undefined&&this.state.data!==null) {
            data=this.state.data;
            mainContent=
                <div ref="selfPersonInfo" style={{marginTop:'20px'}}>
                    <div className="self_control_group">
                        <span className="self_label">用户名</span>
                        <div className="self_controls">
                            <input name="perName" defaultValue={data.perName || ""} className="self_input" />
                        </div>
                    </div>
                    <div className="self_control_group">
                        <span className="self_label">身份证</span>
                        <div className="self_controls">
                            <input name="perIdCard" defaultValue={data.perIdCard || ""} className="self_input" maxLength='18'/>
                        </div>
                    </div>
                    <div className="self_control_group">
                        <span className="self_label">电话</span>
                        <div className="self_controls">
                            <input name="phoneNum" defaultValue={data.phoneNum || ""} className="self_input" maxLength='11'/>
                        </div>
                    </div>
                    <div className="self_control_group">
                        <span className="self_label">邮编</span>
                        <div className="self_controls">
                            <input name="postCode" defaultValue={data.postCode || ""}  className="self_input" maxLength='6'/>
                        </div>
                    </div>
                    <div className="self_control_group">
                        <span className="self_label">地址</span>
                        <div className="self_controls">
                            <input name="address" defaultValue={data.address || ""} className="self_input"/>
                        </div>
                    </div>
                    <div className="toolBar">
                        <a className="saveBtn btn_primary" href="javascript:;" onClick={this.doSaveSelfInfo}>保存</a>
                    </div>
                </div>
        }else{
            //初始化内容详情
            this.initialData();
        }

        return(
            <div >
                {mainContent}
            </div>
        );
    },
});
module.exports=PersonInfo;
/**
 * Created by douxiaobin on 2016/10/27.
 */
