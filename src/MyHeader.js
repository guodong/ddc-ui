import React from "react";
import {inject, observer} from "mobx-react";
import {Dropdown, Icon, Layout} from "antd";
import {Menu} from "antd";
import {withRouter} from "react-router";
const {Header} = Layout;

class MyHeader extends React.Component {
  onClick({key}) {
    if (key == 'logout') {
      this.props.store.setIsLogin(false);
      this.props.history.push('/login')
    }
  };
  render() {
    const menu = (
      <Menu onClick={this.onClick.bind(this)}>
        <Menu.Item key="info">
          <a href="#"><Icon type="info-circle"/> 个人信息</a>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout"><Icon type="logout" /> 退出</Menu.Item>
      </Menu>
    );
    return (
      <Header>
        <span className='logo'>文档查重系统</span>
        {this.props.store.isLogin &&
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#" style={{float: 'right'}}>
            <Icon type="user"/> 操作员001<Icon type="down"/>
          </a>
        </Dropdown>
        }

      </Header>
    )
  }
}

export default inject('store')(observer(withRouter(MyHeader)));
