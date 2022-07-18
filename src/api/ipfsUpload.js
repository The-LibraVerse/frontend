import { IPFS_API, IPFS_GATEWAY } from '/config.local.js';
import IpfsHttpClient from '/dependencies/ipfs-http-client.js';
import { showLoader, hideLoader } from '/src/loaderFunctions.js';

export default function(data, name) {
    showLoader();
    if(!data)
        return Promise.reject('No file');

    const url =  IPFS_API + '/api/v0';
    let path = name;
    if(!name)
        path = 'file' + (Math.random() * 1000);

    if(data == null || data == undefined)
        return Promise.reject("Can't upload null or undefined");

    const content = (data instanceof File || typeof data == 'string') ? data :
        (['number', 'boolean'].includes(typeof data)) ? data.toString() :
        (typeof data == 'object' && data != null) ? JSON.stringify(data) : data;

    // return Ipfs.create()
    const client = IpfsHttpClient.create({ url })
    return client.add({ content, path})
        .then(res => {
            const cidv1 = res.cid.toV1().toString();

            let gatewayUrl = IPFS_GATEWAY;

            if(/^http/.test(gatewayUrl)) {
                gatewayUrl = gatewayUrl.replace(/^https?:\/\//, '');
                gatewayUrl = gatewayUrl.replace(/\/ipfs/, '');
                gatewayUrl = gatewayUrl.replace(/\/$/, '');
            }


            let fileUrl = /^https?/.test(IPFS_GATEWAY) ? 
                IPFS_GATEWAY.match(/^https?:\/\//)[0] : 'https://';

            fileUrl += cidv1 + '.ipfs.' + gatewayUrl

            hideLoader();

            return {cidv1, url: fileUrl };
        });

}
