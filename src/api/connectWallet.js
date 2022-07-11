import { ethers } from '/dependencies/ethers-5.6.esm.min.js';
import { CHAIN_ID } from '/config.local.js';

export let provider, signer;

export default function() {
    if(window.ethereum)
        provider = new ethers.providers.Web3Provider(window.ethereum, CHAIN_ID);

    if(provider) {
        return provider.send('eth_requestAccounts', [])
            .then(() => {
                signer = provider.getSigner();
                return signer.getAddress();
            }).then(address => {
                console.log('Account:', address);
                return signer.getChainId()
            }).then(res => {
                console.log('chain id:', res);
            });
    } else return Promise.reject('failed');
}


