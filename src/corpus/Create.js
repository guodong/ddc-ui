import React from 'react';
import {Button, Upload, Form, Icon, message, Input, InputNumber} from "antd";
import {Breadcrumb} from "antd";

class Create extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div style={{maxWidth: 600}}>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>语料库管理</Breadcrumb.Item>
          <Breadcrumb.Item>语料导入</Breadcrumb.Item>
        </Breadcrumb>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="上传文档">
            <div className="dropbox">
              {getFieldDecorator('dragger', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽至此处上传</p>
                  <p className="ant-upload-hint">支持单个文档或多文档上传.</p>
                </Upload.Dragger>,
              )}
            </div>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              开始查重任务
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const CorpusCreate = Form.create({name: 'normal_login'})(Create);

export default CorpusCreate;
