import {types, flow} from 'mobx-state-tree';
import { stringify } from 'qs';
import request from '../utils/request';
import  API from"../common/config";


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
        updateTime: types.string,
        documentTitle: types.string
    })

export const corpus = types
    .model('corpus',{
        title: types.string,
        fileSize: types.string,
        paragraph: types.number,
    })

export const corpusStore = types
    .model('corpusStore',{
        checkList: types.array(check),
        corpusDetail: types.map(corpus),
        checkListCount: types.number,
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

        function setCheckListCount(param) {
            self.checkListCount = parseInt(param,10);
        }

        function setCorpusDetail(corpus){
            self.corpusDetail.title = corpus.title;
            self.corpusDetail.paragraph = corpus.totalParagraph;
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
                documentTitle: param.document.title,
            });

        }

        const getCorpusById = flow(function* (id) {
            try{
                const response = yield request(API + `/documents/${id}`,{
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

        const getCheckList = flow(function* (payload) {
            try{
                // let query = {
                //     condition:{document_id: id},
                //     current: pageNumber,
                // };
                self.checkList = [];
                const response = yield request(API + `/jobs/page?${stringify(payload)}`,{
                    method:'GET',
                }).then(res => res.json());
                if (response.status === 200){
                    setCheckListCount(response.data.total);
                    return updateCheckList(response.data.records);
                }
            }catch (error) {
                console.log("Failed to get resourcelist",error);
            }
        })

        const downLoadCheck = flow(function* (payload) {
            try{
                const response = yield request(API + `/jobs/${payload.id}/download`,{
                    method: 'GET'
                });
                return response;
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        const removeCheck = flow(function* (id) {
            try{
                const response = yield request(API + `/jobs/${id}`,{
                    method:'DELETE',
                }).then(res => res.json());
                return response;
            }catch (error) {
                console.log("failed to download file",error) ;
            }
        })

        const createCheck = flow(function* (payload) {
            try {
                const response = yield request(API + '/jobs',{
                    method:'POST',
                    body: payload,
                    // body: JSON.stringify(payload)
                }).then(res => res.json());
                return response;
            }catch (error) {
                console.log("failed to create check",error);
            }
        })


        return{
            getCorpusById,
            getCheckList,
            downLoadCheck,
            removeCheck,
            createCheck,
        }
    })
