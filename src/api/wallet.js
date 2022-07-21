import { ethers } from '/dependencies/ethers-5.6.esm.min.js';
import { CHAIN_ID, CHAIN_NAME } from '/config.local.js';
import { hideToast, showToast } from '/src/toastFunctions.js';

import Vuex from '/dependencies/vuex4.js'

export let provider, signer, address;

const store = Vuex.createStore({
    state() {
        return {
            provider,
            signer,
            address
        }
    },
    mutations: {
        signer: (state, payload) => state.signer = payload,
        address: (state, payload) => state.address = payload,
        provider: (state, payload) => state.provider = payload,
    }
});

export function getProvider() {
    return store.state.provider;
}

export function getAddress() {
    return store.state.address;
}

export function getSigner() {
    return store.state.signer;
}

function cacheProvider(walletName) {
    window.localStorage.setItem('isWalletConnected', true);
    window.localStorage.setItem('walletType', 'metamask');
}

export function connect(walletType) {
    if(walletType == 'metamask' || window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, CHAIN_ID);
        store.commit('provider', provider);
    } else {
        showToast('MetaMask wallet not detected. This site currently only supports the MetaMask');
    }

    if(provider) {
        return provider.send('eth_requestAccounts', [])
            .then(() => {
                console.log('wg');
                signer = provider.getSigner();
                store.commit('signer', signer);
                return signer.getAddress();
            }).then(res => {
                console.log('wg1');
                address = res;
                store.commit('address', address);

                return signer.getChainId()
            }).then(res => {
                console.log('wg2');
                cacheProvider('metamask');
                return signer;
            })
            .catch(e => {
                console.log('erorr connecting:', e, e.message)
                if(e.message.includes('underlying network changed')) {
                    showToast('Wrong chain/network.\nPlease connect your ethereum wallet to the ' + CHAIN_NAME + ' network');
                }
            });
    } else return Promise.reject('failed');
}

export function disconnect() {
    window.localStorage.removeItem('isWalletConnected');
    window.localStorage.removeItem('walletType');

    window.location.reload();
}

export function signMessage(message) {
    let promiseChain = Promise.resolve();
        if(!signer)
            promiseChain = connect()

    return promiseChain
        .then(() => {
            if(!signer)
                throw new Error('No signer');
            
            return signer.signMessage(message)
            .then(res => {
                return res;
            });
        });
}

function main() {
    const isWalletConnected = window.localStorage.getItem('isWalletConnected');
    const walletType = window.localStorage.getItem('walletType');

    if(isWalletConnected) {
        return connect(walletType);
    }
}

main()
