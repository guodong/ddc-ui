import {types, flow, getRoot, getParent} from 'mobx-state-tree';
import request from '../utils/request';
import { stringify } from 'qs';


export const File = types
    .model('File',{
        createTime : types.string,
        ext: types.string,
        fileSize: types.string,
        id: types.string,
        isCorpus: types.number,
        size: types.string,
        status: types.string,
        title: types.string,
        type: types.string,
        updateTime: types.string,
        userId: types.string,
        isLoading: false,
    })

export const FileStore = types
    .model('FileStore',{
        resourceList: types.array(File),
        resourceCount: types.number,
    }).views(self =>({
        get store() {
            return getParent(self);
        }
    })).actions(self => {
        function setResourceCount(resCount) {
            self.resourceCount = parseInt(resCount,10);
        }

        function pushResourceList(file) {
            self.resourceList.push({
                createTime: file.createTime,
                ext: file.ext,
                fileSize: file.fileSize,
                id: file.id,
                isCorpus: file.isCorpus,
                size: file.size,
                status: file.status,
                title: file.title,
                type: file.type,
                updateTime: file.updateTime,
                userId: file.userId,
                // isLoading: false,
            });
        }

       function findItemById(id){
            let index = -1;
            let len = self.resourceList.length;
            for (let i = 0; i < len; i++){
                index += 1;
                if(self.resourceList[i].id === id){
                    return index;
                }
            }
            return -1;
        }

        function setIsLoadingStatus(index,param){
            self.resourceList[index].isLoading = param;
        }


        function updateResourceList(arr){
            if(arr.length !== 0){
                arr.forEach(res => {
                    pushResourceList(res);
                })
            }
            return self.resourceList;
        }

        const deleteResource = flow(function* (fileId) {
            try{
                const response = yield fetch(`http://192.168.2.2:9000/documents/${fileId}`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                    method : 'DELETE',
                });
                return response.json();
            }catch (error) {
                    console.log("Failed to delete resourcelist",error);
            }
        })

        const getResourcesList = flow(function* (pageNumber) {
            try{
                let param = {
                    current: pageNumber,
                };
                self.resourceList = [];
                const response = yield fetch(`http://192.168.2.2:9000/documents/page?${stringify(param)}`,{
                    method:'GET',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': localStorage.getItem('token'),
                    }
                }).then(response =>  response.json());
                setResourceCount(response.data.total);
                return updateResourceList(response.data.records);
            }catch (error) {
                console.log("Failed to get resourcelist",error);
            }
        })

        const downLoadFile = flow(function* (payload) {
            try{
                const response = fetch(`http://192.168.2.2:9000/documents/${payload.id}/download`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                });
                return response;
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        const upLoadFile = flow(function* (file) {
            const formdata = new FormData();
            formdata.append('file',file);
            try{
                const response = yield fetch('http://192.168.2.2:9000/documents/upload',{
                    headers:{
                        // 'Content-Type': 'multipart/form-data',
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

        const addCorpus = flow(function* (payload) {
            try{
                const response = fetch(`http://192.168.2.2:9000/documents/${payload}/corpus`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                    method:'POST'
                }).then(res => res.json());
                console.log("99999999999",response);
                return response;
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        const removeCorpus = flow(function* (payload) {
            try{
                const response = fetch(`http://192.168.2.2:9000/documents/${payload}/corpus`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                    method:'DELETE'
                }).then(res => res.json());
                return response;
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        return{
            getResourcesList,
            upLoadFile,
            pushResourceList,
            updateResourceList,
            downLoadFile,
            deleteResource,
            addCorpus,
            removeCorpus,
            setIsLoadingStatus,
            findItemById,
        }
    })