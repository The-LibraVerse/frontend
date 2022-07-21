import { showLoader, showPreloader, hideLoader } from '/src/loaderFunctions.js';
import { hideToast, showToast } from '/src/toastFunctions.js';

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
            showPreloader();

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

            if(isError) {
                console.log('res:', res);
                showToast(res);
                throw res
            }
            else
                return res;
        }).catch(e => {
            const message = (e.message == "Failed to fetch") ? "Failed to fetch. Please refresh" :
                (e.error && e.error.message) ? e.error.message :
                "Error loading resource. Please try again later";

            console.log('res:', e);
            showToast(message);
            throw e
        });
}
