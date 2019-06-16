import {types, flow} from 'mobx-state-tree';
import { stringify } from 'qs';

export const check = types
    .model('check',{
        compareAccount: types.number,
        createTime: types.string,
        documentId: types.string,
        finishedId: types.string,
        id: types.string,
        isFinished: types.number,
        repetitionRate: types.number,
        type: types.string,
        updateTime: types.string
    })

export const corpus = types
    .model('corpus',{
        documentSaveName: types.string,
        fileSize: types.string,
    })

export const corpusStore = types
    .model('corpusStore',{
        checkList: types.array(check),
        corpusDetail: types.map(corpus),

    }).views(self => ({

    })).actions(self => {
        function updateCheckList(arr){
            if(arr.length !== 0){
                arr.forEach(res => {
                    pushCheckList(res);
                })
            }
            return self.checkList;
        }

        function setCorpusDetail(corpus){
            self.corpusDetail.documentSaveName = corpus.documentSaveName;
            self.corpusDetail.paragraph = corpus.paragraph;
            self.corpusDetail.fileSize = corpus.fileSize;
        }

        function pushCheckList(param) {
            self.checkList.push({
                compareAccount: param.compareAccount ,
                createTime: param.createTime,
                documentId: param.documentId,
                finishedId: param.finishedId,
                id: param.id,
                isFinished: param.isFinished,
                repetitionRate: param.repetitionRate,
                type: param.type,
                updateTime: param.updateTime,
            });

        }

        const getCorpusById = flow(function* (id) {
            try{
                const response = yield fetch(`http://192.168.2.2:9000/documents/${id}`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                    method: 'GET'
                }).then(res => res.json());
                if(response.status === 200){
                    setCorpusDetail(response.data);
                }
                return response;
            }catch (error) {
                console.log("get corpus failed");
            }
        })

        const getCheckList = flow(function* (id) {
            try{
                let query = {
                    condition:{document_id: id}
                };
                self.checkList = [];
                const response = yield fetch(`http://192.168.2.2:9000/jobs/page?${stringify(query)}`,{
                    method:'GET',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization':localStorage.getItem('token'),
                    }
                }).then(response =>  response.json());
                return updateCheckList(response.data.records);
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

        const removeCheck = flow(function* (payload) {
            try{
                const response = fetch(`http://192.168.2.2:9000/documents/${payload}/corpus`,{
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    },
                    method:'DELETE'
                });
                return response.json();
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        return{
            getCorpusById,
            getCheckList,
            downLoadFile,
            removeCheck,
        }
    })
