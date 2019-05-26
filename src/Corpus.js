import React from 'react';
import {Button, Card, Divider, Icon, Modal, Table, Upload, message, Switch, Input, Row, Col} from "antd";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import moment from 'moment';
import 'moment/min/locales'

moment.locale('zh-cn');

const columns = [
  {
    title: 'id',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, idx) => idx,
  },
  {
    title: '文档名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/corpus/${record.key}`}>{text}</Link>,
  },
  {
    title: '导入时间',
    dataIndex: 'age',
    key: 'age',
    render: t => moment().format('YYYY MMMM Do, a h:mm:ss')
  },
  {
    title: '查重次数',
    dataIndex: 'age',
    key: 'age',
    render: t => 2
  },
  {
    title: '加入语料库',
    key: 'action',
    render: (text, record) => (
      <span>
        <Switch defaultChecked onChange={() => {}} />
      </span>
    ),
  },
  {
    title: '下载 | 删除',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;" title={'下载'}><Icon type="download" /></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'}><Icon type="delete" /></a>
      </span>
    ),
  },
];

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
  },
  {
    key: '3',
    name: 'XX项目申请书.docx',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '14',
    name: 'XX项目申请书.doc',
    age: new Date().toDateString(),
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '25',
    name: 'XX项目申请书.pdf',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '36',
    name: 'XX项目申请书.docx',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '17',
    name: 'XX项目申请书.doc',
    age: new Date().toDateString(),
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '28',
    name: 'XX项目申请书.pdf',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '39',
    name: 'XX项目申请书.docx',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

class Corpus extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    visible: false
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [
        {
          key: 'all-data',
          text: <div><Icon type="login" /> 加入语料库</div>,
          onSelect: () => {
            this.setState({
              selectedRowKeys: [...Array(46).keys()], // 0...45
            });
          },
        },
        {
          key: 'odd',
          text: <div><Icon type="logout" /> 移出语料库</div>,
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        }
      ],
      onSelection: this.onSelection,
    };

    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>语料列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card title={'文档中心'}>
          <Row gutter={16}>
            <Col span={6} >
              <Upload {...props} style={{display: 'inline-block'}}>
                <Button type={'primary'}>
                  <Icon type="upload" /> 上传文档
                </Button>
              </Upload>
            </Col>
            <Col span={6} >
              <Input.Search
                placeholder="输入文档名称查询"
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
                allowClear
              />
            </Col>
            <Col span={12} >
              <Button style={{float: 'right'}}><Icon type="reload" /> 刷新</Button>
            </Col>
          </Row>


          <Table rowSelection={rowSelection} columns={columns} dataSource={data} style={{marginTop: 20}}/>
        </Card>
      </div>
    )
  }
}

export default Corpus;
