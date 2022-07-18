import { API } from '/config.local.js';
import fetcher from './fetcher.js';
import { hidePreloader, setPreloaderMessage } from '/src/preloaderFunctions.js';

export default function(path, body, method, autoReload) {
    if(!body && ['PUT', 'POST'].includes(method)) {
        body = {};
    }

    if(body || ['PUT', 'POST'].includes(method)) {
        if(!autoReload)
            autoReload=true
    }

    const uri = API + path;
    return fetcher(uri, body, method)
        .then(res => {
            if(autoReload)
                window.location.reload();

            hidePreloader();
            return res;
        }).catch(e => {
            // setPreloaderMessage('Failed to load');
            throw e;
        });
}
