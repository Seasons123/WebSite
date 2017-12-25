import React from 'react';
import {render} from 'react-dom';

var Register = React.createClass({

    render: function () {





            return (
                <div id="container">
                    <div className="passport-sign">
                        <div className="main-form">
                            <h2>新用户注册</h2>
                            <p></p>
                            <form className="passport-form passport-form-sign" id="register-form">
                                <input type="hidden" value="" name="referer"/>
                                <div className="form-item">
                                    <div className="form-cont">
                                        <input type="text" name="phone" className="passport-txt xl w-full" tabIndex="1" autoComplete="off" placeholder="请输入手机号"/>
                                    </div>
                                </div>
                                <div className="form-item">
                                    <div className="form-cont">
                                        <input type="password" name="password" className="passport-txt xl w-full" tabIndex="2" autoComplete="off" placeholder="输入密码"/>
                                        <ul className="passport-safely" id="safely">
                                            <li className="danger">弱</li>
                                            <li className="general">中</li>
                                            <li className="safe">高</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-item form-imgcode">
                                    <div className="form-cont">
                                        <div className="layout-inner">
                                            <input type="text" name="verify" className="passport-txt xl w-lg" tabIndex="3" autoComplete="off" placeholder="验证码"/>
                                        </div>
                                        <div className="imgcode">
                                            <img src="#" alt="验证码" className="verifyCode" />
                                            <i className="passport-icon icon-refresh refreshCode"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-item form-mcode mb-25">
                                    <div className="form-cont">
                                        <input type="text" name="verify_code" className="passport-txt xl w-full" tabIndex="4" autoComplete="off" placeholder="动态码"/>
                                        <div className="btn-getcode">
                                            <button type="button" className="passport-btn js-getcode" >获取动态码</button>
                                        </div>
                                        <div className="passport-sms getVoice" style={{display:'none'}}>未收到短信？使用<a href="javascript:void(0);" className="js-getvoice">语音动态码</a></div>
                                        <div className="passport-sms reVoice" style={{display:'none'}}><span className="js-revoice"></span>，请注意接听来电</div>
                                    </div>
                                </div>
                                <div className="form-item form-treaty">
                                    <div className="form-cont">
                                        <input type="checkbox" name="treaty" checked="checked" value="treaty"/>
                                        <span>同意</span><a href="#" target="_blank" className="treaty">保险营销用户协议</a>
                                    </div>
                                </div>
                                <div className="form-item">
                                    <div className="form-cont">
                                        <button type="button" name="register" id="register" className="passport-btn passport-btn-def xl w-full" tabIndex="5" href="javascript:void(0);">注册</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="aside">
                            <div className="passport-goto mg-b100">已有帐号 <a tabIndex="6" >直接登录</a></div>
                            <div className="passport-third">
                                <header className="hd">
                                    <div className="layout-inner">
                                        <h3>汽车保险</h3>
                                    </div>
                                </header>
                                <div className="links">
                                    <img src="images/car.jpg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
});
module.exports = Register;