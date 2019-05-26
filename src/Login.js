import React from 'react';
import {Button, Card, Checkbox, Icon, Input} from "antd";
import {Form} from "antd";
import {withRouter} from 'react-router-dom'
import {inject, observer} from "mobx-react";


class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.store.setIsLogin(true);
        this.props.history.push('/')
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账号!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住账号</Checkbox>)}
          <a className="login-form-forgot" href="">
            忘记密码？
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = inject('store')(observer(withRouter(Form.create({ name: 'normal_login' })(NormalLoginForm))));


class Login extends React.Component {
  render() {
    return (
      <div style={{height: 'calc(100vh - 183px)', position: 'relative', backgroundImage: 'url(http://img.leikeji.com/resource/img/4c60dee2bc5849beae5b8a342c928563.jpg)', backgroundSize: 'cover'}}>
      <div style={{width: 400, float:'right', marginRight: '50px', marginTop: 50}}>
        <Card title={'用户登陆'}>
          <WrappedNormalLoginForm/>
        </Card>
      </div>
      </div>
    )
  }
}

export default (Login);
