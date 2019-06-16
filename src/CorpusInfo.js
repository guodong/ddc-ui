import React from 'react';
import {Button, Card, Divider, Icon, InputNumber, Modal, Switch, Table, Tag} from "antd";
import { Row, Col, Progress } from 'antd';
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import ParaRepetitionRateBar from './ParaRepetitionRateBar';
import RepetitionArticleBar from './RepetitionArticleBar';
import moment from "moment";
import 'moment/min/locales'
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
    }
}

    componentDidMount(){
        this.props.store.corpusStore.getCorpusById(this.props.match.params.id).then(res => {
            let document = {
                documentTitle : this.props.store.corpusStore.corpusDetail.documentSaveName,
                paragraphAmount: this.props.store.corpusStore.corpusDetail.paragraph,
                documentSize: this.bytesToSize(parseInt(this.props.store.corpusStore.corpusDetail.fileSize)),
            };
            this.setState({
                documentDetail: document,
            });
        });

        this.props.store.corpusStore.getCheckList(this.props.match.params.id).then(res => {
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
            result.createTime = res.createTime;
            arr.push(result);
        })
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
        this.props.store.corpusStore.downLoadFile(obj).then((response)=>{
            response.blob().then((blob) =>{
                let a = document.createElement('a');
                let bolbUrl = window.URL.createObjectURL(blob);
                let fileName = obj.name;
                a.href = bolbUrl;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(bolbUrl);
                a = null;
            })
        })
    }

    handleDelete = (record) => {
        this.props.store.corpusStore.deleteResource(record.id).then(response =>{
                if (response.status === 200){
                    this.props.store.FileStore.getResourcesList().then(res => {
                        this.setColumnData(this.props.store.corpusStore.checkList);
                    });
                }
            }
        )
    }


  render() {
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
        <a href="javascript:;" title={'下载报告'} onClick={() => this.handleDownload(record)}><Icon type="download"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'} onClick={() => this.handleDelete(record)} ><Icon type="delete"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'统计'} onClick={this.showVisualizationModel}><Icon type="eye"/></a>
      </span>
        ),
      },
    ];
    // const  { corpusDetail }  = this.props.store.corpusStore.corpusDetail;
      const { documentDetail, data } = this.state;

    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>XX项目申请文档.doc</Breadcrumb.Item>
        </Breadcrumb>
        <Card title={'文档信息'}>
          <p>文档名称：
            <a href="javascript:;" title={'下载报告'}>{documentDetail.documentTitle}<Icon type="download"/></a></p>
          <p>段落数量：{documentDetail.paragraphAmount}</p>
          <p>文档大小：{documentDetail.documentSize}</p>
        </Card>
        <Card title={'查重任务'} style={{marginTop: 30}}>
          <Button style={{float: 'right'}}><Icon type="reload"/> 刷新</Button>
          <Button type={'primary'} onClick={this.showModal}><Icon type="plus"/> 创建查重任务</Button>
          <Table columns={columns} dataSource={data} style={{marginTop: 20}}/>
        </Card>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>查重阈值：<InputNumber
            defaultValue={80}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            onChange={() => {}}
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


        {/*<Modal*/}
          {/*title="查重统计"*/}
          {/*visible={this.state.visualizationModel}*/}
          {/*onOk={this.handleOk}*/}
          {/*onCancel={this.handleCancel}*/}
          {/*style={{width:'2000px'}}*/}
        {/*>*/}
                {/*<Row gutter={16}>*/}
                    {/*<Col span={12}>*/}
                        {/*<Card title="柱状图" >*/}
                            {/*/!*<VisualizationBar />*!/*/}
                        {/*</Card>*/}
                    {/*</Col>*/}
                    {/*<Col span={12}>*/}
                        {/*<Card title="柱状图" >*/}
                            {/*<VisualizationBar />*/}
                        {/*</Card>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
        {/*</Modal>*/}
      </div>
    )
  }
}

export default inject('store')(observer(CorpusInfo));

