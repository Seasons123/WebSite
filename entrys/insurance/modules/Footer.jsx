/**
 * Created by douxiaobin on 2017/02/10.
 */
import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

var Mpage=React.createClass({

    render:function(){
        return(
            <div style={{marginTop:'40px'}}>

                <div className="clear">
                </div>
                <div className="footer" style={{height: '35px'}}>
                    <div className="w1008 margin">
                        <p>版权所有©山东泓信信息科技股份有限公司
                            <Link to={window.App.getAppRoute() + "/admin"}>
                                <span className="admin">管理员登录</span>
                            </Link></p>
                    </div>
                </div>
            </div>
        );
    },
});
module.exports=Mpage;
/**
 * Created by douxiaobin on 2017/02/10.
 */
