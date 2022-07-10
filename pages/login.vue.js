import * as userAPI from '/src/api/user.js';

const app = Vue.createApp({
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

app.mount('#login');
