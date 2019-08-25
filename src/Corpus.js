import React from 'react';
import {Button, Card, Divider, Icon, Modal, Table, Upload, message, Switch, Input, Row, Col} from "antd";
import {Breadcrumb, Spin} from "antd";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import './common/config';
import moment from 'moment';
import 'moment/min/locales';

moment.locale('zh-cn');


class Corpus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            visible: false,
            data: [],
            isLoading: false,
            paginationNumber: 1,
            paginationSize: 10,
            isChecked: false
        };
        this.isAddCategory = this.isAddCategory.bind(this);
    }


    componentWillMount(){
        let { paginationNumber } = this.state;
        let payload = {
            current: paginationNumber
        };
        this.refreshResourceList(payload);
    }

    refreshResourceList(payload){
        this.props.store.FileStore.getResourcesList(payload).then(res => {
            this.setColumnData(this.props.store.FileStore.resourceList);
        });
    }



    setColumnData(resultArr){
        const arr = [];
        resultArr.map((res) => {
            const result = {};
            result.name = res.title;
            result.age = res.createTime;
            result.id = res.id;
            result.isCorpus = res.isCorpus;
            result.isLoading = res.isLoading;
            result.checkTimes = res.checkTimes;
            arr.push(result);
        })
        this.setState({
            data: arr,
        })
    }



    setIsLoadingStatus(index,param){
        const arr = this.props.store.FileStore.resourceList;

        arr[index].isLoading = param;
        this.setState({
            data : arr,
        });
    }


    onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }


  handleDelete = (record) => {
      const { paginationNumber, paginationSize} = this.state;
      let documentTotalCount = this.getTotalCount();
      let lastPage = Math.ceil(documentTotalCount/paginationSize);
      if(lastPage === paginationNumber){
          let Item = documentTotalCount % paginationSize;
          if(Item === 1 && lastPage !== 1){
              this.props.store.FileStore.deleteResource(record.id).then(response =>{
                      if (response.status === 200){
                          let page = paginationNumber - 1;
                          this.setState({
                              paginationNumber: page,
                          });
                          let payload ={
                              current: page,
                          };
                          this.refreshResourceList(payload);
                      }
                  }
              )
          }else{
              this.props.store.FileStore.deleteResource(record.id).then(response =>{
                      if (response.status === 200){
                          let payload = {
                              current: paginationNumber,
                          };
                          this.refreshResourceList(payload);
                      }
                  }
              )
          }
      }else{
          this.props.store.FileStore.deleteResource(record.id).then(response =>{
                  if (response.status === 200){
                      this.props.store.FileStore.getResourcesList(paginationNumber).then(res => {
                          this.setIsLoadingStatus()
                      })
                  }
              }
          )
      }
  }

  handleDownload = (obj) => {
      this.props.store.FileStore.downLoadFile(obj).then((response)=>{
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

  setLoadingStatus(param){
      this.props.store.FileStore.getResourcesList(param.paginationNumber).then(res => {
          let index = this.props.store.FileStore.findItemById(param.id);
          if(index !== -1){
              this.props.store.FileStore.setIsLoadingStatus(index,param.loading);
              this.setColumnData(this.props.store.FileStore.resourceList);
          }
      });
  }

    isAddCategory = (checked,record) => {
        const { paginationNumber } = this.state;
        let payload = {
            paginationNumber : paginationNumber,
            id: record.id,
            loading: true,
        };
        this.setLoadingStatus(payload);
        if(checked){
            this.props.store.FileStore.addCorpus(record.id).then(response =>{
                if(response.status === 200){
                    payload.loading = false;
                    this.setLoadingStatus(payload);
                }else {
                    message.error('加入语料库失败');
                }
            })
        }else {
            this.props.store.FileStore.removeCorpus(record.id).then(response =>{
                if(response.status === 200){
                    payload.loading = false;
                    this.setLoadingStatus(payload);
                }else {
                    message.error('移出语料库失败');
                }
            })
        }
    }

    getTotalCount() {
        return this.props.store.FileStore.resourceCount;
    }


    onChange(pageNumber){
        this.setState({
            paginationNumber: pageNumber
        });
        let payload = {
            current: pageNumber,
        };
        this.refreshResourceList(payload);
    }

    handleChange = info => {
        let fileList = [...info.fileList];
    }

    searchDocument = (value) =>{
        let payload = {
            current: 1,
            condition: {title: value},
        };
        this.refreshResourceList(payload);
    }


    render() {
      const  { data ,isChecked} = this.state;
      const columns = [
          {
              title: 'id',
              render: (text, record, idx) => idx,
          },
          {
              title: '文档名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => <Link to={`/corpus/${record.id}`}>{text}</Link>,
          },
          {
              title: '导入时间',
              dataIndex: 'age',
              key: 'age',
              render: t => moment(t).format('YYYY MMMM Do, a h:mm:ss')
          },
          {
              title: '查重次数',
              dataIndex: 'checkTimes',
              key: 'checkTimes',
          },
          {
              title: '加入语料库',
              key: 'action1',
              render: (text,record) =>(<span>
                  {record.isLoading  ? (<Spin size='small'/> ) :(<Switch defaultChecked={record.isCorpus} onChange={(checked) => this.isAddCategory(checked,record)} />)}
              </span>),
          },
          {
              title: '下载 | 删除',
              key: 'action',
              render: (text, record) => (
                  <span>
        <a href="javascript:;" title={'下载'} onClick={() => this.handleDownload(record)} ><Icon type="download"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" title={'删除'} onClick={() => this.handleDelete(record)}><Icon type="delete" /></a>
      </span>
              ),
          },
      ];

      const paginationConfig = {
          showQuickJumper: true,
          onChange: (page,pageSize) => {this.onChange(page,pageSize)},
          defaultCurrent: 1,
          total : this.getTotalCount(),
      };

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
        customRequest: ({file}) => {
            this.props.store.FileStore.upLoadFile (file).then(res => {
                const { paginationNumber } = this.state;
                if(res.status === 200){
                    message.success("上传成功");
                    let payload = {
                        current: paginationNumber,
                    };
                    this.refreshResourceList(payload);
                }
            })
        },
        onChange: this.handleChange,
    };

    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>语料列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card title={'文档中心'}>
          <Row gutter={16}>
            <Col span={18} >
              <Upload howUploadList={false} multiple={true} showUploadList={false} {...props} style={{display: 'inline-block'}}>
                <Button type={'primary'}>
                  <Icon type="upload" /> 上传文档
                </Button>
              </Upload>
            </Col>
            <Col span={6} >
              <Input.Search
                placeholder="输入文档名称查询"
                onSearch={value => this.searchDocument(value)}
                style={{ width: 200 }}
                allowClear
              />
            </Col>
            {/*<Col span={12} >*/}
              {/*<Button style={{float: 'right'}}><Icon type="reload" /> 刷新</Button>*/}
            {/*</Col>*/}
          </Row>
          <Table columns={columns} dataSource={data} pagination={paginationConfig} style={{marginTop: 20}}/>
        </Card>
      </div>
    )
  }
}

export default inject('store')(observer(Corpus));
