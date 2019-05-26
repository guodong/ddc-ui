import React from 'react';
import {Button, Upload, Form, Icon, message, Input, InputNumber} from "antd";
import {Breadcrumb} from "antd";

const Dragger = Upload.Dragger;
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 8},
};

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

    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div style={{maxWidth: 600}}>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>文档查重</Breadcrumb.Item>
          <Breadcrumb.Item>创建查重任务</Breadcrumb.Item>
        </Breadcrumb>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="查重阈值">
            {getFieldDecorator('website', {
              rules: [{required: true, message: '请输入查重阈值'}],
              initialValue: '100'
            })(
              <InputNumber
                // defaultValue={100}
                min={0}
                max={80}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={() => {}}
              />
            )}
          </Form.Item>
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

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Create);

export default WrappedNormalLoginForm;
