import { API } from '/config.local.js';
import fetcher from './fetcher.js';

export default function(path, body, method='POST') {
    const uri = API + path;
    return fetcher(uri, body, method)
        .then(res => {
            return res;
        });
}
