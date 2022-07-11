import { isLoggedIn } from '/src/api/user.js';
import connectWallet from '/src/api/connectWallet.js';

const app = Vue.createApp({
    template: `
        <div>
            <a href='/'>Libraverse</a>
            <a v-if='!loggedIn' class='right' href='/login'>Login</a>
            <a v-if='loggedIn' class='right' href='/dashboard'>Dashboard</a>
            <a v-if='loggedIn' class='right' href='/profile'>Profile</a>

            <button @click='connectWallet'>Connect Wallet</button>
        </div>
    `,
    data() {
        return {
            loggedIn: null
        }
    },
    methods: {
        connectWallet
    },
    mounted() {
        return isLoggedIn()
        .then(res => this.loggedIn = res);
    }
});

app.mount('#menu');
