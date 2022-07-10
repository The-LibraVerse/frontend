export default function(uri, body, method='POST') {
    let isError;
    const otherConfig = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    return (() => {
        if(body) {
            body = JSON.stringify(body);
            return fetch(uri, {method, body, ...otherConfig})

        }
        else
            return fetch(uri, otherConfig)
    })()
        .then(res => {
            if(!res.ok) isError = true;
            return res.json()
        })
        .then(res => {
            if(isError) throw res
            else
                return res;
        });
}
