import { getLocalData } from './localData';
import {isNull} from "./utils";

export default function request (url ,options) {
    const defaultOptions = {
        credentials: 'include',
    };
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
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST,GET,OPTIONS,DELETE',
                'Access-Control-Allow-Headers': 'authorization,content-type',
                ...newOptions.headers,
            };
            console.log("777777777",newOptions.headers);
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
        console.log("44444444",localStorage.getItem('token'));
    }
    console.log("00000",newOptions);
    return(
        fetch(url,newOptions)
        .then(response => {
            return response.json();
        })
    )
}