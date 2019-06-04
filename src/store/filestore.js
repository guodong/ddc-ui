import {types, flow, getRoot, getParent} from 'mobx-state-tree';
import request from '../utils/request';

export const File = types
    .model('File',{
        createTime : types.string,
        title: types.string,
        ddcProperties: types.string,
        filePath: types.string,
        id: types.string,
        isCorpus: types.number,
        size: types.string,
        status: types.string,
        type: types.string,
        updateTime: types.string,
        userId: types.string,
        version: types.string,
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
            self.resourceList.push({
                createTime: file.createTime,
                title: file.title,
                ddcProperties: file.ddcProperties,
                filePath: file.filePath,
                id: file.id,
                isCorpus: file.isCorpus,
                size: file.size,
                status: file.status,
                type: file.type,
                updateTime: file.updateTime,
                userId: file.userId,
                version: file.version,
            });
            console.log('777777777777',self.store.FileStore.resourceList.length);
        }

        function updateResourceList(json){
            if(json.length !== 0){
                json.forEach(res => {
                    pushResourceList(res);
                })
            }
            return self.resourceList;
        }

        const getResourcesList = flow(function* () {
            try{
                // const response = yield fetch('http://192.168.4.119:9000/documents/page/${param}',{
                //     method:'GET',
                //
                // }).then(resp => resp.json());

                // const response = yield request('http://192.168.4.119:9000/documents/page');
                self.resourceList = [];
                const response = yield fetch('http://192.168.4.119:9000/documents/page',{
                    method:'GET',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization':localStorage.getItem('token'),
                    }
                }).then(response =>  response.json());
                return updateResourceList(response.data.records);
            }catch (error) {
                console.log("Failed to get resourcelist",error);
            }
        })

        const upLoadFile = flow(function* (file) {
            console.log("6666666",file);
            const formdata = new FormData();
            formdata.append('file',file);
            try{
                const response = yield fetch('http://192.168.4.119:9000/documents/upload',{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'Authorization':localStorage.getItem('token'),
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
            updateResourceList,
        }
    })