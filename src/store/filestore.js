import {types, flow, getRoot, getParent} from 'mobx-state-tree';
import request from '../utils/';

export const File = types
    .model('File',{
        name: types.string,
    }).views(self => ({

    })).actions(self => {
        function setName(name){
            self.name = name;
        }

        return{
            setName,
        }
    })

export const FileStore = types
    .model('FileStore',{
        resourceList: types.array(File),
    }).views(self =>({
        get store() {
            return getParent(self);
        }
    })).actions(self => {
        function pushResourceList(file) {
            self.resourceList.push(file);
        }

        function updateResourceList(json){
            self.resourceList = json;
        }

        const getResourcesList =flow(function* (param) {
            try{
                console.log("333333333",param);
                const response = yield fetch('http://192.168.4.119:9000/documents/page/${param}',{
                    method:'GET',

                }).then(resp => resp.json());
                updateResourceList(response.result);
            }catch (error) {
                console.log("Failed to get resourcelist",error);
            }
        })

        const upLoadFile = flow(function* (file) {
            const formdata = new FormData();
            formdata.append('file',file);
            try{
                const response = yield fetch('http://192.168.4.119:9000/documents/upload',{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                    method: 'POST',
                    body: formdata,
                }).then(response => {return response.json()});
                return response;
            }catch (error) {
               console.log("failed to upload file",error) ;
            }
        })

        return{
            getResourcesList,
            upLoadFile,
            pushResourceList,
        }
    })