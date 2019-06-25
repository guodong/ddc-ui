import { getLocalData } from './localData';
import { notification } from 'antd';
import {isNull} from "./utils";




const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const checkStatus = response => {
    if (response.status === 401 || response.status === 403) {
        const errortext = codeMessage[response.status] || response.statusText;
        // notification.error({
        //   message: `请求错误 ${response.status}: ${response.url}`,
        //   description: errortext,
        // });
        const error = new Error(errortext);
        error.name = response.status;
        error.response = response;
        throw error;
    }

    const newResponse = response.clone();
    newResponse.json().then(data => {
        if (data.status < 200 || data.status > 300) {
            notification.error({
                message: data.message,
                description: data.status,
            });
        }
    });
    return response;
};

export default function request (url ,options) {
    const defaultOptions = {};
    const newOptions = { ...options ,...defaultOptions};
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'||
        newOptions.method === 'GET'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                // 'Access-Control-Allow-Origin':'*',
                // 'Access-Control-Allow-Methods':'POST,GET,OPTIONS,DELETE',
                // 'Access-Control-Allow-Headers': 'authorization,content-type',
                ...newOptions.headers,
            };
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }
    if (!isNull(localStorage.getItem('token'))) {
        // newOptions.headers = newOptions.headers || {};
        // newOptions.headers.Authorization = getLocalData('token');
        newOptions.headers.Authorization = localStorage.getItem('token');

    }
    return(
        fetch(url,newOptions)
         .then(checkStatus)
         .catch(e => {
            const status = e.name;
             if (status === 401){
                window.location.href = "http://ddc.kfcoding.com";
             }
         })

        // fetch(url,newOptions)
        // .then(response => {
        //     return response.json();
        // })
    )
}