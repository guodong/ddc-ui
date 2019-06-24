import {isNull} from "../utils/utils";
import {types, flow, getRoot} from 'mobx-state-tree';
import { notification } from 'antd';
import  API from"../common/config";
// import request from '../utils/request';

import md5 from 'md5';
import { setLocalData } from '../utils/localData';
import request from '../utils/request';



export const logInStore = types.model('logInStore',{
  is_login: localStorage.getItem('isLogin') ? true : false,
}).views(self => ({
  get isLogin() {
    return self.is_login
  }
})).actions(self => {

    function setIsLogin(flag) {
        self.is_login = flag;
        localStorage.setItem('isLogin',flag);
    }

    function getIsLogIn() {
        return self.is_login;
    }

    const goLogin = flow(function*(userName,passWord) {
      const  payload = {};
      payload.account = userName;
      payload.password = passWord;
      // payload.password = md5(passWord);
      const response = yield request(API +`/auth`,{
          method: 'POST',
          body: payload,
      }).then(res => res.json());
        // console.log('1111111',response.status);
        if(response.status === 200){
            // localStorage.removeItem('token');
            localStorage.setItem('token',response.data);
            setIsLogin(true);
        }
        return response;
      // if(isNull(response.data)){
      //   notification.error({
      //       message: '后端出错',
      //       description: '请联系后端',
      //   });
      // }else {
      //   localStorage.removeItem('token');
      //   localStorage.setItem('token',response.data);
      //   setIsLogin(true);
      // }
    })


    return{
      setIsLogin,
      goLogin,
      getIsLogIn
    }
})

