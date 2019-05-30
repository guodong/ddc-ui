import React from 'react';
import {Button, Card, Divider, Icon, InputNumber, Modal, Switch, Table, Tag} from "antd";
import { Row, Col, Progress } from 'antd';
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import ParaRepetitionRateBar from './ParaRepetitionRateBar';
import RepetitionArticleBar from './RepetitionArticleBar';
import moment from "moment";
import 'moment/min/locales'


moment.locale('zh-cn');

class CorpusInfo extends React.Component {
  state = {
    visible: false ,
    visualizationModel: false
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

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

  render() {
    const data = [
      {
        key: '1',
        name: 'XX项目申请书.doc',
        age: new Date().toDateString(),
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'XX项目申请书.pdf',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      }
    ]
    const columns = [
      {
        title: 'id',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, idx) => idx,
      },
      {
        title: '查重阈值',
        dataIndex: 'age',
        key: 'age',
        render: t => '80%'
      },
      {
        title: '对比文档数量',
        dataIndex: 'age',
        key: 'age',
        render: t => 105
      },
      {
        title: '创建时间',
        dataIndex: 'age',
        key: 'age',
        render: t => moment().format('YYYY MMMM Do, a h:mm:ss')
      },
      {
        title: '运行状态',
        key: 'action',
        render: (text, record) => (
          <span>
        <Tag color="blue">运行中</Tag>
      </span>
        ),
      },
      {
        title: '下载报告 | 删除 | 统计',
        key: 'action',
        render: (text, record) => (
        <span>
        <a href="javascript:;" title={'下载报告'}><Icon type="download"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'}><Icon type="delete"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'统计'} onClick={this.showVisualizationModel}><Icon type="eye"/></a>
      </span>
        ),
      },
    ];

    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>XX项目申请文档.doc</Breadcrumb.Item>
        </Breadcrumb>
        <Card title={'文档信息'}>
          <p>文档名称：
            <a href="javascript:;" title={'下载报告'}>XX项目申请文档.doc <Icon type="download"/></a></p>
          <p>段落数量：308</p>
          <p>文档大小：2.4MB</p>
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
              width='1500px'
          >
              <Row gutter={16}>
                  <Col span={10}>
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
                  <Col span={14}>
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

export default CorpusInfo;
