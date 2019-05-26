import React from 'react';
import {Button, Card, Divider, Icon, InputNumber, Modal, Switch, Table, Tag} from "antd";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import moment from "moment";
import 'moment/min/locales'

moment.locale('zh-cn');

class CorpusInfo extends React.Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
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
        title: '下载报告 | 删除',
        key: 'action',
        render: (text, record) => (
          <span>
        <a href="javascript:;" title={'下载报告'}><Icon type="download"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'}><Icon type="delete"/></a>
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
      </div>
    )
  }
}

export default CorpusInfo;
