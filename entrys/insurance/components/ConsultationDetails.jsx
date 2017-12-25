import React from 'react';
import {render} from 'react-dom';

import '../../../css/insurance/components/ConsultationDetails.css';

import Upload from '../../../entrys/insurance/components/Upload';
var SyncStore = require('../../../components/flux/stores/SyncStore');
var ProxyQ = require('../../../components/proxy/ProxyQ');

var ConsultationDetails = React.createClass({
    Branch:function(url) {

        if(this.props.Branch!==undefined&&this.props.Branch!==null)

        {
            var successModal = this.refs['successModal'];
            $(successModal).modal('hide');
            this.props.Branch(url);

        }

    },

    onChildChanged: function (date) {
        this.setState({
            img: date
        });

    },
    uploadAllQuestionContents:function(){
        if(this.state.img!=null||this.state.img!=undefined){
            this.state.attachId=true;
        }
        else{
            this.state.attachId=false;
        }
        this.saveOrUpdateQuestionContent();
    },


    getInitialState  : function () {
        var data=null;
        data = this.props.data;
        var title=null;
        title=this.props.title;
        var personId=null;
        personId=this.props.personId;
        var date=null;
        date=this.props.date;
        var comments=null;
        comments=this.props.comments;
        var img=null;
        img=this.props.img;
        if(SyncStore.getNote()==true){
            this.getNotes();
        }
        return ({data: data,
            title:title,
            personId:personId,
            date:date,
            comments:comments,
            files: []
        });
    },
    onSaveInput:function(event){

        this.state.content=event.target.value;
        //this.setState({content: event.target.value});

    },
    saveOrUpdateQuestionContent:function(){
        var url="/func/insurance/saveOrUpdateProblemContent";
        var params={
            themeId:this.state.data[0].themeId,
            content:this.state.content,
            attachId:this.state.attachId,

            attachType : '73',
            ownerId : this.state.personId,
            fileName : this.state.content+'.jpg',
            folderName :'question' ,
            fileData:this.state.img

        };
        ProxyQ.query(
            'post',
            url,
            params,
            null,
            function(ob) {
                if(ob.data=='success'){
                    var successModal = this.refs['successModal'];
                    $(successModal).modal('show');
                }

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getNotes:function(){
        var url="/func/insurance/getUserInfo";
        ProxyQ.query(
            'get',
            url,
            null,
            null,
            function(ob) {
                if(ob.data==this.state.personId){
                    this.setState({myself:true,notes:SyncStore.getNote()});
                }

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    render:function(){
        var lrs=[];
        if(this.state.notes==true&&this.state.myself==true){
            lrs.push(
                <div key={'my'} className="question-quiz" >
                        <div >
                            <label >继续提问:<span>*</span> </label>
                        </div>
                        <div >
                            <textarea  className="quizArea" onChange={this.onSaveInput}></textarea>
                        </div>
                        <div >
                            <label>上传图片: <span>*</span> </label>
                        </div>
                    <div>
                        <Upload ctrlName={'test'} callbackParent={this.onChildChanged}/>
                    </div>
                        {this.state.img ?
                            <div className="thumb-box" >
                                <img    className="quizImg" src={this.state.img}/>
                            </div> : null}
                        <div >
                            <input type="button" className="quizBtn" onClick={this.uploadAllQuestionContents}  value="提交" />
                        </div>
                </div>
            )
        }

        var contents=this.state.data;
        var trs=[];
        contents.map(function (item, i) {
            if(item.contentType==1){
                trs.push(
                    <dl className="faqs" key={i}>
                        <dt>{item.content}</dt>
                    {item.attach ?
                        <div >
                            <p className="questionImageText">附图：</p>
                            <img  className="questionImage"
                              src={item.attach}/>
                        </div>: null}
                    </dl>
                )
            }else{
                trs.push(
                    <dl className="faqs" key={i}>
                        <dd>{item.content}</dd>
                        {item.attach ?
                        <div >
                            <p className="questionImageText">附图：</p>
                            <img className="questionImage"
                                 src={item.attach}/>
                        </div>: null}
                    </dl>
                )
            }

        });
        return(
            <div>
                <div >
                    <article className="questionDetailTitle clearfix">
                        <h1 className="questionTheme">问题主题：{this.state.title}</h1>
                        <div className="questionFootnote clearfix">
                            <button className="backQuestionList" onClick={this.Branch.bind(null,undefined)}>返回问题列表</button>
                            <span className="icon-comment" >{this.state.comments+'  '}Comments</span>
                            <span className="icon-calendar">{this.state.date.month+1+'月'+this.state.date.date+'日'}</span>
                        </div>
                    </article>
                    <hr className="consultationHR"/>
                    <div className="questionDetailContain">
                        <dl className="faqs">
                            <dt>{this.state.title}</dt>
                        </dl>
                        {trs}
                    </div>
                    <hr className="consultationHR" style={{marginTop:'25px'}}/>
                    {lrs}
                </div>

                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='successModal'
                     data-backdrop="static"
                     data-keyboard="false"
                     style={{zIndex:1045}}
                >
                    <div className="modal-dialog modal-sm"
                         style={{position: 'absolute', top: '30%', width: '50%', marginLeft: '25%'}}>
                        <div className="modal-content"
                             style={{position: 'relative', width: '100%', padding: '40px'}}>

                            <div className="modal-body">
                                <div className="form-group" style={{position: 'relative'}}>
                                    <div>{'提问已经提交，请耐心等待客服人员解答！'}</div>
                                    <input type='button' className="modalCloseBtn"  onClick={this.Branch.bind(null,undefined)} defaultValue="OK"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ConsultationDetails;