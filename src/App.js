import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Layout, Menu, Breadcrumb, Icon, Dropdown} from 'antd';
import Corpus from "./Corpus";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Check from "./Check";
import Create from "./check/Create";
import CorpusCreate from './corpus/Create';
import CorpusInfo from "./CorpusInfo";
import Login from "./Login";
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import MyHeader from "./MyHeader";

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  state = {
    collapsed: false,
    isLogin: false
  };

  onClick({key}) {
    if (key == 'logout') {
      this.props.store.setIsLogin(false);
      this.props.history.push('/login')
    }
  };

  render() {
    const menu = (
      <Menu onClick={this.onClick}>
        <Menu.Item key="info">
          <a href="#"><Icon type="info-circle"/> 个人信息</a>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout"><Icon type="logout"/> 退出</Menu.Item>
      </Menu>
    );

    return (
      <Router>
        <Layout style={{minHeight: '100vh'}} className="layout">
          <MyHeader/>
          <Route path={`/login`} component={Login}/>
          <Content style={{padding: '0 50px 50px'}}>
            {/*<Route path={`/check`} exact component={Check}/>*/}
            {/*<Route path={`/check/create`} component={Create}/>*/}
            <Route path={`/`} exact component={Corpus}/>
            <Route path={`/corpus/:id`} exact component={CorpusInfo}/>
          </Content>
          <Footer style={{textAlign: 'center'}}>文档查重系统 v1.0.0 ©2019</Footer>
        </Layout>
      </Router>
    );
  }
}

export default inject('store')(observer(App));
