import React from 'react';
import {Button, Card, Divider, Icon, Table, Tag} from "antd";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";

const columns = [
  {
    title: 'id',
    dataIndex: 'name',
    key: 'name',
    render: text => 1,
  },
  {
    title: '文档名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: '开始时间',
    dataIndex: 'age',
    key: 'age',
    render: t => new Date().toDateString()
  },
  {
    title: '运行时间',
    dataIndex: 'age',
    key: 'age',
    render: t => '-'
  },
  {
    title: '任务状态',
    dataIndex: 'age',
    key: 'age',
    render: t => <Tag color="#87d068">完成</Tag>
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;">下载原文档</a>
        <Divider type="vertical"/>
        <a href="javascript:;">下载查重结果</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: new Date().toDateString(),
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

class Check extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>文档查重</Breadcrumb.Item>
          <Breadcrumb.Item>任务列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Link to={`/check/create`}><Button type={`primary`}><Icon type="plus"/>新建查重任务</Button></Link>
          <Table columns={columns} dataSource={data} style={{background: '#fff'}}/>
        </Card>
      </div>
    )
  }
}

export default Check;
