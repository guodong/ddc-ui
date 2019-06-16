import { FileStore } from './filestore';
import {types} from 'mobx-state-tree';
import { logInStore } from './logInStore';
import { corpusStore } from './corpusStore';
export const Store = types.model('Store',{
    logInStore: types.optional(logInStore,{}),
    FileStore: types.optional(FileStore,{resourceList:[]}),
    corpusStore: types.optional(corpusStore,{}),
}).views(self => ({

})).actions(self => {
    return {}
})