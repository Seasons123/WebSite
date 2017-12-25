/**
 * Created by douxiaobin on 2017/02/10.
 */
import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var SyncStore = require('../../../components/flux/stores/SyncStore');

var HomePageNav=React.createClass({
    click:function(ob){ //保存跳转的页面信息
        SyncStore.setRouter(ob);
    },

    render:function(){
        return(
            <div style={{background:'rgb(47, 141, 188)'}}>
                <div className="topHomePage w1008 margin">
                    <div style={{float: 'left',height:'90px'}}>
                        <a href="#">
                            <img src={window.App.getResourceDeployPrefix()+"/images/logo_02.png"} style={{width:'432px', height:'110px'}}></img></a>
                    </div>
                    <div className="fr">
                        <ul className="link">
                            <li className="tellHomePage">咨询热线：<i>0531-81188593</i></li>
                        </ul>
                    </div>
                </div>

                <div className="clear">
                </div>
            </div>
        );
    },
});
module.exports=HomePageNav;
/**
 * Created by douxiaobin on 2017/02/10.
 */
