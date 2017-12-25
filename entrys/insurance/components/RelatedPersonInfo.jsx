/**
 * Created by douxiaobin on 2017/03/4.
 */
import React from 'react';
import { render } from 'react-dom';

import '../../../css/insurance/components/personInfoBase.css';
import '../../../css/insurance/components/personInfoLayout.css';
import AddRelatedPersonInfo from './AddRelatedPersonInfo.jsx';
import Upload from './Upload.jsx';
import Calendar from '../../../components/basic/Calendar.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var RelatedPersonInfo=React.createClass({

    initialData:function(){
        var url="/func/insurance/getInsuranceRelatedPersonInfo";
        var params={

        };
        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                //var re = ob.re;
                //if(re!==undefined && re!==null && (re ==2 || re =="2")) { //登录信息为空
                //    return;
                //}
                var data=ob.data;
                var customerId=ob.customerId
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
        return ({data:null, customerId:null,
            relatedName:null,
            });
    },
    flush:function (a) {
        var addInfoSuccessModal = this.refs['addInfoSuccessModal'];
        $(addInfoSuccessModal).modal('show');
        this.closeModal(a);
        this.initialData();
    },
    closeModal:function(ob){ //保存跳转的页面信息
        var Modal = this.refs[ob];
        $(Modal).modal('hide');

    },
    render:function(){
        var mainContent;
        var data;
        var relative_trs=[];


        if(this.state.data!==undefined && this.state.data!==null) {
            data=this.state.data;
            data.map(function (item, i) {
                relative_trs.push(
                    <tr key={i}>
                        <td>
                            {item.relatedName}
                        </td>
                        <td>
                            {item.perIdCard}
                        </td>
                        <td>
                            {item.relTypeStr}
                        </td>
                    </tr>
                );
            });



            mainContent=
                <div >
                    <div className="self_control_group">
                        <table className="table table-striped invoice-table">
                            <thead>
                            <tr>
                                <th width="300" style={{textAlign:'center'}}>姓名</th>
                                <th width="300" style={{textAlign:'center'}}>证件号</th>
                                <th width="300" style={{textAlign:'center'}}>亲属关系</th>
                            </tr>
                            </thead>
                            <tbody style={{textAlign:'center'}}>
                            {relative_trs}
                            </tbody>
                        </table>
                    </div>

                  <AddRelatedPersonInfo customerId={this.state.customerId} flush={this.flush}/>

                    <div className="modal fade bs-example-modal-sm login-container"
                         tabIndex="-1"
                         role="dialog"
                         aria-labelledby="myLargeModalLabel"
                         aria-hidden="true"
                         ref='addInfoSuccessModal'
                         data-backdrop="static"
                         data-keyboard="false"
                         style={{zIndex:1045}}
                    >
                        <div className="modal-dialog modal-sm"
                             style={{position: 'absolute', top: '30%', width: '50%', marginLeft: '25%'}}>
                            <div className="modal-content"
                                 style={{position: 'relative', width: '100%'}}>
                                <div className="modal-body">
                                    <div className="form-group" style={{position: 'relative'}}>
                                        <div>{'添加成功！'}</div>
                                        <input type='button' className="modalCloseBtn"  onClick={this.closeModal.bind(null,'addInfoSuccessModal')} defaultValue="OK"/>
                                    </div>
                                </div>
                            </div>
                        </div>
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
module.exports=RelatedPersonInfo;
/**
 * Created by douxiaobin on 2017/03/4.
 */