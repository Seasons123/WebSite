/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import '../../../css/insurance/components/homepage.css';
import Footer from './Footer.jsx';

import Nav from './Navigator.jsx';
import MENU from '../../../data/firstMenus.json';

var HomePage=React.createClass({

    render:function(){

            return(

            <div className='container'
                 style={{paddingLeft:'0px',position:'absolute',width:'100%',top:'0',height:'95%',background:'url('+App.getResourceDeployPrefix()+'/images/background.png) no-repeat',backgroundSize:'100%'}}>
                <Nav logo={window.App.getResourceDeployPrefix() + "/images/logo.png"  } title data={MENU}/>
                <div className="in-container">
                    <div className="topAndCenter">
                        <div className="topMain" style={{position:'relative',margin:'30px auto auto 20px'}}>

                        </div>
                        <div style={{width:'100%',minHeight:'400px',position:'relative'}}>
                            <div className='grid' style={{right: '18%',position: 'absolute',top: '85%'}}>
                                <ul style={{listStyle:'none'}}>
                                    <li style={{float:'left',marginRight:'50px'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/iosQRCode.jpg"} style={{width:'168px'}}/>
                                    </span>
                                        <div style={{textAlign:'center'}}>
                                            <a
                                                type="button"
                                                className=""
                                                href={App.getDownloadDeployDeployPrefix() + "/downloads/android-release-unaligned.apk"}
                                                style={{width:'100%',fontSize:'18px'}}
                                                >iPhone 下载
                                            </a>
                                        </div>
                                    </li>

                                    <li style={{float:'left'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/androidQRCode.jpg" } style={{width:'168px'}}/>
                                    </span>
                                        <div style={{textAlign:'center'}}>
                                            <a
                                                type="button"
                                                className=""
                                                href={App.getDownloadDeployDeployPrefix() + "/downloads/android-release-unaligned.apk"}
                                                style={{width:'100%',fontSize:'18px'}}
                                                > Android 下载
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer"
                     style={{background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%',
                        position:'fixed',bottom:'0',width:'100%',height:'5%'}}>
                    <Footer/>
                </div>
            </div>

            );
    }
});
module.exports=HomePage;
