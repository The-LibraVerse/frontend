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
            if(isError) throw res
            else
                return res;
        });
}
