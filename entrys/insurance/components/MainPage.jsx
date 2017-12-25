import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

import TopNav from '../modules/TopNav.jsx';
import Footer from '../modules/Footer.jsx';


import Banner from '../../../components/ad/Banner/Banner';


/**Configure the image information for the ad section start*/
const IMAGE_DATA = [
    {
        src: require('../../../components/ad/images/size7(1008.331)/1.jpg'),
    },
    {
        src: require('../../../components/ad/images/size7(1008.331)/2.jpg')
    }
];
/**Configure the image information for the ad section end*/

var MainPage=React.createClass({


    getInitialState: function () {
        return {data: null}
    },

    render:function(){
         var mainContent=
                <div>
                    <TopNav />

                    <Banner
                        items={IMAGE_DATA}
                        width={'1008px'}
                        height={'331px'}
                        speed={0.6}
                        delay={2.6}
                        pause={true}
                        autoplay={true}
                        dots={true}
                        arrows={true}
                        animType={"Slider"}
                    />

                    <div className="clear">
                    </div>

                    <div className="margin w1008">
                        <div className="product">
                            <div className="product_B">
                                <a href="javascript:void(0)">产品介绍 </a>
                            </div>
                            <Link to={window.App.getAppRoute() + "/lifeInsurance"}>
                                <div className="product_img">
                                    <img src={window.App.getResourceDeployPrefix()+"/images/uploads/project/201508041122115824_21534582.jpg"} style={{width:'485px', height:'129px'}}></img>
                                    <div className="product_bg">
                                    </div>
                                    <div className="product_font">
                                             <i style={{color: 'aliceblue'}}> 寿险产品</i>
                                    </div>
                                    <div className="clear">
                                    </div>
                                </div>
                            </Link>
                            <Link to={window.App.getAppRoute() + "/carInsurance"}>
                                <div className="product_img">
                                    <img src={window.App.getResourceDeployPrefix()+"/images/uploads/project/201508041122361838_09058640.jpg"} style={{width:'485px', height:'129px'}}></img>
                                    <div className="product_bg">
                                    </div>
                                    <div className="product_font">
                                            <i style={{color: 'aliceblue'}}> 车险产品</i>
                                    </div>
                                    <div className="clear">
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="clear">
                    </div>
                    <div className="margin w1008">
                        <div className="product">
                            <div className="company mar_10">
                                <div className="company_B">
                                    关于我们
                                </div>
                                <Link to={window.App.getAppRoute() + "/aboutUs"}>
                                    <span className="about-more"><i href="javascript:void(0)">more&gt;&gt;</i></span>
                                </Link>
                                <div className="company_img">
                                    <img alt="" src={window.App.getResourceDeployPrefix() + "/images/company.jpg"}></img>
                                    捷惠保：立足于客户立场，深度发掘客户需求，客观分析，在众多保险产品中为客户选择适合的产品；
                                    与保险主体公司深度合作，依据已有客户需求研发更多，保障全，保费低的优质产品；
                                    为客户提供咨询，理赔，资料代管，车驾管服务等与保险相关的一站式服务。
                                </div>
                            </div>

                            <div className="news mar_L">
                                <div className="news_B">
                                    最新资讯
                                </div>
                                <Link to={window.App.getAppRoute() + "/news"}>
                                    <span className="news-more"><i href="javascript:void(0)">more&gt;&gt;</i></span>
                                </Link>
                                <div className="news_L">
                                    <div>
                                    </div>
                                </div>
                            </div>

                        <div className="service fr mar_10">
                            <div className="clear">
                            </div>
                            <div className="contact">
                                <div className="tell" style={{align:'left'}}>
                                    <i className="line_H">
                                    <span style={{color:'#337fe5',fontSize:'14px'}}>
                                        <strong><span style={{fontSize:'14px'}}>0531-81188593</span></strong>
                                    </span>
                                    </i> <br/>
                                    <em>
                                    <span style={{color:'#337fe5',fontSize:'14px'}}>
                                    <strong><span style={{fontSize:'14px'}}>地址：</span>
                                        <span style={{fontSize:'14px'}}>济南市高新区汇展西路88号</span></strong>
                                    </span>
                                    </em>
                                    <span style={{fontSize:'14px'}}>&nbsp;</span><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="clear">
                    </div>
                    <Footer />
                </div>


        if (this.state.isEnter != undefined && this.state.isEnter != null) { //进入新闻详情
            return (
                <div></div>
            );
        }

        return(
            <div>
                {mainContent}
            </div>
        );
    },
});
module.exports=MainPage;
