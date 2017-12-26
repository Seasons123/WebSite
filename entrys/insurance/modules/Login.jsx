/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';
import {Link} from 'react-router';
import '../../../css/insurance/components/passport.css';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var SyncStore = require('../../../components/flux/stores/SyncStore');
var flag=0;
var Login=React.createClass({

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

    login:function(){

        if(flag==0) {

            var a=1;
            var loginPage = this.refs['loginPage'];
            var username = $(loginPage).find("input[name='username']").val();
            var password = $(loginPage).find("input[name='password']").val();

            var validate = $(loginPage).find("input[name='verify']").val();
            this.loginSetCookie(username,password);
            if (username == ''||username==null) {
                alert('请填写用户名！');
            } else if(password ==''||password == null){
                alert('请填写密码！');
            } else if(validate == ''||validate == null){
                alert('请填写验证码！');
            } else {
                var url = "/func/auth/webLogin";
                var params = {
                    loginName: username,
                    password: password,
                    validateCode: validate
                };

            }

        }
    },

    viewSwitch:function(ob){
        var view=ob;
        this.setState({view:view});
    },

    checkPasswordStatus:function(){
        var refsPage = this.refs['login-register-forget'];
        var value = $(refsPage).find("input[name='password']").val();
        var len = value.length;
        var element = this.refs['safely'];

        var regxs = [];
        regxs.push(/[^a-zA-Z0-9_]/g);
        regxs.push(/[a-zA-Z]/g);
        regxs.push(/[0-9]/g);

        var sec = 0;
        if (len >= 6) { // 至少六个字符
            for (var i = 0; i < regxs.length; i++) {
                if (value.match(regxs[i])) {
                    sec++;
                }
            }
        } else{
            sec = 0;
        }
        var result = (sec / regxs.length) * 100;
        if(result == 0){
            $(element).removeClass('safely-general');
            $(element).removeClass('safely-safe');
            $(element).removeClass('safely-danger');
        }else if(result > 0 && result <= 50){
            $(element).removeClass('safely-general');
            $(element).removeClass('safely-safe');
            $(element).addClass('safely-danger');
        }else if (result > 50 && result < 100) {
            $(element).removeClass('safely-danger');
            $(element).removeClass('safely-safe');
            $(element).addClass('safely-general');
        } else if (result == 100) {
            $(element).removeClass('safely-danger');
            $(element).removeClass('safely-general');
            $(element).addClass('safely-safe');
        }
    },

    register:function(){
        var registerPage = this.refs['registerPage'];
        var userName = $(registerPage).find("input[name='userName']").val();
        var password = $(registerPage).find("input[name='password']").val();
        var ackPassword = $(registerPage).find("input[name='ackPassword']").val();
        var email = $(registerPage).find("input[name='email']").val();
        var phoneNum = $(registerPage).find("input[name='phoneNum']").val();
        var verifyCode = $(registerPage).find("input[name='verifyCode']").val();
        var phoneReg = /^1[34578]\d{9}$/;
        var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

        if (userName == "") {
            this.showTips('请填写用户名~');
        } else if (password == "") {
            this.showTips('请填写密码~');
        } else if (password.length<6) {
            this.showTips('密码至少为6位~');
        } else if (ackPassword == "") {
            this.showTips('请再次输入密码~');
        } else if(email != "" && !(emailReg.test(email))){
            this.showTips("邮箱填写有误，请重新填写~");
        } else if (phoneNum == "") {
            this.showTips('请填写手机号~');
        } else if(!(phoneReg.test(phoneNum))){
            this.showTips("手机号码有误，请重新填写~");
        } else if (verifyCode == "") {
            this.showTips('请填写验证码~');
        } else if(this.state.verifyCode == null || this.state.verifyCode == undefined) {
            this.showTips('验证码失效，请重新获取~');
        } else if(verifyCode!==this.state.verifyCode) {
            this.showTips('验证码不正确~');
        } else{
            var url="/func/insurance/customerRegister";
            var params={
                userName:userName,
                password:password,
                email:email,
                phoneNum:phoneNum,
            };

        }
    },

    ackPassword:function(){ //检查两次密码输入是否一致
        var refsPage = this.refs['login-register-forget'];
        var password = $(refsPage).find("input[name='password']").val();
        var ackPassword = $(refsPage).find("input[name='ackPassword']").val();
        if(password==ackPassword){
            return;
        }else{
            alert("两次输入密码不一致！");
        }
    },

    verifyCodeTimeOut:function(){  //获取验证码倒计时
        var refsPage = this.refs['login-register-forget'];
        var J_getCode = $(refsPage).find('#J_getCode');
        var J_second = $(refsPage).find('#J_second');
        var J_resetCode = $(refsPage).find('#J_resetCode');
        J_getCode.hide();
        J_second.html('60');
        J_resetCode.show();
        var second = 60; //验证码有效时间60秒
        var timer = null;
        var ins = this;
        timer = setInterval(function () {
            second -= 1;
            if (second > 0) {
                J_second.html(second);
            } else {
                clearInterval(timer);
                J_getCode.show();
                J_resetCode.hide();
                ins.setState({verifyCode:null}); //把验证码设置失效
            }
        }, 1000);
    },

    getVerifyCode:function(){
        var refsPage = this.refs['login-register-forget'];
        var phoneNum = $(refsPage).find("input[name='phoneNum']").val();
        var reg = /^1[34578]\d{9}$/;
        if(!(reg.test(phoneNum))){
            this.showTips("手机号码有误，请重新填写~");
            return false;
        }
        var num = '';
        for(var i=0;i<4;i++){
            num+=Math.floor(Math.random()*10);
        }
        this.setState({verifyCode:num});

        var params = {
            corp_id:'hy6550',
            corp_pwd:'mm2289',
            corp_service:1069003256550,
            mobile:phoneNum,
            msg_content:''+num,
            corp_msg_id:'',
            ext:''
        };

        var ins=this; //保存this
        var url='http://sms.cloud.hbsmservice.com:8080/sms_send2.do';

    },

    submit:function(){ //修改密码提交按钮
        var forgetPage = this.refs['forgetPage'];
        var userName = $(forgetPage).find("input[name='userName']").val();
        var password = $(forgetPage).find("input[name='password']").val();
        var ackPassword = $(forgetPage).find("input[name='ackPassword']").val();
        var phoneNum = $(forgetPage).find("input[name='phoneNum']").val();
        var verifyCode = $(forgetPage).find("input[name='verifyCode']").val();
        var phoneReg = /^1[34578]\d{9}$/;

        if (userName == "") {
            this.showTips('请填写用户名~');
        } else if (password == "") {
            this.showTips('请填写密码~');
        } else if (password.length<6) {
            this.showTips('密码至少为6位~');
        } else if (ackPassword == "") {
            this.showTips('请再次输入密码~');
        } else if (password != ackPassword) {
            this.showTips('两次输入密码不一致~');
        } else if (phoneNum == "") {
            this.showTips('请填写手机号~');
        } else if(!(phoneReg.test(phoneNum))){
            this.showTips("手机号码有误，请重新填写~");
        } else if (verifyCode == "") {
            this.showTips('请填写验证码~');
        } else if(this.state.verifyCode == null || this.state.verifyCode == undefined) {
            this.showTips('验证码失效，请重新获取~');
        } else if(verifyCode!==this.state.verifyCode) {
            this.showTips('验证码不正确~');
        } else{
            var url="/func/insurance/customerPasswordModify";
            var params={
                userName:userName,
                password:password,
                phoneNum:phoneNum,
            };
            ProxyQ.queryHandle(
                'post',
                url,
                params,
                null,
                function(ob) {
                    var re = ob.re;
                    if(re != undefined && re != null ){
                        this.setState({view: 'login'})
                    }
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },

    loginSetCookie:function(username,password){
        var userValue = username;
        //alert(userValue);
        var exp = new Date();
        exp.setTime(exp.getTime() + (30*24*60*60*1000));
        window.document.cookie = "username=" + escape (userValue) + "; expires=" + exp.toGMTString()+";path=/";

        var auto = document.getElementById("login_autoLoginCheckbox").checked;

        if(auto)
        {
            var password = password;``
            window.document.cookie = "password="+escape(password)+"; expires=" + exp.toGMTString()+";path=/";
            window.document.cookie = "autocheck=true; expires="+ exp.toGMTString()+";path=/";
        }else{
            window.document.cookie = "password=; expires=" + exp.toGMTString()+";path=/";
            window.document.cookie = "autocheck=false; expires="+ exp.toGMTString()+";path=/";
        }

    },

    loginAutoLogin:function (){
        this.loginGetCookie("login_strLoginName","username");
        this.loginGetCookie("login_strPassword","password");
        this.loginCheckAuto();
    },

    loginCheckAuto:function (){
        var checkValue = this.loginGetCookieValue("autocheck");
        if(checkValue=="true")
            document.all("login_autoLoginCheckbox").checked = checkValue;
    },

    loginGetCookieValue:function (name){
        var arg = name + "="; // 要查找的对象
        var arglength = arg.length;
        var cookielength = window.document.cookie.length;
        var i = 0;
        while (i < cookielength)
        {
            var j = i + arglength;
            if (window.document.cookie.substring(i, j) == arg) {
                return this.loginGetCookieVal (j);
            }
            i = window.document.cookie.indexOf(" ", i) + 1;
            if (i == 0)
                break;
        }
        return null;
    },

    loginGetCookie:function(showText, name){
        var arg = name + "="; // 要查找的对象
        var arglength = arg.length;
        var cookielength = window.document.cookie.length;
        var i = 0;
        while (i < cookielength)
        {
            var j = i + arglength;
            if (window.document.cookie.substring(i, j) == arg) {
                var a=this.loginGetCookieVal (j)
                document.getElementById(showText).value = a;
                return true;
            }
            i = window.document.cookie.indexOf(" ", i) + 1;
            if (i == 0)
                break;
        }
           return true;
    },
    loginGetCookieVal:function  (offset) {
         var endstr = window.document.cookie.indexOf (";", offset);
         if (endstr == -1)
             endstr = window.document.cookie.length;
         return unescape(window.document.cookie.substring(offset, endstr));
     },

    getInitialState:function(){
        flag=0;
        var path = SyncStore.getRouter();
        SyncStore.setRouter(null);
        return ({view:'login', path:path, verifyCode: null});
    },

    repaintImage:function (){
        var img = $("#validateImage");
        img.attr('src',"/validatecode.jpg?rnd=" + Math.random());// 防止浏览器缓存的问题
    },

    render:function(){
        var mainContent;
        var view='login';

        switch(view){
            case 'login':
                mainContent=
                    <div ref="loginPage" >
                        <div className="main-form">
                            <div className="passport-tab" id="login-tabs">
                                <div className="tabs">
                                    <ul>
                                        <li className="active">登录</li>
                                    </ul>
                                </div>

                                <div className="tabbed">
                                    <div className="tab-group" style={{display: 'block'}}>
                                        <div className="passport-form passport-form-sign" id="login-form">
                                            <div className="form-item">
                                                <div className="form-cont">
                                                    <input type="text" name="username" id="login_strLoginName" className="passport-txt xl w-full" tabIndex="1" placeholder="用户名/手机号" autoComplete="off"/>
                                                </div>
                                            </div>

                                            <div className="form-item">
                                                <div className="form-cont">
                                                    <input type="password" name="password" id="login_strPassword" className="passport-txt xl w-full" tabIndex="2" placeholder="请输入密码" autoComplete="off"/>
                                                </div>
                                            </div>
                                            <table id="tableVerify" className="form-item">
                                                <tbody>
                                                    <tr >
                                                        <td>验证码: </td>
                                                        <td><input type="text" name="verify" id="verify" className="passport-txt xl w-full" /></td>
                                                        <td><img style={{paddingLeft:'10px'}} id="validateImage" /></td>
                                                        <td><img style={{paddingLeft:'5px'}} /></td>
                                                        <td><span id="verifyMsg" className="errorMessage"/></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="form-item form-sevenday">
                                                <div className="form-cont clearfix">
                                                    <label><input type="checkbox" id="login_autoLoginCheckbox" className="passport-sevenday" tabIndex="2" />记住密码</label>
                                                    <a className="forget-link" >忘记密码</a>
                                                </div>
                                            </div>



                                            <div className="form-item">
                                                <div className="form-cont">
                                                    <Link style={{color:'#ffffff'}} to={window.App.getAppRoute() + "/adminConfig"}>
                                                        <button type="button" id="login" className="passport-btn passport-btn-def xl w-full" tabIndex="4" onClick={this.login}>
                                                            登录
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="aside">
                            <div className="passport-goto">没有账号?
                                <a tabIndex="6" onClick={this.viewSwitch.bind(this,'register')}>新用户注册</a>
                            </div>
                            <div className="sendgift"></div>
                            <div className="passport-third">
                                <header className="hd">
                                    <div className="layout-inner">
                                        <h3>汽车保险</h3>
                                    </div>
                                </header>
                                <div className="links">
                                    <img src={window.App.getResourceDeployPrefix()+"/images/loginCar.jpg"} />
                                </div>
                            </div>
                        </div>

                    </div>
                break;
            case 'register':
                mainContent=
                    <div ref="registerPage">
                        <div className="main-form">
                            <div className="passport-tab" id="login-tabs">
                                <div className="tabs">
                                    <ul>
                                        <li className="active">新用户注册</li>
                                    </ul>
                                </div>

                                <div className="passport-form passport-form-sign" id="register-form">
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="text" name="userName" className="passport-txt xl w-full" tabIndex="1" autoComplete="off" placeholder="请输入用户名"/>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="password" name="password" className="passport-txt xl w-full" tabIndex="2" autoComplete="off" onKeyUp={this.checkPasswordStatus} placeholder="请输入密码"/>
                                            <ul className="passport-safely" ref="safely">
                                                <li className="danger">弱</li>
                                                <li className="general">中</li>
                                                <li className="safe">高</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="password" name="ackPassword" className="passport-txt xl w-full" tabIndex="3" autoComplete="off" onBlur={this.ackPassword} placeholder="请再次输入密码"/>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="text" name="email" className="passport-txt xl w-full" tabIndex="4" autoComplete="off" placeholder="请输入邮箱地址，本项选填"/>
                                        </div>
                                    </div>

                                    <div className="form-item form-mcode mb-25">
                                        <div className="form-cont">
                                            <input type="text" name="phoneNum" className="passport-txt xl w-full" tabIndex="5" maxLength="11" autoComplete="off" placeholder="请输入手机号"/>
                                            <div className="btn-getcode">
                                                <button type="button" className="passport-btn js-getcode" id="J_getCode" onClick={this.getVerifyCode}>发送验证码</button>
                                            </div>
                                            <div className="btn-getcode">
                                                <button type="button" className="passport-btn js-getcode" id="J_resetCode" style={{display:'none'}}><span id="J_second">60</span>秒后重发</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="text" name="verifyCode" className="passport-txt xl w-full" tabIndex="6" autoComplete="off" placeholder="请输入验证码"/>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <button type="button" name="register" id="register" className="passport-btn passport-btn-def xl w-full" tabIndex="7" onClick={this.register}>注册</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="aside">
                            <div className="passport-goto mg-b100">已有帐号
                                <a tabIndex="6" onClick={this.viewSwitch.bind(this,'login')}>直接登录</a></div>
                            <div className="passport-third">
                                <header className="hd">
                                    <div className="layout-inner">
                                        <h3>汽车保险</h3>
                                    </div>
                                </header>
                                <div className="links">
                                    <img src={window.App.getResourceDeployPrefix()+"/images/loginCar.jpg"} />
                                </div>
                            </div>
                        </div>
                    </div>
                break;
            case 'forget':
                mainContent=
                    <div ref="forgetPage">
                        <div className="main-form">
                            <div className="passport-tab" id="login-tabs">
                                <div className="tabs">
                                    <ul>
                                        <li className="active">密码重置</li>
                                    </ul>
                                </div>

                                <div className="passport-form passport-form-sign" id="register-form">
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="text" name="userName" className="passport-txt xl w-full" tabIndex="1" autoComplete="off" placeholder="请输入用户名"/>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="password" name="password" className="passport-txt xl w-full" tabIndex="2" autoComplete="off" onKeyUp={this.checkPasswordStatus} placeholder="请输入新密码"/>
                                            <ul className="passport-safely" ref="safely">
                                                <li className="danger">弱</li>
                                                <li className="general">中</li>
                                                <li className="safe">高</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="password" name="ackPassword" className="passport-txt xl w-full" tabIndex="3" autoComplete="off" onBlur={this.ackPassword} placeholder="请再次输入新密码"/>
                                        </div>
                                    </div>
                                    <div className="form-item form-mcode mb-25">
                                        <div className="form-cont">
                                            <input type="text" name="phoneNum" className="passport-txt xl w-full" tabIndex="4" maxLength="11" autoComplete="off" placeholder="请输入手机号"/>
                                            <div className="btn-getcode">
                                                <button type="button" className="passport-btn js-getcode" id="J_getCode" onClick={this.getVerifyCode}>发送验证码</button>
                                            </div>
                                            <div className="btn-getcode">
                                                <button type="button" className="passport-btn js-getcode" id="J_resetCode" style={{display:'none'}}><span id="J_second">60</span>秒后重发</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-item">
                                        <div className="form-cont">
                                            <input type="text" name="verifyCode" className="passport-txt xl w-full" tabIndex="5" autoComplete="off" placeholder="请输入验证码"/>
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-cont">
                                            <button type="button" name="forget" id="forget" className="passport-btn passport-btn-def xl w-full" tabIndex="6" onClick={this.submit}>提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="aside">
                            <div className="passport-goto mg-b100">密码已找回
                                <a tabIndex="6" onClick={this.viewSwitch.bind(this,'login')}>直接登录</a></div>
                            <div className="passport-third">
                                <header className="hd">
                                    <div className="layout-inner">
                                        <h3>汽车保险</h3>
                                    </div>
                                </header>
                                <div className="links">
                                    <img src={window.App.getResourceDeployPrefix()+"/images/loginCar.jpg"} />
                                </div>
                            </div>
                        </div>
                    </div>
                break;
        }


        return(
            <div className="passport-wrapper">
                <div id="container" ref='login-register-forget'>
                    <div className="passport-sign">

                        {mainContent}

                    </div>
                </div>
            </div>
        )
    },

    componentDidMount:function () {
        this.repaintImage();
    },

});
module.exports=Login;



