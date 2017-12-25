/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import Footer from '../modules/Footer.jsx';
import '../../../css/insurance/components/nav.css'
import Nav from '../modules/HomePageNav';
import '../../../css/insurance/components/homepage.css'

var HomePage=React.createClass({
    mouseWheel:function(){
        document.onmousewheel = function() {return false;}
    },

    render:function(){

        return(

            <div className="homePage">
                 <Nav/>
                <div className="w1500">
                    <div className="homePage_L">
                        <img src={window.App.getResourceDeployPrefix()+"/images/images-8.png"}/>
                    </div>
                    <div className="homePage_R" >
                    <div style={{minHeight: '400px', paddingTop: '30%'}}>
                            <ul style={{listStyle:'none'}}>
                                <li style={{width: '250px',float:'left'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/iosQRCode.png"} style={{width:'168px',marginLeft: '40px'}}/>
                                    </span>
                                    <div style={{textAlign:'center'}}>
                                        <a
                                            type="button"
                                            className=""
                                            href={App.getDownloadDeployDeployPrefix() + "/downloads/iso-release.apk"}
                                            style={{width:'100%',fontSize:'18px'}}
                                        >iPhone 下载
                                        </a>
                                    </div>
                                </li>
                                <li style={{width: '250px',float:'left'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/androidQRCode.png" } style={{width:'168px',marginLeft: '40px'}}/>
                                    </span>
                                    <div style={{textAlign:'center'}}>
                                        <a
                                            type="button"
                                            className=""
                                            href={App.getDownloadDeployDeployPrefix() + "/downloads/android-release.apk"}
                                            style={{width:'100%',fontSize:'18px'}}
                                        > Android 下载
                                        </a>
                                    </div>
                                </li>
                            </ul>

                    </div>
                        <div style={{paddingTop: '20%'}}>
                            <Link style={{fontSize: 'x-large', paddingLeft: '195px'}}to={window.App.getAppRoute() + "/mainPage"}>
                            进入主页
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer/>
            </div>

        );
    }
});
module.exports=HomePage;
