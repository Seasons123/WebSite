/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';


var AboutUs=React.createClass({

    render:function(){
        var mainContent = (
            <div className="w890 margin mar_20">
                <div className="pro_R fr bg" style={{width:'890px'}}>
                    <div className="pro_bg">
                        <span className="fr pad_L">您的位置： <a>主页</a> &gt; 管理员配置广告</span>
                    </div>

                    <div style={{width:"800px",height:"640px",margin:'20px auto'}}>


                    </div>
                </div>
            </div>
        )

        return(
            <div>
                <div className="clear">
                </div>
                {mainContent}
            </div>
        )
    },
    componentDidMount:function () {
        this.repaintImage();
    },
});
module.exports=AboutUs;



