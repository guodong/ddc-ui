import {types, flow, getRoot} from 'mobx-state-tree';

export const Store = types.model({
  is_login: localStorage.getItem('isLogin') ? true : false
}).views(self => ({
  get isLogin() {
    return self.is_login
  }
})).actions(self => ({
  setIsLogin(flag) {
    self.is_login = flag
    localStorage.setItem('isLogin', flag)
  }
}))
