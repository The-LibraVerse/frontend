import { ethers } from '/dependencies/ethers-5.6.esm.min.js';

export default function() {
    let provider;
    console.log('ethers:', ethers);

    if(window.ethereum)
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    if(provider) {
        return provider.send('eth_requestAccounts', [])
            .then(() => {
                const signer = provider.getSigner();
                return signer.getAddress();
            }).then(address => {
                console.log('Account:', address);
            });
    } else return Promise.reject('failed');
}


