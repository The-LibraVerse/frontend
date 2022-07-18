import { showLoader, hideLoader } from '/src/loaderFunctions.js';

export default function(uri, body, method) {
    let isError;
    const otherConfig = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    return (() => {
        if(body) {
            showLoader();

            if(!method)
                method = 'POST';
            body = JSON.stringify(body);
            return fetch(uri, {method, body, ...otherConfig})

        }
        else {
            if(!method || method=='POST' || method == 'PUT')
                method = 'GET';
            return fetch(uri, {...otherConfig, method})
        }
    })()
        .then(res => {
            if(!res.ok) isError = true;
            return res.json()
        })
        .then(res => {
            hideLoader();

            if(isError) throw res
            else
                return res;
        });
}
