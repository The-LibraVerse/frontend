import server from '/src/api/server.js';
import { signMessage } from '/src/api/wallet.js';

export function login(data) {
    return server('/login', data)
}

export function logout() {
    return server('/logout', null, 'DELETE')
}

export function loginWithWallet() {
    return server('/connect-wallet')
        .then(res => {
            console.log('res:', res);

            return signMessage(res.message)
        }).then(res => {
            console.log('do yo uyave it??', res);
            return server('/connect-wallet', {message: res}, 'PUT');
        });
}

export function signup(data) {
    return server('/signup', data);
}

export function fetch(id) {
    if(id)
        return server('/user/' + id)
    else
        return server('/user')
}

export function fetchDashboard(id) {
    if(id)
        return server('/user/' + id + '/dashboard')
    else
        return server('/dashboard')
}

export function isLoggedIn() {
    return server('/auth')
        .then(res => {
            if(res.logged_in == true)
                return true
            else return false;
        })
        .catch(e => false);
}
