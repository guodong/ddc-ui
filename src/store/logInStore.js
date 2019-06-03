import {isNull} from "../utils/utils";
import {types, flow, getRoot} from 'mobx-state-tree';
import { notification } from 'antd';
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
      // const response = yield fetch('http://192.168.4.119:9000/auth',{
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //     method: 'POST',
      //     body: JSON.stringify(payload)
      // }).then(resp => resp.json());
      const response = yield request('http://192.168.4.119:9000/auth',{
            method: 'POST',
            body: payload,
        });
      if(isNull(response.data)){
        notification.error({
            message: '后端的锅，找老毕解决赶快解决，别再找前端了。。。。',
            description: '赶快干活',
        });
      }else {
        console.log("1111",response.data);
        localStorage.setItem('token',response.data);
        setIsLogin(true);
      }
    })


    return{
      setIsLogin,
      goLogin,
      getIsLogIn
    }
})

