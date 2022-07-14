import { API } from '/config.local.js';
import fetcher from './fetcher.js';

export default function(path, body, method, autoReload) {
    // console.log('method:', method);
    if(!body && ['PUT', 'POST'].includes(method)) {
        body = {};
    }

    // console.log('method:', method);

    if(body || ['PUT', 'POST'].includes(method)) {
        if(!autoReload)
            autoReload=true
    }

    // console.log('auto reload:', autoReload);

    const uri = API + path;
    return fetcher(uri, body, method)
        .then(res => {
            if(autoReload)
                window.location.reload();

            return res;
        });
}
