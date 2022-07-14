import server from '/src/api/server.js';

export function login(data) {
    return server('/login', data)
}

export function logout() {
    return server('/logout', null, 'DELETE')
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
