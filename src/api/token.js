import { ethers } from '/dependencies/ethers-5.6.esm.min.js';

import { LIBRAVERSE_TOKEN as _address } from '/config.local.js';
import artifact from '/dependencies/libraverse.artifact.js';
import { provider, signer } from '/src/api/connectWallet.js';

export const address = _address;

export function create(metadataURI, amount) {
    const tokenContract = new ethers.Contract(address, artifact.abi, provider);

    const cWithSigner = tokenContract.connect(signer)
    return cWithSigner.create(metadataURI, amount)
        .then(res => {
            console.log('created token');
            console.log('res:', res);
            return res.wait()
        }).then(res => {
            console.log('waited:', res);
            console.log('for events:', res.events);
            const ev = res.events.filter(e => e.event == 'TransferSingle')[0];
            console.log('ev:', ev);
            console.log('ev:', ev.args.id, ev.args.id.toNumber());
            return ev.args.id.toNumber();
            // return provider.waitForTransaction(res.hash, 1, 4000)
        });
}

export function mint(tokenID) {
    console.log('jfoai ', tokenID);
}
