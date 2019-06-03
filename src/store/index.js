import { FileStore } from './filestore';
import {types} from 'mobx-state-tree';
import { logInStore } from './logInStore';
export const Store = types.model('Store',{
    logInStore: types.optional(logInStore,{}),
    FileStore: types.optional(FileStore,{})
}).views(self => ({

})).actions(self => {
    return {}
})