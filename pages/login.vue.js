import * as userAPI from '/src/api/user.js';
import ConnectWallet from '/shared/connectWallet.js';

const app = Vue.createApp({
    components: {'connect-wallet': ConnectWallet},
    data() {
        return {
            username: null,
            password: null,
            showSignup: true,
        }
    },

    methods: {
        login() {
            const username = this.username;
            const password = this.password;

            return userAPI.login({ username, password })
        },
        signup() {
            const username = this.username;
            const password = this.password;

            return userAPI.signup({ username, password })
        }
    },
});

/*
app.config.compilerOptions.isCustomElement = (tag) => {
    console.log('tag:', tag, tag == 'connectwallet');
    return tag == 'ConnectWallet';
}
*/

// app.component('ConnectWallet', ConnectWallet);

app.mount('#login');
