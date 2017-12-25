import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurance/components/personInfoBase.css';
import '../../../css/insurance/components/personInfoLayout.css';
import Calendar from '../../../components/basic/Calendar.jsx';
import Upload from './Upload.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');
var today=new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
var AddRelatedPersonInfo = React.createClass({

    getInitialState:function(){
        var customerId;
        if(this.props.customerId!==undefined && this.props.customerId!==null){
            customerId=this.customerId;
        }
        return ({
            data:null,customerId:customerId, frontImg:null, backImg:null

        });
    },
    displayUploadImg:function (ob,imgData) {
        switch(ob){
            case 'frontImg':
                this.setState({frontImg: imgData});
                break;
            case 'backImg':
                this.setState({backImg: imgData});
                break;
            default:
                break;
        }
    },
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
    doSaveRelativeInfo:function(){
        var relativePersonInfo = this.refs.relativePersonInfo;
        var relatedName=$(relativePersonInfo).find("input[name='relatedName']").val();
        var relative=$('#relative option:selected').val();
        var relatedDate=$(relativePersonInfo).find("input[name='birthdayDate']").val();
        var relativeSex = $('#relativeSex option:selected').val();

        if (relatedName == '') {
            this.showTips('请填写关联人的姓名~');
        } else if (relative == '-1' || relative == -1) {
            this.showTips('请选择关联人和你的关系~');
        } else if (this.state.frontImg == undefined || this.state.frontImg == null) {
            this.showTips('请上传关联人身份证正面照片~');
        } else if (this.state.backImg == undefined || this.state.backImg == null) {
            this.showTips('请上传关联人身份证反面照片~');
        } else if (relatedDate == "") {
            this.showTips('请选择出生日期~');
        } else if (relativeSex == "-1"||relativeSex == -1){
            this.showTips('请选择性别~');
        } else {

            var url="/func/insurance/addInsuranceRelatedPersonInfo";
            var params={
                customerId:this.state.customerId,
                relatedName:relatedName,
                relType:relative,
                relSex:relativeSex,
                relatedDate:relatedDate,

                fileData1:this.state.frontImg,
                fileData2:this.state.backImg
            };

            ProxyQ.query(
                'post',
                url,
                params,
                null,
                function(ob) {
                    var re = ob.re;
                    if(re!==undefined && re!==null && (re ==1 || re =="1")) { //添加信息成功
                        if(this.props.flush!==undefined && this.props.flush!==null){
                            this.props.flush('addNewManModal');
                        }
                    }
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },
    render: function () {
        var relative_add_trs=[];
        relative_add_trs.push(<option key={0} value={2}>{"父母"}</option>); //下拉列表
        relative_add_trs.push(<option key={1} value={3}>{"子女"}</option>);
        relative_add_trs.push(<option key={2} value={4}>{"配偶"}</option>);
        var mainContent =
            <div  ref="relativePersonInfo">
                <div className="article" style={{padding: '0', borderTop: '1px dashed #CCCCCC'}}>
                    <h3 className="font_15 text">添加关联人</h3>
                </div>

                <div>
                    <div style={{float: 'left', width: '100%', marginTop: '25px'}}>
                        <div style={{float: 'left'}}>
                            <label className="related_label">姓名</label>
                            <div className="self_controls">
                                <input name="relatedName" defaultValue="" className="self_input"/>
                            </div>
                        </div>

                        <div>
                            <label className="related_label" style={{marginLeft: '55px'}}>关系</label>
                            <div className="self_controls">
                                <select style={{width: '300px', height: '35px'}} id="relative">
                                    <option value={-1}>请选择亲属关系</option>
                                    {relative_add_trs}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="clear">
                    </div>
                    <div style={{float: 'left', width: '100%', marginTop: '25px'}}>
                        <div style={{float: 'left'}}>
                            <label className="related_label" >性别</label>
                            <div className="self_controls">
                                <select style={{width: '300px', height: '35px'}} id="relativeSex">
                                    <option value={-1}>请选择性别</option>
                                    <option value={0}>男</option>
                                    <option value={1}>女</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="related_label" style={{marginLeft: '55px'}}>出生日期</label>
                            <div className="self_controls">
                               <span>
                                   <Calendar data={today} ctrlName='birthdayDate'/>
                               </span>
                            </div>
                        </div>

                    </div>

                    <div className="clear">
                    </div>
                    <div className="self_control_group">
                        <div style={{float: 'left', width: '50%'}}>
                            <label className="related_label">身份证正面:</label>
                            <div style={{marginTop: '5px'}}>
                                <Upload ctrlName={'test'}
                                        callbackParent={this.displayUploadImg.bind(null, "frontImg")}/>
                            </div>

                            {this.state.frontImg ?
                                <div className="thumb-box" style={{height: '220px', width: '444px'}}>
                                    <img style={{width: '385px',height: '200px',marginTop: '15px',marginLeft: '15px'}}
                                         src={this.state.frontImg}/>
                                </div> : null}
                        </div>

                        <div style={{float: 'left', width: '50%'}}>
                            <label className="related_label" style={{marginLeft: '12px'}}>身份证反面:</label>
                            <div style={{marginTop: '5px'}}>
                                <Upload ctrlName={'test'} callbackParent={this.displayUploadImg.bind(null, "backImg")}/>
                            </div>

                            {this.state.backImg ?
                                <div className="thumb-box" style={{height: '220px', width: '444px'}}>
                                    <img style={{width: '385px',height: '200px',marginTop: '15px',marginLeft: '27px'}}
                                         src={this.state.backImg}/>
                                </div> : null}
                        </div>
                    </div>

                    <div className="save_control" style={{
                        float: 'left',
                        marginLeft: '44%',
                        marginTop: '20px',
                        marginBottom: '20px',
                        width: '100%'
                    }}>
                        <a className="saveBtn btn_primary" href="javascript:void(0)" onClick={this.doSaveRelativeInfo}>添加</a>
                    </div>

                </div>
            </div>
        return (
            <div>
                {mainContent}
            </div>
        )

    }
});
module.exports = AddRelatedPersonInfo;