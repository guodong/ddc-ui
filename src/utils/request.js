import { getLocalData } from './localData';
import {isNull} from "./utils";

export default function request (url ,options) {
    const newOptions = { ...options };
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers,
            };
            console.log("这是在request中",newOptions.body);
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }
    if (!isNull(getLocalData('token'))) {
        newOptions.headers = newOptions.headers || {};
        // newOptions.headers.Authorization = getLocalData('token');
        newOptions.headers.Authorization = localStorage.getItem('token');
    }
    console.log("00000",newOptions);
    return(
        fetch(url,newOptions)
        .then(response => {
            return response.json();
        })
    )
}