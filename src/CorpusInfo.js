import React from 'react';
import {Button, Card, Divider, Icon, InputNumber, Modal, Switch, Table, Tag} from "antd";
import { Row, Col, Progress } from 'antd';
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import ParaRepetitionRateBar from './ParaRepetitionRateBar';
import RepetitionArticleBar from './RepetitionArticleBar';
import moment from "moment";
import 'moment/min/locales';
import {inject, observer} from "mobx-react";


moment.locale('zh-cn');

class CorpusInfo extends React.Component {

    constructor(props){
        super(props);
        this.state={
        visible: false,
        visualizationModel: false,
        checkData: [],
        documentDetail: {},
        data: [],
        pageNumber: 1,
        paginationSize: 10,
        dataValue: '0',
    };
}

    componentDidMount(){
        let payload = {
            condition:{document_id: this.props.match.params.id},
            current: this.state.pageNumber,
        };
        this.props.store.corpusStore.getCorpusById(this.props.match.params.id).then(res => {
            let document = {
                documentTitle : this.props.store.corpusStore.corpusDetail.title,
                paragraphAmount: this.props.store.corpusStore.corpusDetail.paragraph,
                documentSize: this.bytesToSize(parseInt(this.props.store.corpusStore.corpusDetail.fileSize)),
            };
            this.setState({
                documentDetail: document,
            });
        });
        this.updateCheckList(payload);
    }

    updateCheckList(param){
        this.props.store.corpusStore.getCheckList(param).then(res => {
                this.setColumnData(this.props.store.corpusStore.checkList);
        })
    }

    setColumnData(resultArr){
        const arr = [];
        resultArr.map((res) => {
            const result = {};
            result.repetitionRate = res.repetitionRate;
            result.compareAccount = res.compareAccount;
            result.documentId = res.documentId;
            result.id = res.id;
            result.createTime = res.createTime;
            result.isLoading = res.isLoading;
            arr.push(result);
        });
        this.setState({
            data: arr,
        })
    }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };


    bytesToSize(bytes){
        if(bytes === 0){
            return '0B';
        }
        let k = 1024,sizes=['B','KB','MB','GB','TB','PB','ZB','YB'];
        let i = Math.floor(Math.log(bytes)/Math.log(k));
        return (bytes/Math.pow(k,i)).toFixed(1)+ '' +sizes[i];
    }

  showVisualizationModel = () => {
    this.setState({
        visualizationModel: true,
    });
  };

  handleOk = () => {
    this.setState({
        visualizationModel: false,
    })
  }

    handleCancel= () => {
        this.setState({
            visualizationModel: false,
        })
    }

    handleDownload = (obj) => {
        this.props.store.corpusStore.downLoadCheck(obj).then((response)=>{
            response.blob().then((blob) =>{
                let a = document.createElement('a');
                let bolbUrl = window.URL.createObjectURL(blob);
                let fileName = obj.title;
                a.href = bolbUrl;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(bolbUrl);
                a = null;
            })
        })
    }

    handleDelete = (record) => {
        const { pageNumber, paginationSize} = this.state;
        let id = this.props.match.params.id;
        let param = {
            condition:{document_id: id},
            current: pageNumber,
        };
        let documentTotalCount = this.getCheckListTotalCount();
        let lastPage = Math.ceil(documentTotalCount/paginationSize);
        if(lastPage === pageNumber){
            let Item = documentTotalCount % paginationSize;
            if(Item === 1 && lastPage !== 1){
                this.props.store.corpusStore.removeCheck(record.id).then(response =>{
                        if (response.status === 200){
                            let page = pageNumber - 1;
                            this.setState({
                                pageNumber: page,
                            });
                            let payload = {
                                condition: {document_id: id},
                                current: page,
                            };
                            this.refreshResourceList(payload);
                        }
                    }
                )
            }else{
                this.props.store.corpusStore.removeCheck(record.id).then(response =>{
                        if (response.status === 200){
                            this.refreshResourceList(param);
                        }
                    }
                )
            }
        }else{
            this.props.store.corpusStore.removeCheck(record.id).then(response =>{
                    if (response.status === 200){
                        this.refreshResourceList(param);
                    }
                }
            )
        }
    }

    getCheckListTotalCount(){
      return this.props.store.corpusStore.checkListCount;
    }

    onPageChange(page){
        this.setState({
            pageNumber: page
        });
        let payload = {
            condition:{document_id: this.props.match.params.id},
            current: page,
        };
        this.updateCheckList(payload);
    }

    handleCheckOk(){
    const { dataValue, pageNumber} = this.state;
    let param = {
        repetitionRate: dataValue,
        documentId: this.props.match.params.id,
    };
    this.props.store.corpusStore.createCheck(param).then(res => {
    });
    let payload = {
        condition:{document_id: this.props.match.params.id},
        current: pageNumber,
    };
    this.updateCheckList(payload);
    this.setState({
        visible: false,
    });
    }

    onChange(value) {
        this.setState({
            dataValue: value,
        });
    }

    handleCheckCancel(){
      this.setState({
          visible: false
      })
    }

    flushCheckList(){
      const { pageNumber } = this.state;
        let payload = {
            condition:{document_id: this.props.match.params.id},
            current: pageNumber,
        };
      this.updateCheckList(payload);
    }



  render() {
      const paginationConfig = {
          showQuickJumper: true,
          onChange: (page) => {this.onPageChange(page)},
          defaultCurrent: 1,
          total : this.getCheckListTotalCount(),
      };

      const { documentDetail, data } = this.state;
      const columns = [
      {
        title: 'id',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, idx) => idx,
      },
      {
        title: '查重阈值',
        dataIndex: 'repetitionRate',
        key: 'repetitionRate',
      },
      {
        title: '对比文档数量',
        dataIndex: 'compareAccount',
        key: 'compareAccount',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: t => moment().format('YYYY MMMM Do, a h:mm:ss')
      },
      {
        title: '运行状态',
        key: 'action',
        render: (text, record) => (
          <span>
        <Tag color="blue">{record.isFinished ? '已结束' : '运行中'}</Tag>
      </span>
        ),
      },
      {
        title: '下载报告 | 删除 | 统计',
        key: 'action',
        render: (text, record) => (
            <span>
        <a href="javascript:;" title={'下载'} onClick={() => this.handleDownload(record)} ><Icon type="download"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'} onClick={() => this.handleDelete(record)}><Icon type="delete" /></a>
        <Divider type="vertical"/>
         <a href="javascript:;" title={'统计'} onClick={() => this.showVisualizationModel()}><Icon type="eye" /></a>
            </span>
        ),
      },
    ];

    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>{documentDetail.documentTitle}</Breadcrumb.Item>
        </Breadcrumb>
        <Card title={'文档信息'}>
          <p>文档名称：
            <a href="javascript:;" title={'下载报告'}>{documentDetail.documentTitle}<Icon type="download"/></a></p>
          <p>段落数量：{documentDetail.paragraphAmount}</p>
          <p>文档大小：{documentDetail.documentSize}</p>
        </Card>
        <Card title={'查重任务'} style={{marginTop: 30}}>
          <Button style={{float: 'right'}} onClick={this.flushCheckList.bind(this)}><Icon type="reload"/> 刷新</Button>
          <Button type={'primary'} onClick={this.showModal}><Icon type="plus"/> 创建查重任务</Button>
          <Table columns={columns} dataSource={data} pagination={paginationConfig} style={{marginTop: 20}}/>
        </Card>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleCheckOk.bind(this)}
          onCancel={this.handleCheckCancel.bind(this)}
        >
          <p>查重阈值：<InputNumber
            defaultValue={0}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            // parser={(value) => {this.onParseValue(value)}}
            onChange={this.onChange.bind(this)}
            precision={1}
          /></p>
        </Modal>
          <Modal
              title="查重统计"
              visible={this.state.visualizationModel}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width='1200px'
          >
              <Row gutter={16}>
                  <Col span={12}>
                      <Row>
                          <Card title="重复率"  >
                              <div style={{textAlign:'center'}}>
                                  <Progress type="circle" percent={75}/>
                              </div>
                          </Card>
                      </Row>
                      <Row style={{marginTop:'20px'}}>
                          <Card title="段落重复率"  >
                              <ParaRepetitionRateBar />
                          </Card>
                      </Row>
                  </Col>
                  <Col span={12}>
                      <Card title="重复率散点图">
                          <RepetitionArticleBar />
                      </Card>
                  </Col>
              </Row>
          </Modal>
      </div>
    )
  }
}

export default inject('store')(observer(CorpusInfo));

